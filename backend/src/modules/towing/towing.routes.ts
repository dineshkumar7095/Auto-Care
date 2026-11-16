import { Router } from "express";
import { TOWING_ISSUES, TRIP_TRANSITIONS } from "@automotive/shared-types";
import { assertTransition } from "@automotive/utilities";
import { towingRequestSchema, truckStatusSchema } from "@automotive/validation";
import { z } from "zod";
import { currentUser, requireAuth, requirePermission, vendorIdOf } from "../../common/auth";
import { badRequest, notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { parsedQuery, validateBody, validateQuery } from "../../common/validate";
import { notifyVendor } from "../notifications/notify";
import { TowTruck, TowingProvider, TowingTrip } from "./towing.model";

export const towingRouter = Router();
const providerQuery = z.object({ issue: z.enum(TOWING_ISSUES).optional() });

towingRouter.get("/providers", validateQuery(providerQuery), async (_req, res) => {
  const { issue } = parsedQuery(res, providerQuery);
  const filter: Record<string, unknown> = { available: true };
  if (issue === "ev_support") filter["evSafe"] = true; // EVs need flatbeds rated for them
  send(res, (await TowingProvider.find(filter).sort({ etaMin: 1 })).map((p) => ({ ...p.toJSON(), id: p.vendorId })));
});

towingRouter.post("/requests", requireAuth, validateBody(towingRequestSchema), async (req, res) => {
  const user = currentUser(req);
  const provider = req.body.providerId ? await TowingProvider.findOne({ vendorId: req.body.providerId }) : null;
  if (req.body.issue === "ev_support" && provider && !provider.evSafe) throw badRequest("This provider can't safely tow EVs");
  const trip = await TowingTrip.create({
    ...req.body,
    number: `TW-${Date.now().toString(36).toUpperCase()}`,
    customerId: user.id,
    customerName: user.name,
    providerId: provider?.vendorId ?? null,
    quotedPaise: provider?.pricePaise ?? 189900,
  });
  if (provider) await notifyVendor(provider.vendorId, "New towing request", `${trip.number}: ${req.body.issue} at ${req.body.pickup}`);
  send(res, trip.toJSON(), 201);
});

/** Operators see every trip for their company; drivers see open requests and trips assigned to them. */
towingRouter.get("/trips", requireAuth, async (req, res) => {
  const u = currentUser(req);
  const filter: Record<string, unknown> = { providerId: vendorIdOf(req) };
  if (!u.roles.includes("towing_operator")) filter["$or"] = [{ status: "requested" }, { driverName: u.name }];
  send(res, (await TowingTrip.find(filter).sort({ createdAt: -1 })).map((t) => t.toJSON()));
});

towingRouter.get("/trucks", requireAuth, async (req, res) => {
  send(res, (await TowTruck.find({ vendorId: vendorIdOf(req) })).map((t) => t.toJSON()));
});

towingRouter.patch("/trucks/:id", requireAuth, requirePermission("towing:dispatch"), validateBody(truckStatusSchema), async (req, res) => {
  const t = await TowTruck.findOneAndUpdate({ _id: req.params["id"], vendorId: vendorIdOf(req) }, { status: req.body.status }, { new: true });
  if (!t) throw notFound("Truck");
  send(res, t.toJSON());
});

towingRouter.patch("/trips/:id/status", requireAuth, requirePermission("trips:advance"), validateBody(z.object({ status: z.enum(["accepted", "en_route", "arrived", "picked_up", "completed", "cancelled"]) })), async (req, res) => {
  const trip = await TowingTrip.findOne({ _id: req.params["id"], providerId: vendorIdOf(req) });
  if (!trip) throw notFound("Trip");
  assertTransition(TRIP_TRANSITIONS, trip.status, req.body.status);
  trip.status = req.body.status;
  if (req.body.status === "accepted") trip.driverName = currentUser(req).name;
  await trip.save();
  send(res, trip.toJSON());
});
