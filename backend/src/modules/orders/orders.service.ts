import { ORDER_TRANSITIONS, hasPermission, type OrderLine, type OrderStatus } from "@automotive/shared-types";
import { assertTransition, computeOrderTotals } from "@automotive/utilities";
import type { CreateOrderInput } from "@automotive/validation";
import type { RequestUser } from "../../common/auth";
import { badRequest, forbidden, notFound } from "../../common/http-error";
import { audit } from "../audit/audit.model";
import { Product } from "../catalogue/product.model";
import { releaseStock, reserveStock } from "../inventory/inventory.service";
import { Order } from "./order.model";

const orderNumber = () => `ORD-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
const RESTOCK_ON: OrderStatus[] = ["cancelled", "returned"];

/** Re-reads every price from the database (never trusts the client), reserves stock, splits per vendor. */
export async function createOrders(user: RequestUser, input: CreateOrderInput) {
  const ids = input.lines.map((l) => l.productId);
  const products = await Product.find({ _id: { $in: ids }, listingStatus: "live" });
  if (products.length !== new Set(ids).size) throw badRequest("One or more items are no longer available");

  const byVendor = new Map<string, OrderLine[]>();
  for (const l of input.lines) {
    const p = products.find((x) => x._id === l.productId)!;
    const lines = byVendor.get(p.vendorId) ?? [];
    lines.push({ productId: p._id, title: p.title, quantity: l.quantity, unitPricePaise: p.pricePaise, gstRatePct: p.gstRatePct });
    byVendor.set(p.vendorId, lines);
  }

  const reserved: { productId: string; quantity: number }[] = [];
  try {
    for (const l of input.lines) {
      await reserveStock(l.productId, l.quantity);
      reserved.push(l);
    }
  } catch (err) {
    await Promise.all(reserved.map((r) => releaseStock(r.productId, r.quantity)));
    throw err;
  }

  const channel = user.roles.includes("b2b_buyer") ? "B2B" : "B2C";
  return Promise.all(
    [...byVendor.entries()].map(([vendorId, lines]) =>
      Order.create({
        number: orderNumber(),
        customerId: user.id,
        customerName: user.name,
        vendorId,
        channel,
        lines,
        totals: computeOrderTotals(lines),
        fulfilment: input.fulfilment,
        address: input.address,
        history: [{ status: "placed", at: new Date(), by: user.id }],
      }),
    ),
  );
}

/** Vendors move their own orders forward; customers may only cancel before dispatch or request a return. */
export async function changeStatus(user: RequestUser, orderId: string, to: OrderStatus) {
  const order = await Order.findById(orderId);
  if (!order) throw notFound("Order");
  const isVendor = !!user.vendorId && order.vendorId === user.vendorId && hasPermission(user.roles, "orders:fulfil");
  const isCustomer = order.customerId === user.id && (to === "cancelled" || to === "return_requested");
  if (!isVendor && !isCustomer) throw forbidden("You can't update this order");

  assertTransition(ORDER_TRANSITIONS, order.status, to);
  order.status = to;
  if (to === "delivered") order.deliveredAt = new Date();
  order.history.push({ status: to, at: new Date(), by: user.id });
  await order.save();
  if (RESTOCK_ON.includes(to)) await Promise.all(order.lines.map((l) => releaseStock(l.productId!, l.quantity!)));
  await audit(user.id, `order.${to}`, "order", order._id);
  return order;
}
