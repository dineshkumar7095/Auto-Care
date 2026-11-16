import { Router } from "express";
import { ORDER_STATUSES } from "@automotive/shared-types";
import { z } from "zod";
import { requireAuth, requirePortal } from "../../common/auth";
import { parsedQuery, validateQuery } from "../../common/validate";
import { send } from "../../common/respond";
import { Booking } from "../bookings/booking.model";
import { Order } from "../orders/order.model";
import { TowingTrip } from "../towing/towing.model";
import { Vendor } from "../vendors/vendor.model";

export const adminRouter = Router();
adminRouter.use(requireAuth, requirePortal("admin-portal"));

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

adminRouter.get("/overview", async (_req, res) => {
  const since = new Date(Date.now() - 7 * 86_400_000);
  const [orders, bookings, trips, activePartners, pendingPartners, gross, byDay] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: since } }),
    Booking.countDocuments({ createdAt: { $gte: since } }),
    TowingTrip.countDocuments({ createdAt: { $gte: since } }),
    Vendor.countDocuments({ status: "approved" }),
    Vendor.countDocuments({ status: "pending" }),
    Order.aggregate<{ total: number }>([{ $match: { createdAt: { $gte: since }, status: { $ne: "cancelled" } } }, { $group: { _id: null, total: { $sum: "$totals.totalPaise" } } }]),
    Order.aggregate<{ _id: number; total: number }>([{ $match: { createdAt: { $gte: since } } }, { $group: { _id: { $dayOfWeek: "$createdAt" }, total: { $sum: "$totals.totalPaise" } } }]),
  ]);
  const weekly = DAYS.map((day, i) => ({ day, parts: Math.round((byDay.find((d) => d._id === i + 1)?.total ?? 0) / 1e7), services: 0, towing: 0 }));
  const alerts: { level: "high" | "medium" | "low"; text: string }[] = [];
  const late = await Order.countDocuments({ status: "placed", createdAt: { $lt: new Date(Date.now() - 30 * 60_000) } });
  if (late) alerts.push({ level: "high", text: `${late} orders past the 30-minute seller acceptance deadline` });
  if (pendingPartners) alerts.push({ level: "medium", text: `${pendingPartners} partner applications waiting for review` });
  send(res, { grossValuePaise: gross[0]?.total ?? 0, counts: { orders, bookings, trips }, activePartners, pendingPartners, openDisputes: 0, alerts, weekly });
});

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const orderSearch = z.object({ q: z.string().trim().max(60).optional(), status: z.enum(ORDER_STATUSES).optional() });

/** Platform-wide order search by order number or customer name. */
adminRouter.get("/orders", validateQuery(orderSearch), async (_req, res) => {
  const { q, status } = parsedQuery(res, orderSearch);
  const rx = q ? new RegExp(escapeRegex(q), "i") : null;
  const filter = { ...(status ? { status } : {}), ...(rx ? { $or: [{ number: rx }, { customerName: rx }] } : {}) };
  send(res, (await Order.find(filter).sort({ createdAt: -1 }).limit(200)).map((o) => o.toJSON()));
});
adminRouter.get("/bookings", async (_req, res) => {
  send(res, (await Booking.find().sort({ createdAt: -1 }).limit(200)).map((b) => b.toJSON()));
});
adminRouter.get("/trips", async (_req, res) => {
  send(res, (await TowingTrip.find().sort({ createdAt: -1 }).limit(200)).map((t) => t.toJSON()));
});
