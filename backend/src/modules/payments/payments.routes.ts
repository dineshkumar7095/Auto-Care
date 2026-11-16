import { Router } from "express";
import { z } from "zod";
import { currentUser, requireAuth } from "../../common/auth";
import { badRequest, notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { validateBody } from "../../common/validate";
import { payments } from "../../providers/payments";
import { audit } from "../audit/audit.model";
import { Order } from "../orders/order.model";
import { Payment } from "./payment.model";

export const paymentsRouter = Router();

/** Creates a gateway order for the customer's order. Amount always comes from the database. */
paymentsRouter.post("/intents", requireAuth, validateBody(z.object({ orderId: z.string() })), async (req, res) => {
  const order = await Order.findOne({ _id: req.body.orderId, customerId: currentUser(req).id });
  if (!order) throw notFound("Order");
  const provider = payments();
  const intent = await provider.createIntent({ amountPaise: order.totals!.totalPaise!, receipt: order.number });
  const payment = await Payment.create({ orderId: order._id, customerId: order.customerId, amountPaise: order.totals!.totalPaise, provider: provider.name, providerRef: intent.providerRef });
  send(res, { paymentId: payment._id, providerRef: payment.providerRef, amountPaise: payment.amountPaise, checkout: intent.checkout }, 201);
});

/** Gateway webhook. Nothing is trusted until the provider adapter verifies the signature. */
paymentsRouter.post("/webhook", async (req, res) => {
  const raw = typeof req.body === "string" ? req.body : "";
  const event = payments().verifyWebhook(raw, req.headers as Record<string, string | undefined>);
  if (!event) throw badRequest("Invalid webhook signature");
  const payment = await Payment.findOne({ providerRef: event.providerRef });
  if (!payment) throw notFound("Payment");
  if (payment.status === "created") {
    payment.status = event.status === "paid" ? "captured" : "failed";
    await payment.save();
    await audit("gateway", `payment.${payment.status}`, "payment", payment._id);
  }
  send(res, { received: true });
});
