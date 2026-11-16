import { Router, type Request } from "express";
import { JOB_TRANSITIONS } from "@automotive/shared-types";
import { assertTransition } from "@automotive/utilities";
import { createBookingSchema, estimateSchema, jobStageUpdateSchema, queryBoolean } from "@automotive/validation";
import { z } from "zod";
import { currentUser, requireAuth, requirePermission, vendorIdOf } from "../../common/auth";
import { badRequest, notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { parsedQuery, validateBody, validateQuery } from "../../common/validate";
import { audit } from "../audit/audit.model";
import { Booking, JobCard } from "./booking.model";
import { Workshop } from "./workshop.model";

export const bookingsRouter = Router();
const workshopQuery = z.object({ service: z.string().optional(), pickup: queryBoolean.optional(), city: z.string().default("Hyderabad") });

bookingsRouter.get("/workshops", validateQuery(workshopQuery), async (_req, res) => {
  const q = parsedQuery(res, workshopQuery);
  const filter: Record<string, unknown> = { city: q.city };
  if (q.pickup) filter["pickup"] = true;
  if (q.service) filter["specialties"] = { $regex: q.service.split(" ")[0], $options: "i" };
  if (q.service === "EV diagnostics") filter["evQualified"] = true;
  send(res, (await Workshop.find(filter).sort({ distanceKm: 1 })).map((w) => w.toJSON()));
});

bookingsRouter.post("/", requireAuth, validateBody(createBookingSchema), async (req, res) => {
  const user = currentUser(req);
  const w = await Workshop.findById(req.body.workshopId);
  if (!w) throw notFound("Workshop");
  if (/\bEV\b/i.test(req.body.service) && !w.evQualified) throw badRequest("This workshop isn't qualified for EV high-voltage work");
  const b = await Booking.create({ ...req.body, customerId: user.id, customerName: user.name });
  send(res, b.toJSON(), 201);
});

/** Workshop staff only see their own workshop's data. */
const myWorkshopIds = async (req: Request) => (await Workshop.find({ vendorId: vendorIdOf(req) }, { _id: 1 })).map((w) => w._id);

bookingsRouter.get("/workshop/today", requireAuth, async (req, res) => {
  send(res, (await Booking.find({ workshopId: { $in: await myWorkshopIds(req) } }).sort({ slot: 1 })).map((b) => b.toJSON()));
});

bookingsRouter.get("/jobs", requireAuth, async (req, res) => {
  send(res, (await JobCard.find({ workshopId: { $in: await myWorkshopIds(req) } }).sort({ createdAt: -1 })).map((j) => j.toJSON()));
});

bookingsRouter.patch("/jobs/:id/stage", requireAuth, requirePermission("jobs:advance"), validateBody(jobStageUpdateSchema), async (req, res) => {
  const job = await JobCard.findOne({ _id: req.params["id"], workshopId: { $in: await myWorkshopIds(req) } });
  if (!job) throw notFound("Job card");
  assertTransition(JOB_TRANSITIONS, job.stage, req.body.stage);
  // Repair work never starts on an unapproved estimate.
  if (job.stage === "awaiting_approval" && req.body.stage === "in_repair" && job.estimate.some((l) => !l.approved)) {
    throw badRequest("The customer hasn't approved the estimate yet");
  }
  job.stage = req.body.stage;
  await job.save();
  await audit(currentUser(req).id, `job.${job.stage}`, "job_card", job._id);
  send(res, job.toJSON());
});

bookingsRouter.put("/jobs/:id/estimate", requireAuth, requirePermission("jobs:estimate"), validateBody(estimateSchema), async (req, res) => {
  const job = await JobCard.findOne({ _id: req.params["id"], workshopId: { $in: await myWorkshopIds(req) } });
  if (!job) throw notFound("Job card");
  job.set("estimate", req.body.lines.map((l: object) => ({ ...l, approved: false })));
  await job.save();
  send(res, job.toJSON());
});
