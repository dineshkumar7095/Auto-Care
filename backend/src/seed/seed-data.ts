import * as fx from "@automotive/api-client/fixtures";
import { AuditLog } from "../modules/audit/audit.model";
import { Otp } from "../modules/auth/otp.model";
import { Booking, JobCard } from "../modules/bookings/booking.model";
import { Workshop } from "../modules/bookings/workshop.model";
import { Product } from "../modules/catalogue/product.model";
import { FleetApproval, FleetSpend, FleetVehicle } from "../modules/fleet/fleet.model";
import { Notification } from "../modules/notifications/notification.model";
import { Payout } from "../modules/payouts/payout.model";
import { ReturnRequest } from "../modules/returns/return.model";
import { Review } from "../modules/reviews/review.model";
import { CreditAccount, PriceList, Rfq } from "../modules/trade/trade.model";
import { Order } from "../modules/orders/order.model";
import { TowTruck, TowingProvider, TowingTrip } from "../modules/towing/towing.model";
import { User } from "../modules/users/user.model";
import { Vehicle } from "../modules/vehicles/vehicle.model";
import { Vendor } from "../modules/vendors/vendor.model";
import { BranchStock, BusinessSettings, SupportTicket, TeamMember } from "../modules/workspace/workspace.model";

const titleCase = (id: string) => id.replace(/^(ven|fleet)-/, "").split("-").map((w) => w[0]!.toUpperCase() + w.slice(1)).join(" ");

/** Loads the same sample data the frontend demo mode uses. Wipes existing data first. */
export async function seedDatabase() {
  const models = [User, Vendor, Vehicle, Product, Order, Workshop, Booking, JobCard, TowingProvider, TowingTrip, FleetVehicle, FleetApproval, FleetSpend, Rfq, PriceList, CreditAccount, TowTruck, Review, ReturnRequest, Payout, Notification, TeamMember, BusinessSettings, SupportTicket, BranchStock, Otp, AuditLog];
  await Promise.all(models.map((m) => m.collection.deleteMany({})));
  await Promise.all(models.map((m) => m.syncIndexes()));

  const known = new Set(fx.vendors.map((v) => v.id));
  const referenced = [...fx.products.map((p) => p.vendorId), ...fx.workshops.map((w) => w.vendorId), ...fx.towingProviders.map((t) => t.id), ...Object.values(fx.offers).flat().map((o) => o.vendorId)];
  const extraVendors = [...new Set(referenced)].filter((id) => !known.has(id)).map((id) => ({
    _id: id,
    name: titleCase(id),
    type: fx.workshops.some((w) => w.vendorId === id) ? "workshop" : fx.towingProviders.some((t) => t.id === id) ? "towing" : "seller",
    city: "Hyderabad",
    status: "approved",
    risk: "low",
    documents: [{ label: "GST certificate", verified: true }],
  }));

  await Vendor.insertMany([...fx.vendors.map(({ id, ...v }) => ({ _id: id, ...v, submittedAt: new Date(v.submittedAt) })), ...extraVendors]);
  await User.insertMany(fx.demoUsers.map(({ id, ...u }) => ({ _id: id, ...u })));
  await Vehicle.insertMany([{ ownerId: "u-arjun", registration: "TS 09 MX 4412", make: "Maruti Suzuki", model: "Swift", variant: "VXi", year: 2021, fuel: "petrol", category: "car" }]);

  // Offers become real listings of the same part from other sellers.
  const offerListings = Object.entries(fx.offers).flatMap(([productId, offers]) => {
    const base = fx.products.find((p) => p.id === productId)!;
    return offers.map((o, i) => ({ ...base, id: `${productId}-offer-${i}`, vendorId: o.vendorId, sellerName: o.sellerName, pricePaise: o.pricePaise, delivery: o.delivery, rating: o.rating, sellerVerified: o.verified }));
  });
  await Product.insertMany([...fx.products, ...offerListings].map(({ id, ...p }) => ({ _id: id, ...p })));
  await Order.insertMany(fx.orders.map(({ id, createdAt, ...o }) => ({ _id: id, ...o, createdAt: new Date(createdAt), deliveredAt: o.deliveredAt ? new Date(o.deliveredAt) : null, history: [{ status: o.status, at: new Date(createdAt), by: "seed" }] })));
  await Workshop.insertMany(fx.workshops.map(({ id, ...w }) => ({ _id: id, ...w })));
  await Booking.insertMany(fx.bookings.map(({ id, ...b }) => ({ _id: id, ...b })));
  await JobCard.insertMany(fx.jobCards.map(({ id, ...j }) => ({ _id: id, ...j, estimate: j.estimate.map((l) => ({ ...l, approved: j.stage !== "awaiting_approval" })) })));
  await TowingProvider.insertMany(fx.towingProviders.map(({ id, ...t }) => ({ vendorId: id, ...t })));
  await TowingTrip.insertMany(fx.towingTrips.map(({ id, ...t }) => ({ _id: id, ...t })));
  await FleetVehicle.insertMany(fx.fleetVehicles.map(({ id, ...v }) => ({ _id: id, ...v })));
  await FleetApproval.insertMany(fx.fleetApprovals.map(({ id, ...a }) => ({ _id: id, ...a })));
  const at = <T extends { createdAt: string }>({ createdAt, ...rest }: T) => ({ ...rest, createdAt: new Date(createdAt) });
  await Rfq.insertMany(fx.rfqs.map(({ id, expiresAt, ...r }) => ({ _id: id, ...at(r), expiresAt: new Date(expiresAt) })));
  await PriceList.insertMany(fx.priceLists.map(({ id, ...p }) => ({ _id: id, ...p })));
  await CreditAccount.insertMany(fx.creditAccounts.map(({ id, ...c }) => ({ _id: id, ...c })));
  await TowTruck.insertMany(fx.towTrucks.map(({ id, ...t }) => ({ _id: id, ...t })));
  await FleetSpend.insertMany(fx.fleetSpend.map((m, order) => ({ fleetId: fx.VENDOR_IDS.fleetline, order, ...m })));
  await Review.insertMany(fx.reviews.map(({ id, ...r }) => ({ _id: id, ...at(r) })));
  await BranchStock.insertMany(fx.branchStock.map(({ id, ...b }) => ({ _id: id, ...b })));
  await TeamMember.insertMany(fx.teamMembers.map(({ id, joinedAt, ...m }) => ({ _id: id, ...m, joinedAt: new Date(joinedAt) })));
  await SupportTicket.insertMany(fx.supportTickets.map(({ id, ...t }) => ({ _id: id, ...at(t) })));
  await ReturnRequest.insertMany(fx.returnRequests.map(({ id, ...r }) => ({ _id: id, ...at(r) })));
  await Payout.insertMany(fx.payouts.map(({ id, payoutDate, ...p }) => ({ _id: id, ...p, payoutDate: new Date(payoutDate) })));
  await Notification.insertMany(fx.notifications.map(({ id, ...n }) => ({ _id: id, ...at(n) })));
}
