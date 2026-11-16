import { Router } from "express";
import { ORDER_STATUSES } from "@automotive/shared-types";
import { createOrderSchema, orderStatusUpdateSchema } from "@automotive/validation";
import { z } from "zod";
import { currentUser, requireAuth, vendorIdOf } from "../../common/auth";
import { send } from "../../common/respond";
import { parsedQuery, validateBody, validateQuery } from "../../common/validate";
import { buildGstInvoice } from "@automotive/utilities";
import { notFound } from "../../common/http-error";
import { Vendor } from "../vendors/vendor.model";
import { Order } from "./order.model";
import { changeStatus, createOrders } from "./orders.service";

export const ordersRouter = Router();
ordersRouter.use(requireAuth);
const vendorQuery = z.object({ status: z.enum(ORDER_STATUSES).optional() });

ordersRouter.post("/", validateBody(createOrderSchema), async (req, res) => {
  const orders = await createOrders(currentUser(req), req.body);
  send(res, orders.length === 1 ? orders[0]!.toJSON() : orders.map((o) => o.toJSON()), 201);
});

ordersRouter.get("/mine", async (req, res) => {
  send(res, (await Order.find({ customerId: currentUser(req).id }).sort({ createdAt: -1 })).map((o) => o.toJSON()));
});

ordersRouter.get("/vendor", validateQuery(vendorQuery), async (req, res) => {
  const { status } = parsedQuery(res, vendorQuery);
  const filter = { vendorId: vendorIdOf(req), ...(status ? { status } : {}) };
  send(res, (await Order.find(filter).sort({ createdAt: -1 })).map((o) => o.toJSON()));
});

ordersRouter.patch("/:id/status", validateBody(orderStatusUpdateSchema), async (req, res) => {
  send(res, (await changeStatus(currentUser(req), String(req.params["id"]), req.body.status)).toJSON());
});

/** GST tax invoice for an order — visible to the buyer and the selling vendor only. */
ordersRouter.get("/:id/invoice", async (req, res) => {
  const u = currentUser(req);
  const order = await Order.findOne({ _id: req.params["id"], $or: [{ customerId: u.id }, ...(u.vendorId ? [{ vendorId: u.vendorId }] : [])] });
  if (!order) throw notFound("Order");
  const vendor = await Vendor.findById(order.vendorId);
  const json = order.toJSON() as unknown as Parameters<typeof buildGstInvoice>[0] & { createdAt: Date };
  send(res, buildGstInvoice(json, {
    invoiceNumber: `INV-${order.number.replace(/^\D+-/, "")}`,
    sellerName: vendor?.name ?? "Seller",
    sellerState: vendor?.state ?? "Telangana",
    buyerState: order.address?.state ?? "Telangana",
    issuedAt: new Date(json.createdAt).toISOString(),
  }));
});
