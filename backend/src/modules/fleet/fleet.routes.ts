import { Router, type Request } from "express";
import { z } from "zod";
import { currentUser, requireAuth, requirePermission } from "../../common/auth";
import { conflict, forbidden, notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { validateBody } from "../../common/validate";
import { audit } from "../audit/audit.model";
import { FleetApproval, FleetSpend, FleetVehicle } from "./fleet.model";

export const fleetRouter = Router();
fleetRouter.use(requireAuth);

const fleetIdOf = (req: Request) => {
  const id = currentUser(req).fleetId;
  if (!id) throw forbidden("This account isn't linked to a fleet");
  return id;
};

fleetRouter.get("/vehicles", async (req, res) => {
  send(res, (await FleetVehicle.find({ fleetId: fleetIdOf(req) })).map((v) => v.toJSON()));
});

fleetRouter.get("/approvals", async (req, res) => {
  send(res, (await FleetApproval.find({ fleetId: fleetIdOf(req) }).sort({ createdAt: -1 })).map((a) => a.toJSON()));
});

fleetRouter.post("/approvals/:id/decision", requirePermission("fleet:approve"), validateBody(z.object({ decision: z.enum(["approve", "reject"]) })), async (req, res) => {
  const a = await FleetApproval.findOne({ _id: req.params["id"], fleetId: fleetIdOf(req) });
  if (!a) throw notFound("Request");
  if (a.status !== "pending") throw conflict("already_decided", "This request was already decided");
  a.status = req.body.decision === "approve" ? "approved" : "rejected";
  await a.save();
  await audit(currentUser(req).id, `fleet_approval.${a.status}`, "fleet_approval", a._id);
  send(res, a.toJSON());
});

fleetRouter.get("/spend", async (req, res) => {
  send(res, (await FleetSpend.find({ fleetId: fleetIdOf(req) }).sort({ order: 1 })).map(({ month, partsPaise, servicePaise, towingPaise }) => ({ month, partsPaise, servicePaise, towingPaise })));
});
