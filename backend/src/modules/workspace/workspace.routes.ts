import { Router, type Request } from "express";
import { PLATFORM_OWNER_ID, TICKET_TRANSITIONS, canAccessPortal, type TicketStatus } from "@automotive/shared-types";
import { settingsSchema, teamMemberActiveSchema, teamMemberSchema, ticketStatusSchema } from "@automotive/validation";
import { currentUser, requireAuth, requirePortal } from "../../common/auth";
import { conflict, forbidden, notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { validateBody } from "../../common/validate";
import { audit } from "../audit/audit.model";
import { BusinessSettings, SupportTicket, TeamMember } from "./workspace.model";

/** The business the signed-in user acts for: their vendor, their fleet, or the platform for admins. */
export const ownerIdOf = (req: Request) => {
  const u = currentUser(req);
  const owner = u.vendorId ?? u.fleetId ?? (canAccessPortal(u.roles, "admin-portal") ? PLATFORM_OWNER_ID : null);
  if (!owner) throw forbidden("This account isn't linked to a business");
  return owner;
};

export const teamRouter = Router();
teamRouter.use(requireAuth);
teamRouter.get("/", async (req, res) => {
  send(res, (await TeamMember.find({ ownerId: ownerIdOf(req) }).sort({ joinedAt: 1 })).map((m) => m.toJSON()));
});
teamRouter.post("/", validateBody(teamMemberSchema), async (req, res) => {
  const ownerId = ownerIdOf(req);
  if (await TeamMember.exists({ ownerId, phone: req.body.phone })) throw conflict("already_member", "This phone number is already on your team");
  const m = await TeamMember.create({ ...req.body, ownerId });
  await audit(currentUser(req).id, "team.added", "team_member", m._id);
  send(res, m.toJSON(), 201);
});
teamRouter.patch("/:id", validateBody(teamMemberActiveSchema), async (req, res) => {
  const m = await TeamMember.findOne({ _id: req.params["id"], ownerId: ownerIdOf(req) });
  if (!m) throw notFound("Team member");
  m.active = req.body.active;
  await m.save();
  await audit(currentUser(req).id, m.active ? "team.activated" : "team.deactivated", "team_member", m._id);
  send(res, m.toJSON());
});

const settingsJson = (ownerId: string, doc: { values?: unknown; updatedAt?: Date } | null) => ({
  ownerId,
  values: (doc?.values as Record<string, unknown>) ?? {},
  updatedAt: (doc?.updatedAt ?? new Date(0)).toISOString(),
});

export const settingsRouter = Router();
settingsRouter.use(requireAuth);
settingsRouter.get("/", async (req, res) => {
  const ownerId = ownerIdOf(req);
  send(res, settingsJson(ownerId, await BusinessSettings.findOne({ ownerId }).lean()));
});
settingsRouter.put("/", validateBody(settingsSchema), async (req, res) => {
  const ownerId = ownerIdOf(req);
  const doc = await BusinessSettings.findOneAndUpdate({ ownerId }, { $set: { values: req.body.values } }, { upsert: true, new: true, lean: true });
  await audit(currentUser(req).id, "settings.saved", "settings", ownerId);
  send(res, settingsJson(ownerId, doc));
});

export const supportRouter = Router();
supportRouter.use(requireAuth, requirePortal("admin-portal"));
supportRouter.get("/tickets", async (_req, res) => {
  send(res, (await SupportTicket.find().sort({ createdAt: -1 }).limit(200)).map((t) => t.toJSON()));
});
supportRouter.patch("/tickets/:id", validateBody(ticketStatusSchema), async (req, res) => {
  const t = await SupportTicket.findById(req.params["id"]);
  if (!t) throw notFound("Ticket");
  const next = req.body.status as TicketStatus;
  if (!TICKET_TRANSITIONS[t.status as TicketStatus].includes(next)) throw conflict("invalid_transition", "That status change isn't allowed");
  t.status = next;
  await t.save();
  await audit(currentUser(req).id, `ticket.${next}`, "ticket", t._id);
  send(res, t.toJSON());
});
