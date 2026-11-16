/**
 * In-memory implementation of the REST contract, used when VITE_USE_MOCKS=true so any portal can run
 * without the backend. Business rules come from the same shared packages the backend uses.
 */
import {
  JOB_TRANSITIONS,
  RETURN_TRANSITIONS,
  ORDER_TRANSITIONS,
  TRIP_TRANSITIONS,
  TICKET_TRANSITIONS,
  PLATFORM_OWNER_ID,
  canAccessPortal,
  hasPermission,
  type ApiResponse,
  type AuthUser,
  type JobStage,
  type OrderStatus,
  type PortalId,
  type TripStatus,
} from "@automotive/shared-types";
import { buildGstInvoice, canQuoteRfq, canRequestReturn, canTransition } from "@automotive/utilities";
import { otpRequestSchema, otpVerifySchema, returnDecisionSchema, returnRequestSchema, reviewSchema, rfqQuoteSchema, truckStatusSchema, vendorDecisionSchema, teamMemberSchema, teamMemberActiveSchema, settingsSchema, ticketStatusSchema, branchStockSchema } from "@automotive/validation";
import * as fx from "./fixtures";

type Db = {
  products: typeof fx.products;
  orders: typeof fx.orders;
  jobCards: typeof fx.jobCards;
  bookings: typeof fx.bookings;
  vendors: typeof fx.vendors;
  trips: typeof fx.towingTrips;
  fleetApprovals: typeof fx.fleetApprovals;
  rfqs: typeof fx.rfqs;
  priceLists: typeof fx.priceLists;
  trucks: typeof fx.towTrucks;
  reviews: typeof fx.reviews;
  returns: typeof fx.returnRequests;
  payouts: typeof fx.payouts;
  notifications: typeof fx.notifications;
  team: typeof fx.teamMembers;
  settings: typeof fx.businessSettings;
  tickets: typeof fx.supportTickets;
  branchStock: typeof fx.branchStock;
  sessions: Map<string, AuthUser>;
};

// JSON copy (not structuredClone) so the mock also runs on React Native/Hermes.
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const fresh = (): Db => ({
  products: clone(fx.products),
  orders: clone(fx.orders),
  jobCards: clone(fx.jobCards),
  bookings: clone(fx.bookings),
  vendors: clone(fx.vendors),
  trips: clone(fx.towingTrips),
  fleetApprovals: clone(fx.fleetApprovals),
  rfqs: clone(fx.rfqs),
  priceLists: clone(fx.priceLists),
  trucks: clone(fx.towTrucks),
  reviews: clone(fx.reviews),
  returns: clone(fx.returnRequests),
  payouts: clone(fx.payouts),
  notifications: clone(fx.notifications),
  team: clone(fx.teamMembers),
  settings: clone(fx.businessSettings),
  tickets: clone(fx.supportTickets),
  branchStock: clone(fx.branchStock),
  sessions: new Map(),
});
let db = fresh();
export const resetMockDb = () => {
  db = fresh();
};

type Result<T> = { status: number; payload: ApiResponse<T> };
const ok = <T>(data: T, status = 200): Result<T> => ({ status, payload: { ok: true, data } });
const fail = (status: number, code: string, message: string, details?: unknown): Result<never> => ({ status, payload: { ok: false, error: { code, message, details } } });

type Ctx = { body: any; query: URLSearchParams; params: Record<string, string>; user: AuthUser | null };
type Handler = (ctx: Ctx) => Result<unknown>;
const routes: { method: string; pattern: RegExp; keys: string[]; handler: Handler }[] = [];
const route = (method: string, path: string, handler: Handler) => {
  const keys: string[] = [];
  const pattern = new RegExp("^" + path.replace(/:(\w+)/g, (_, k) => (keys.push(k), "([^/]+)")) + "$");
  routes.push({ method, pattern, keys, handler });
};
const requireUser = (ctx: Ctx) => (ctx.user ? null : fail(401, "unauthenticated", "Please sign in"));

// ---- auth ----
route("POST", "/auth/otp/request", ({ body }) => {
  const parsed = otpRequestSchema.safeParse(body);
  if (!parsed.success) return fail(422, "validation_error", parsed.error.issues[0]?.message ?? "Invalid input");
  return ok({ sent: true as const, devCode: fx.DEMO_OTP });
});
route("POST", "/auth/otp/verify", ({ body }) => {
  const parsed = otpVerifySchema.safeParse(body);
  if (!parsed.success) return fail(422, "validation_error", parsed.error.issues[0]?.message ?? "Invalid input");
  if (parsed.data.code !== fx.DEMO_OTP) return fail(401, "invalid_otp", "That code is incorrect or expired");
  const portal = parsed.data.portal as PortalId;
  const account = fx.demoUsers.find((u) => u.phone === parsed.data.phone) ?? fx.demoUsers.find((u) => u.phone === fx.DEMO_ACCOUNT_BY_PORTAL[portal])!;
  if (!canAccessPortal(account.roles, portal)) return fail(403, "portal_forbidden", "This account can't use this portal");
  const user: AuthUser = { id: account.id, name: account.name, phone: account.phone, roles: account.roles, vendorId: account.vendorId, fleetId: account.fleetId };
  const accessToken = `mock.${account.id}.${Date.now()}`;
  db.sessions.set(accessToken, user);
  return ok({ accessToken, user });
});
route("GET", "/auth/me", (ctx) => requireUser(ctx) ?? ok(ctx.user));

// ---- catalogue ----
const fitRank = { verified: 0, "seller-confirmed": 1, possible: 2, "not-verified": 3 } as const;
route("GET", "/catalogue/products", ({ query }) => {
  const q = query.get("q")?.toLowerCase();
  const category = query.get("category");
  const verifiedOnly = query.get("verifiedOnly") === "true";
  const sort = query.get("sort") ?? "fit";
  let items = db.products.filter(
    (p) =>
      p.listingStatus === "live" &&
      (!category || p.category === category) &&
      (!q || [p.title, p.brand, p.partNumber, p.category].some((f) => f.toLowerCase().includes(q))) &&
      (!verifiedOnly || p.fitment === "verified"),
  );
  items = [...items].sort((a, b) =>
    sort === "price-asc" ? a.pricePaise - b.pricePaise : sort === "price-desc" ? b.pricePaise - a.pricePaise : sort === "rating" ? b.rating - a.rating : fitRank[a.fitment] - fitRank[b.fitment],
  );
  return ok({ items, total: items.length, page: 1, pageSize: items.length });
});
route("GET", "/catalogue/products/:id", ({ params }) => {
  const product = db.products.find((p) => p.id === params.id);
  return product ? ok({ product, offers: fx.offers[product.id] ?? [] }) : fail(404, "not_found", "Product not found");
});
route("GET", "/catalogue/vendor/products", (ctx) => requireUser(ctx) ?? ok(db.products.filter((p) => p.vendorId === ctx.user!.vendorId)));
route("POST", "/catalogue/vendor/products", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  if (!hasPermission(ctx.user!.roles, "catalogue:write")) return fail(403, "forbidden", "You can't add products");
  const p = { ...fx.products[0]!, ...ctx.body, id: `p-${Date.now()}`, vendorId: ctx.user!.vendorId!, listingStatus: "pending_review" as const, reviews: 0, rating: 0 };
  db.products.push(p);
  return ok(p, 201);
});

// ---- orders ----
route("GET", "/orders/vendor", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  const status = ctx.query.get("status");
  return ok(db.orders.filter((o) => o.vendorId === ctx.user!.vendorId && (!status || o.status === status)));
});
route("GET", "/orders/mine", (ctx) => requireUser(ctx) ?? ok(db.orders.filter((o) => o.customerId === ctx.user!.id)));
route("PATCH", "/orders/:id/status", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  if (!hasPermission(ctx.user!.roles, "orders:fulfil")) return fail(403, "forbidden", "You can't update orders");
  const o = db.orders.find((x) => x.id === ctx.params.id && x.vendorId === ctx.user!.vendorId);
  if (!o) return fail(404, "not_found", "Order not found");
  const to = ctx.body?.status as OrderStatus;
  if (!canTransition(ORDER_TRANSITIONS, o.status, to)) return fail(409, "invalid_transition", `Cannot move order from ${o.status} to ${to}`);
  o.status = to;
  if (to === "delivered") o.deliveredAt = new Date().toISOString();
  return ok(o);
});

// ---- bookings / workshop ----
route("GET", "/bookings/workshops", ({ query }) => {
  const service = query.get("service");
  const pickup = query.get("pickup") === "true";
  return ok(
    fx.workshops.filter(
      (w) =>
        (!service || w.specialties.some((s) => s.toLowerCase().includes(service.split(" ")[0]!.toLowerCase()))) &&
        (!pickup || w.pickup) &&
        // EV high-voltage work is only offered by qualified workshops.
        (service !== "EV diagnostics" || w.evQualified),
    ),
  );
});
route("POST", "/bookings", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  const b = { id: `b-${Date.now()}`, source: "marketplace" as const, customerName: ctx.user!.name, ...ctx.body };
  db.bookings.push(b);
  return ok(b, 201);
});
route("GET", "/bookings/workshop/today", (ctx) => requireUser(ctx) ?? ok(db.bookings));
route("GET", "/bookings/jobs", (ctx) => requireUser(ctx) ?? ok(db.jobCards));
route("PATCH", "/bookings/jobs/:id/stage", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  if (!hasPermission(ctx.user!.roles, "jobs:advance")) return fail(403, "forbidden", "You can't update job cards");
  const j = db.jobCards.find((x) => x.id === ctx.params.id);
  if (!j) return fail(404, "not_found", "Job card not found");
  const to = ctx.body?.stage as JobStage;
  if (!canTransition(JOB_TRANSITIONS, j.stage, to)) return fail(409, "invalid_transition", `Cannot move job from ${j.stage} to ${to}`);
  j.stage = to;
  return ok(j);
});

// ---- towing ----
route("GET", "/towing/providers", ({ query }) => ok(fx.towingProviders.filter((p) => query.get("issue") !== "ev_support" || p.evSafe)));
route("POST", "/towing/requests", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  const t = { id: `t-${Date.now()}`, number: `TW-${8816 + db.trips.length}`, customerName: ctx.user!.name, driverName: null, status: "requested" as const, etaMin: null, quotedPaise: 189900, providerId: null, ...ctx.body };
  db.trips.unshift(t);
  return ok(t, 201);
});
/** Operators see every trip for their company; drivers see open requests and trips assigned to them. */
route("GET", "/towing/trips", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  const mine = db.trips.filter((t) => t.providerId === ctx.user!.vendorId);
  const isOperator = ctx.user!.roles.includes("towing_operator");
  return ok(isOperator ? mine : mine.filter((t) => t.status === "requested" || t.driverName === ctx.user!.name));
});
route("PATCH", "/towing/trips/:id/status", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  if (!hasPermission(ctx.user!.roles, "trips:advance")) return fail(403, "forbidden", "You can't update trips");
  const t = db.trips.find((x) => x.id === ctx.params.id && x.providerId === ctx.user!.vendorId);
  if (!t) return fail(404, "not_found", "Trip not found");
  const to = ctx.body?.status as TripStatus;
  if (!canTransition(TRIP_TRANSITIONS, t.status, to)) return fail(409, "invalid_transition", `Cannot move trip from ${t.status} to ${to}`);
  t.status = to;
  if (to === "accepted") t.driverName = ctx.user!.name;
  return ok(t);
});

// ---- vendors (admin) ----
route("GET", "/vendors", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  const status = ctx.query.get("status");
  return ok(db.vendors.filter((v) => !status || v.status === status));
});
route("POST", "/vendors/:id/decision", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  if (!hasPermission(ctx.user!.roles, "partners:approve")) return fail(403, "forbidden", "You can't approve partners");
  const parsed = vendorDecisionSchema.safeParse(ctx.body);
  if (!parsed.success) return fail(422, "validation_error", parsed.error.issues[0]?.message ?? "Invalid input");
  const v = db.vendors.find((x) => x.id === ctx.params.id);
  if (!v) return fail(404, "not_found", "Partner not found");
  if (parsed.data.decision === "approve" && v.documents.some((d) => !d.verified)) return fail(409, "documents_missing", "All documents must be verified first");
  v.status = parsed.data.decision === "approve" ? "approved" : "rejected";
  return ok(v);
});

// ---- fleet ----
route("GET", "/fleet/vehicles", (ctx) => requireUser(ctx) ?? ok(fx.fleetVehicles.filter((v) => v.fleetId === ctx.user!.fleetId)));
route("GET", "/fleet/approvals", (ctx) => requireUser(ctx) ?? ok(db.fleetApprovals.filter((a) => a.fleetId === ctx.user!.fleetId)));
route("POST", "/fleet/approvals/:id/decision", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  if (!hasPermission(ctx.user!.roles, "fleet:approve")) return fail(403, "forbidden", "You can't approve spend");
  const a = db.fleetApprovals.find((x) => x.id === ctx.params.id);
  if (!a) return fail(404, "not_found", "Request not found");
  a.status = ctx.body?.decision === "approve" ? "approved" : "rejected";
  return ok(a);
});


// ---- distributor trade ----
const isVendor = (ctx: Ctx) => (ctx.user?.vendorId ? null : fail(403, "forbidden", "This account isn't linked to a business"));
route("GET", "/trade/rfqs", (ctx) => requireUser(ctx) ?? isVendor(ctx) ?? ok(db.rfqs.filter((r) => r.vendorId === ctx.user!.vendorId)));
route("POST", "/trade/rfqs/:id/quote", (ctx) => {
  const denied = requireUser(ctx) ?? isVendor(ctx);
  if (denied) return denied;
  if (!hasPermission(ctx.user!.roles, "orders:fulfil")) return fail(403, "forbidden", "You can't send quotes");
  const parsed = rfqQuoteSchema.safeParse(ctx.body);
  if (!parsed.success) return fail(422, "validation_error", parsed.error.issues[0]?.message ?? "Invalid input");
  const r = db.rfqs.find((x) => x.id === ctx.params.id && x.vendorId === ctx.user!.vendorId);
  if (!r) return fail(404, "not_found", "RFQ not found");
  if (!canQuoteRfq(r)) return fail(409, "rfq_closed", "This RFQ is closed or expired");
  r.status = "quoted";
  r.quotedTotalPaise = parsed.data.totalPaise;
  return ok(r);
});
route("GET", "/trade/price-lists", (ctx) => requireUser(ctx) ?? isVendor(ctx) ?? ok(db.priceLists.filter((p) => p.vendorId === ctx.user!.vendorId)));
route("PATCH", "/trade/price-lists/:id", (ctx) => {
  const denied = requireUser(ctx) ?? isVendor(ctx);
  if (denied) return denied;
  if (!hasPermission(ctx.user!.roles, "catalogue:write")) return fail(403, "forbidden", "You can't change price lists");
  const p = db.priceLists.find((x) => x.id === ctx.params.id && x.vendorId === ctx.user!.vendorId);
  if (!p) return fail(404, "not_found", "Price list not found");
  p.active = !!ctx.body?.active;
  return ok(p);
});
route("GET", "/trade/credit", (ctx) => requireUser(ctx) ?? isVendor(ctx) ?? ok(fx.creditAccounts.filter((c) => c.vendorId === ctx.user!.vendorId)));

// ---- towing trucks ----
route("GET", "/towing/trucks", (ctx) => requireUser(ctx) ?? isVendor(ctx) ?? ok(db.trucks.filter((t) => t.vendorId === ctx.user!.vendorId)));
route("PATCH", "/towing/trucks/:id", (ctx) => {
  const denied = requireUser(ctx) ?? isVendor(ctx);
  if (denied) return denied;
  if (!hasPermission(ctx.user!.roles, "towing:dispatch")) return fail(403, "forbidden", "Only operators can change trucks");
  const parsed = truckStatusSchema.safeParse(ctx.body);
  if (!parsed.success) return fail(422, "validation_error", "Invalid status");
  const t = db.trucks.find((x) => x.id === ctx.params.id && x.vendorId === ctx.user!.vendorId);
  if (!t) return fail(404, "not_found", "Truck not found");
  t.status = parsed.data.status;
  return ok(t);
});

// ---- fleet spend ----
route("GET", "/fleet/spend", (ctx) => requireUser(ctx) ?? (ctx.user!.fleetId ? ok(fx.fleetSpend) : fail(403, "forbidden", "This account isn't linked to a fleet")));

// ---- reviews ----
route("GET", "/reviews", ({ query }) => ok(db.reviews.filter((r) => r.productId === query.get("productId"))));
route("POST", "/reviews", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  const parsed = reviewSchema.safeParse(ctx.body);
  if (!parsed.success) return fail(422, "validation_error", parsed.error.issues[0]?.message ?? "Invalid input");
  if (db.reviews.some((r) => r.productId === parsed.data.productId && r.authorId === ctx.user!.id)) return fail(409, "already_reviewed", "You've already reviewed this part");
  const verifiedPurchase = db.orders.some((o) => o.customerId === ctx.user!.id && o.status === "delivered" && o.lines.some((l) => l.productId === parsed.data.productId));
  const r = { id: `rv-${Date.now()}`, authorId: ctx.user!.id, authorName: ctx.user!.name, verifiedPurchase, createdAt: new Date().toISOString(), ...parsed.data, rating: parsed.data.rating as 1 | 2 | 3 | 4 | 5 };
  db.reviews.unshift(r);
  return ok(r, 201);
});

// ---- returns & refunds ----
route("POST", "/returns", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  const parsed = returnRequestSchema.safeParse(ctx.body);
  if (!parsed.success) return fail(422, "validation_error", parsed.error.issues[0]?.message ?? "Invalid input");
  const o = db.orders.find((x) => x.id === parsed.data.orderId && x.customerId === ctx.user!.id);
  if (!o) return fail(404, "not_found", "Order not found");
  if (!canRequestReturn(o)) return fail(409, "return_not_allowed", "This order can't be returned (not delivered or past the 7-day window)");
  o.status = "return_requested";
  const r = { id: `rt-${Date.now()}`, orderId: o.id, orderNumber: o.number, customerId: o.customerId, customerName: o.customerName, vendorId: o.vendorId, reason: parsed.data.reason, note: parsed.data.note ?? "", amountPaise: o.totals.totalPaise, status: "requested" as const, createdAt: new Date().toISOString() };
  db.returns.unshift(r);
  return ok(r, 201);
});
route("GET", "/returns/mine", (ctx) => requireUser(ctx) ?? ok(db.returns.filter((r) => r.customerId === ctx.user!.id)));
route("GET", "/returns/vendor", (ctx) => requireUser(ctx) ?? isVendor(ctx) ?? ok(db.returns.filter((r) => r.vendorId === ctx.user!.vendorId)));
route("GET", "/returns", (ctx) => requireUser(ctx) ?? (canAccessPortal(ctx.user!.roles, "admin-portal") ? ok(db.returns) : fail(403, "forbidden", "Admins only")));
route("POST", "/returns/:id/decision", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  const parsed = returnDecisionSchema.safeParse(ctx.body);
  if (!parsed.success) return fail(422, "validation_error", "Invalid decision");
  const r = db.returns.find((x) => x.id === ctx.params.id);
  if (!r) return fail(404, "not_found", "Return not found");
  // Sellers approve or reject their own returns; only finance admins release refunds.
  const isOwner = r.vendorId === ctx.user!.vendorId && hasPermission(ctx.user!.roles, "orders:fulfil");
  const isFinance = hasPermission(ctx.user!.roles, "refunds:approve");
  if (parsed.data.decision === "refund" ? !isFinance : !(isOwner || isFinance)) return fail(403, "forbidden", "You can't make this decision");
  const to = parsed.data.decision === "approve" ? "approved" : parsed.data.decision === "reject" ? "rejected" : "refunded";
  if (!RETURN_TRANSITIONS[r.status].includes(to)) return fail(409, "invalid_transition", `Cannot move return from ${r.status} to ${to}`);
  r.status = to;
  const o = db.orders.find((x) => x.id === r.orderId);
  if (o && to === "rejected") o.status = "delivered";
  if (o && to === "refunded") o.status = "returned";
  return ok(r);
});

// ---- payouts ----
route("GET", "/payouts/mine", (ctx) => {
  const denied = requireUser(ctx) ?? isVendor(ctx);
  if (denied) return denied;
  if (!hasPermission(ctx.user!.roles, "payouts:read")) return fail(403, "forbidden", "Only owners can see payouts");
  return ok(db.payouts.filter((p) => p.vendorId === ctx.user!.vendorId));
});
route("GET", "/payouts", (ctx) => requireUser(ctx) ?? (canAccessPortal(ctx.user!.roles, "admin-portal") ? ok(db.payouts) : fail(403, "forbidden", "Admins only")));
route("POST", "/payouts/:id/release", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  if (!hasPermission(ctx.user!.roles, "refunds:approve")) return fail(403, "forbidden", "Only finance can release payouts");
  const p = db.payouts.find((x) => x.id === ctx.params.id);
  if (!p) return fail(404, "not_found", "Payout not found");
  if (p.status === "paid") return fail(409, "already_paid", "This payout was already paid");
  p.status = "paid";
  p.payoutDate = new Date().toISOString();
  return ok(p);
});

// ---- notifications ----
route("GET", "/notifications", (ctx) => requireUser(ctx) ?? ok(db.notifications.filter((n) => n.userId === ctx.user!.id)));
route("POST", "/notifications/:id/read", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  const n = db.notifications.find((x) => x.id === ctx.params.id && x.userId === ctx.user!.id);
  if (!n) return fail(404, "not_found", "Notification not found");
  n.read = true;
  return ok(n);
});

// ---- GST invoices ----
route("GET", "/orders/:id/invoice", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  const o = db.orders.find((x) => x.id === ctx.params.id && (x.customerId === ctx.user!.id || x.vendorId === ctx.user!.vendorId));
  if (!o) return fail(404, "not_found", "Order not found");
  const seller = [...fx.vendors].find((v) => v.id === o.vendorId)?.name ?? fx.products.find((p) => p.vendorId === o.vendorId)?.sellerName ?? "Seller";
  return ok(buildGstInvoice(o, { invoiceNumber: `INV-${o.number.replace(/^\D+-/, "")}`, sellerName: seller, sellerState: fx.VENDOR_STATE[o.vendorId] ?? fx.DEFAULT_STATE, buyerState: fx.DEFAULT_STATE, issuedAt: o.createdAt }));
});

// ---- workspace: team, settings, support, admin search ----
const ownerOf = (u: AuthUser) => u.vendorId ?? u.fleetId ?? (canAccessPortal(u.roles, "admin-portal") ? PLATFORM_OWNER_ID : null);
const needOwner = (ctx: Ctx) => requireUser(ctx) ?? (ownerOf(ctx.user!) ? null : fail(403, "forbidden", "This account isn't linked to a business"));
const needAdmin = (ctx: Ctx) => requireUser(ctx) ?? (canAccessPortal(ctx.user!.roles, "admin-portal") ? null : fail(403, "forbidden", "Admins only"));
const invalid = (issues: { message: string }[]) => fail(422, "validation_error", issues[0]?.message ?? "Invalid input");

route("GET", "/team", (ctx) => needOwner(ctx) ?? ok(db.team.filter((m) => m.ownerId === ownerOf(ctx.user!))));
route("POST", "/team", (ctx) => {
  const denied = needOwner(ctx);
  if (denied) return denied;
  const parsed = teamMemberSchema.safeParse(ctx.body);
  if (!parsed.success) return invalid(parsed.error.issues);
  const ownerId = ownerOf(ctx.user!)!;
  if (db.team.some((m) => m.ownerId === ownerId && m.phone === parsed.data.phone)) return fail(409, "already_member", "This phone number is already on your team");
  const m = { id: `tm-${Date.now()}`, ownerId, ...parsed.data, active: true, joinedAt: new Date().toISOString() };
  db.team.push(m);
  return ok(m, 201);
});
route("PATCH", "/team/:id", (ctx) => {
  const denied = needOwner(ctx);
  if (denied) return denied;
  const parsed = teamMemberActiveSchema.safeParse(ctx.body);
  if (!parsed.success) return invalid(parsed.error.issues);
  const m = db.team.find((x) => x.id === ctx.params.id && x.ownerId === ownerOf(ctx.user!));
  if (!m) return fail(404, "not_found", "Team member not found");
  m.active = parsed.data.active;
  return ok(m);
});

route("GET", "/settings", (ctx) => {
  const denied = needOwner(ctx);
  if (denied) return denied;
  const ownerId = ownerOf(ctx.user!)!;
  return ok(db.settings.find((s) => s.ownerId === ownerId) ?? { ownerId, values: {}, updatedAt: new Date(0).toISOString() });
});
route("PUT", "/settings", (ctx) => {
  const denied = needOwner(ctx);
  if (denied) return denied;
  const parsed = settingsSchema.safeParse(ctx.body);
  if (!parsed.success) return invalid(parsed.error.issues);
  const ownerId = ownerOf(ctx.user!)!;
  const doc = { ownerId, values: parsed.data.values, updatedAt: new Date().toISOString() };
  db.settings = [...db.settings.filter((s) => s.ownerId !== ownerId), doc];
  return ok(doc);
});

route("GET", "/support/tickets", (ctx) => needAdmin(ctx) ?? ok([...db.tickets].sort((a, b) => b.createdAt.localeCompare(a.createdAt))));
route("PATCH", "/support/tickets/:id", (ctx) => {
  const denied = needAdmin(ctx);
  if (denied) return denied;
  const parsed = ticketStatusSchema.safeParse(ctx.body);
  if (!parsed.success) return invalid(parsed.error.issues);
  const t = db.tickets.find((x) => x.id === ctx.params.id);
  if (!t) return fail(404, "not_found", "Ticket not found");
  if (!TICKET_TRANSITIONS[t.status].includes(parsed.data.status)) return fail(409, "invalid_transition", "That status change isn't allowed");
  t.status = parsed.data.status;
  return ok(t);
});

route("GET", "/inventory/branches", (ctx) => requireUser(ctx) ?? isVendor(ctx) ?? ok(db.branchStock.filter((b) => b.vendorId === ctx.user!.vendorId)));
route("PATCH", "/inventory/branches/:id", (ctx) => {
  const denied = requireUser(ctx) ?? isVendor(ctx) ?? (hasPermission(ctx.user!.roles, "catalogue:write") ? null : fail(403, "forbidden", "You can't change stock"));
  if (denied) return denied;
  const parsed = branchStockSchema.safeParse(ctx.body);
  if (!parsed.success) return invalid(parsed.error.issues);
  const b = db.branchStock.find((x) => x.id === ctx.params.id && x.vendorId === ctx.user!.vendorId);
  if (!b) return fail(404, "not_found", "Stock line not found");
  b.onHand = parsed.data.onHand;
  return ok(b);
});

route("GET", "/admin/orders", (ctx) => {
  const denied = needAdmin(ctx);
  if (denied) return denied;
  const q = (ctx.query.get("q") ?? "").trim().toLowerCase();
  const status = ctx.query.get("status");
  return ok(db.orders.filter((o) => (!status || o.status === status) && (!q || o.number.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q))).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});
route("GET", "/admin/bookings", (ctx) => needAdmin(ctx) ?? ok(db.bookings));
route("GET", "/admin/trips", (ctx) => needAdmin(ctx) ?? ok(db.trips));

route("GET", "/reviews/vendor", (ctx) => {
  const denied = requireUser(ctx) ?? isVendor(ctx);
  if (denied) return denied;
  const v = ctx.user!.vendorId;
  const subjects = new Set([...db.products.filter((p) => p.vendorId === v).map((p) => p.id), ...fx.workshops.filter((w) => w.vendorId === v).map((w) => w.id)]);
  return ok(db.reviews.filter((r) => subjects.has(r.productId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

// ---- admin ----
route("GET", "/admin/overview", (ctx) => {
  const denied = requireUser(ctx);
  if (denied) return denied;
  if (!canAccessPortal(ctx.user!.roles, "admin-portal")) return fail(403, "forbidden", "Admins only");
  return ok({
    grossValuePaise: 5970000000,
    counts: { orders: 2410, bookings: 662, trips: 112 },
    activePartners: 486,
    pendingPartners: db.vendors.filter((v) => v.status === "pending").length,
    openDisputes: 14,
    alerts: fx.adminAlerts,
    weekly: fx.weeklyValue,
  });
});

/**
 * Demo data lives in memory and resets on every page load, but the browser keeps the token.
 * Mock tokens carry the demo user's id, so a refresh keeps you signed in instead of bouncing to the login page.
 */
function userFromMockToken(token: string): AuthUser | null {
  const id = /^mock\.([^.]+)\./.exec(token)?.[1];
  const account = id ? fx.demoUsers.find((u) => u.id === id) : undefined;
  if (!account) return null;
  const user: AuthUser = { id: account.id, name: account.name, phone: account.phone, roles: account.roles, vendorId: account.vendorId, fleetId: account.fleetId };
  db.sessions.set(token, user);
  return user;
}

export async function handleMockRequest<T>(method: string, fullPath: string, body: unknown, token: string | null): Promise<Result<T>> {
  await new Promise((r) => setTimeout(r, 120)); // feel like a network call
  const url = new URL(fullPath, "http://mock.local");
  const user = token ? db.sessions.get(token) ?? userFromMockToken(token) : null;
  for (const r of routes) {
    if (r.method !== method) continue;
    const m = url.pathname.match(r.pattern);
    if (!m) continue;
    const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1]!)]));
    return r.handler({ body: clone(body ?? {}), query: url.searchParams, params, user }) as Result<T>;
  }
  return fail(404, "route_not_found", `${method} ${url.pathname} is not part of the API`) as Result<T>;
}
