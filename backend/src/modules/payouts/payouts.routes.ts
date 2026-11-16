import { Router } from "express";
import { currentUser, requireAuth, requirePermission, requirePortal, vendorIdOf } from "../../common/auth";
import { conflict, notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { audit } from "../audit/audit.model";
import { notifyVendor } from "../notifications/notify";
import { Payout } from "./payout.model";

export const payoutsRouter = Router();
payoutsRouter.use(requireAuth);

payoutsRouter.get("/mine", requirePermission("payouts:read"), async (req, res) => {
  send(res, (await Payout.find({ vendorId: vendorIdOf(req) }).sort({ payoutDate: -1 })).map((p) => p.toJSON()));
});

payoutsRouter.get("/", requirePortal("admin-portal"), async (_req, res) => {
  send(res, (await Payout.find().sort({ payoutDate: -1 }).limit(200)).map((p) => p.toJSON()));
});

/** Finance releases a scheduled or held payout. The bank transfer itself goes through your payout provider. */
payoutsRouter.post("/:id/release", requirePermission("refunds:approve"), async (req, res) => {
  const p = await Payout.findById(req.params["id"]);
  if (!p) throw notFound("Payout");
  if (p.status === "paid") throw conflict("already_paid", "This payout was already paid");
  p.status = "paid";
  p.payoutDate = new Date();
  await p.save();
  await audit(currentUser(req).id, "payout.released", "payout", p._id);
  await notifyVendor(p.vendorId, "Payout sent", `Your payout for ${p.periodLabel} is on its way.`);
  send(res, p.toJSON());
});
