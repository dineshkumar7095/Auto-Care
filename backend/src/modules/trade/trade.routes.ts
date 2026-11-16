import { Router } from "express";
import { canQuoteRfq } from "@automotive/utilities";
import { rfqQuoteSchema } from "@automotive/validation";
import { z } from "zod";
import { currentUser, requireAuth, requirePermission, requirePortal, vendorIdOf } from "../../common/auth";
import { conflict, notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { validateBody } from "../../common/validate";
import { audit } from "../audit/audit.model";
import { CreditAccount, PriceList, Rfq } from "./trade.model";

/** Distributor B2B trade: RFQs, buyer-group price lists and trade credit. */
export const tradeRouter = Router();
tradeRouter.use(requireAuth, requirePortal("distributor-portal"));

tradeRouter.get("/rfqs", async (req, res) => {
  send(res, (await Rfq.find({ vendorId: vendorIdOf(req) }).sort({ createdAt: -1 })).map((r) => r.toJSON()));
});

tradeRouter.post("/rfqs/:id/quote", requirePermission("orders:fulfil"), validateBody(rfqQuoteSchema), async (req, res) => {
  const rfq = await Rfq.findOne({ _id: req.params["id"], vendorId: vendorIdOf(req) });
  if (!rfq) throw notFound("RFQ");
  if (!canQuoteRfq({ status: rfq.status, expiresAt: rfq.expiresAt!.toISOString() })) throw conflict("rfq_closed", "This RFQ is closed or expired");
  rfq.status = "quoted";
  rfq.quotedTotalPaise = req.body.totalPaise;
  await rfq.save();
  await audit(currentUser(req).id, "rfq.quoted", "rfq", rfq._id);
  send(res, rfq.toJSON());
});

tradeRouter.get("/price-lists", async (req, res) => {
  send(res, (await PriceList.find({ vendorId: vendorIdOf(req) })).map((p) => p.toJSON()));
});

tradeRouter.patch("/price-lists/:id", requirePermission("catalogue:write"), validateBody(z.object({ active: z.boolean() })), async (req, res) => {
  const p = await PriceList.findOneAndUpdate({ _id: req.params["id"], vendorId: vendorIdOf(req) }, { active: req.body.active }, { new: true });
  if (!p) throw notFound("Price list");
  send(res, p.toJSON());
});

tradeRouter.get("/credit", async (req, res) => {
  send(res, (await CreditAccount.find({ vendorId: vendorIdOf(req) })).map((c) => c.toJSON()));
});
