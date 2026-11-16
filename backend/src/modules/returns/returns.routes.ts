import { Router } from "express";
import { RETURN_TRANSITIONS, hasPermission, type ReturnStatus } from "@automotive/shared-types";
import { assertTransition, canRequestReturn } from "@automotive/utilities";
import { returnDecisionSchema, returnRequestSchema } from "@automotive/validation";
import { currentUser, requireAuth, requirePortal, vendorIdOf } from "../../common/auth";
import { conflict, forbidden, notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { validateBody } from "../../common/validate";
import { audit } from "../audit/audit.model";
import { releaseStock } from "../inventory/inventory.service";
import { notify, notifyVendor } from "../notifications/notify";
import { Order } from "../orders/order.model";
import { Payment } from "../payments/payment.model";
import { ReturnRequest } from "./return.model";

/** Returns & refunds: customer asks → seller approves/rejects → finance refunds (restocks, marks order returned). */
export const returnsRouter = Router();
returnsRouter.use(requireAuth);

returnsRouter.post("/", validateBody(returnRequestSchema), async (req, res) => {
  const u = currentUser(req);
  const order = await Order.findOne({ _id: req.body.orderId, customerId: u.id });
  if (!order) throw notFound("Order");
  const ok = canRequestReturn({ status: order.status, createdAt: (order.get("createdAt") as Date).toISOString(), deliveredAt: order.deliveredAt?.toISOString() ?? null });
  if (!ok) throw conflict("return_not_allowed", "This order can't be returned (not delivered or past the 7-day window)");
  order.status = "return_requested";
  order.history.push({ status: "return_requested", at: new Date(), by: u.id });
  await order.save();
  const r = await ReturnRequest.create({ orderId: order._id, orderNumber: order.number, customerId: u.id, customerName: order.customerName, vendorId: order.vendorId, reason: req.body.reason, note: req.body.note, amountPaise: order.totals!.totalPaise });
  await notifyVendor(order.vendorId, "New return request", `${order.customerName} asked to return ${order.number}.`);
  send(res, r.toJSON(), 201);
});

returnsRouter.get("/mine", async (req, res) => {
  send(res, (await ReturnRequest.find({ customerId: currentUser(req).id }).sort({ createdAt: -1 })).map((r) => r.toJSON()));
});

returnsRouter.get("/vendor", async (req, res) => {
  send(res, (await ReturnRequest.find({ vendorId: vendorIdOf(req) }).sort({ createdAt: -1 })).map((r) => r.toJSON()));
});

returnsRouter.get("/", requirePortal("admin-portal"), async (_req, res) => {
  send(res, (await ReturnRequest.find().sort({ createdAt: -1 }).limit(200)).map((r) => r.toJSON()));
});

returnsRouter.post("/:id/decision", validateBody(returnDecisionSchema), async (req, res) => {
  const u = currentUser(req);
  const r = await ReturnRequest.findById(req.params["id"]);
  if (!r) throw notFound("Return");
  const isOwner = !!u.vendorId && r.vendorId === u.vendorId && hasPermission(u.roles, "orders:fulfil");
  const isFinance = hasPermission(u.roles, "refunds:approve");
  const decision = req.body.decision as "approve" | "reject" | "refund";
  if (decision === "refund" ? !isFinance : !(isOwner || isFinance)) throw forbidden("You can't make this decision");
  const to: ReturnStatus = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : "refunded";
  assertTransition(RETURN_TRANSITIONS, r.status, to);
  r.status = to;
  await r.save();

  const order = await Order.findById(r.orderId);
  if (order && to === "rejected") {
    order.status = "delivered";
    order.history.push({ status: "delivered", at: new Date(), by: u.id });
    await order.save();
  }
  if (order && to === "refunded") {
    order.status = "returned";
    order.history.push({ status: "returned", at: new Date(), by: u.id });
    await order.save();
    await Promise.all(order.lines.map((l) => releaseStock(l.productId!, l.quantity!)));
    // Gateway refund call goes through the payment provider once one is connected.
    await Payment.updateMany({ orderId: order._id, status: "captured" }, { status: "refunded" });
  }
  await audit(u.id, `return.${to}`, "return", r._id);
  await notify(r.customerId, `Return ${to}`, `Your return for ${r.orderNumber} was ${to}.`);
  send(res, r.toJSON());
});
