/**
 * Sample dataset shared by the offline mock server (frontend demo mode) and the backend seed script,
 * so demo data and seeded data never drift apart. Money is integer paise.
 */
import { COMMISSION_BPS, computePayout } from "@automotive/utilities";
import type { AppNotification, ApprovalRequest, Booking, CreditAccount, FleetSpendMonth, Payout, PriceList, ReturnRequest, Review, Rfq, TowTruck, FleetVehicle, JobCard, Offer, Order, PortalId, Product, Role, TowingProvider, TowingTrip, Vendor, Workshop, TeamMember, SupportTicket, BusinessSettings, BranchStock } from "@automotive/shared-types";

export const VENDOR_IDS = {
  sriGanesh: "ven-sri-ganesh",
  metro: "ven-metro-motor",
  powercell: "ven-powercell",
  highway: "ven-highway-spares",
  roadgrip: "ven-roadgrip",
  secondGear: "ven-second-gear",
  precision: "ven-precision-car-care",
  autohub: "ven-autohub",
  swiftRecovery: "ven-swift-recovery",
  fleetline: "fleet-fleetline",
} as const;

type P = Omit<Product, "gstRatePct" | "listingStatus"> & Partial<Pick<Product, "gstRatePct" | "listingStatus">>;
const product = (p: P): Product => ({ gstRatePct: 18, listingStatus: "live", ...p });

export const products: Product[] = [
  product({ id: "p-brake-pad-swift", title: "Front Disc Brake Pad Set", brand: "Bosch", partNumber: "0986AB1234", category: "Brakes", partClass: "OES", fitment: "verified", pricePaise: 189900, mrpPaise: 245000, stock: 18, delivery: "Tomorrow", warranty: "6 months", rating: 4.6, reviews: 312, vendorId: VENDOR_IDS.sriGanesh, sellerName: "Sri Ganesh Auto Spares", sellerCity: "Hyderabad", sellerVerified: true, returnable: true, specs: { Position: "Front axle", Material: "Low-metallic", "Pieces in set": "4", "Wear indicator": "Yes" } }),
  product({ id: "p-oil-filter", title: "Engine Oil Filter", brand: "Maruti Genuine Parts", partNumber: "16510M68K00", category: "Filters", partClass: "OEM", fitment: "verified", pricePaise: 32000, mrpPaise: 36500, stock: 64, delivery: "Today, by 7 pm", warranty: "—", rating: 4.8, reviews: 1120, vendorId: VENDOR_IDS.sriGanesh, sellerName: "Sri Ganesh Auto Spares", sellerCity: "Hyderabad", sellerVerified: true, returnable: true, specs: { Type: "Spin-on", Thread: "M20 × 1.5", Height: "68 mm" } }),
  product({ id: "p-battery-35ah", title: "Car Battery 35Ah", brand: "Exide", partNumber: "MLDIN35", category: "Batteries", partClass: "Aftermarket", fitment: "seller-confirmed", pricePaise: 485000, mrpPaise: 560000, stock: 9, delivery: "Today, fitted at home", warranty: "55 months", rating: 4.5, reviews: 846, vendorId: VENDOR_IDS.sriGanesh, sellerName: "Sri Ganesh Auto Spares", sellerCity: "Hyderabad", sellerVerified: true, returnable: false, gstRatePct: 28, specs: { Capacity: "35 Ah", Voltage: "12 V", Terminal: "Standard" } }),
  product({ id: "p-shock-absorber", title: "Rear Shock Absorber (pair)", brand: "Gabriel", partNumber: "GAB-SW-R21", category: "Suspension", partClass: "Aftermarket", fitment: "possible", pricePaise: 368000, mrpPaise: 420000, stock: 4, delivery: "In 2 days", warranty: "12 months", rating: 4.2, reviews: 98, vendorId: VENDOR_IDS.sriGanesh, sellerName: "Sri Ganesh Auto Spares", sellerCity: "Hyderabad", sellerVerified: true, returnable: true, listingStatus: "pending_review", specs: { Position: "Rear", Type: "Gas-charged", Quantity: "2" } }),
  product({ id: "p-tyre-185", title: "Tubeless Tyre 185/65 R15", brand: "MRF", partNumber: "ZVTV-18565R15", category: "Tyres", partClass: "Aftermarket", fitment: "verified", pricePaise: 539000, mrpPaise: 612000, stock: 22, delivery: "Tomorrow, fitting slot available", warranty: "5 years (manufacturer)", rating: 4.7, reviews: 540, vendorId: VENDOR_IDS.roadgrip, sellerName: "RoadGrip Tyres", sellerCity: "Hyderabad", sellerVerified: true, returnable: false, gstRatePct: 28, specs: { Size: "185/65 R15", "Load index": "88", "Speed rating": "H" } }),
  product({ id: "p-engine-oil", title: "Fully Synthetic Engine Oil 0W-20 · 3.5 L", brand: "Castrol", partNumber: "EDGE-0W20-35", category: "Lubricants", partClass: "Aftermarket", fitment: "seller-confirmed", pricePaise: 289000, mrpPaise: 315000, stock: 40, delivery: "Today, by 7 pm", warranty: "—", rating: 4.6, reviews: 2211, vendorId: VENDOR_IDS.sriGanesh, sellerName: "Sri Ganesh Auto Spares", sellerCity: "Hyderabad", sellerVerified: true, returnable: true, listingStatus: "paused", specs: { Grade: "0W-20", Volume: "3.5 L", Spec: "API SP" } }),
  product({ id: "p-headlamp", title: "Headlamp Assembly (Left)", brand: "Lumax", partNumber: "LMX-HL-SW-L", category: "Electrical", partClass: "Refurbished", fitment: "possible", pricePaise: 410000, mrpPaise: 690000, stock: 2, delivery: "In 3 days", warranty: "3 months (seller)", rating: 4.0, reviews: 27, vendorId: VENDOR_IDS.secondGear, sellerName: "Second Gear Reclaim", sellerCity: "Warangal", sellerVerified: false, returnable: true, specs: { Side: "Left", Bulb: "H4 halogen", Condition: "Refurbished, tested" } }),
  product({ id: "p-air-filter", title: "Air Filter Element", brand: "Purolator", partNumber: "PUR-A1129", category: "Filters", partClass: "Aftermarket", fitment: "not-verified", pricePaise: 46000, mrpPaise: 59000, stock: 35, delivery: "Tomorrow", warranty: "—", rating: 4.3, reviews: 188, vendorId: VENDOR_IDS.highway, sellerName: "Highway Spares Co.", sellerCity: "Secunderabad", sellerVerified: true, returnable: true, specs: { Type: "Panel", Material: "Cellulose" } }),
];

export const offers: Record<string, Offer[]> = {
  "p-brake-pad-swift": [
    { vendorId: VENDOR_IDS.metro, sellerName: "Metro Motor Parts", pricePaise: 194500, delivery: "Today, by 7 pm", rating: 4.7, verified: true },
    { vendorId: VENDOR_IDS.autohub, sellerName: "AutoHub Wholesale", pricePaise: 182000, delivery: "In 3 days", rating: 4.3, verified: true },
  ],
};

export const workshops: Workshop[] = [
  { id: "w-precision", vendorId: VENDOR_IDS.precision, name: "Precision Car Care", area: "Banjara Hills", city: "Hyderabad", distanceKm: 1.8, rating: 4.8, reviews: 624, verified: true, specialties: ["General service", "AC repair", "Diagnostics"], fromPricePaise: 249900, nextSlot: "Today, 4:30 pm", hours: "9 am – 8 pm", pickup: true, evQualified: false },
  { id: "w-voltworks", vendorId: "ven-voltworks", name: "VoltWorks EV Service", area: "Gachibowli", city: "Hyderabad", distanceKm: 4.2, rating: 4.7, reviews: 211, verified: true, specialties: ["EV diagnostics", "Battery health", "Tyres"], fromPricePaise: 199900, nextSlot: "Tomorrow, 10:00 am", hours: "10 am – 7 pm", pickup: true, evQualified: true },
  { id: "w-ravi", vendorId: "ven-ravi-2w", name: "Ravi Two-Wheeler Clinic", area: "Madhapur", city: "Hyderabad", distanceKm: 2.6, rating: 4.6, reviews: 1380, verified: true, specialties: ["Bike service", "Puncture", "Chain & sprocket"], fromPricePaise: 59900, nextSlot: "Today, 2:00 pm", hours: "8 am – 9 pm", pickup: false, evQualified: false },
  { id: "w-dentshine", vendorId: "ven-dent-shine", name: "Dent & Shine Body Shop", area: "Kondapur", city: "Hyderabad", distanceKm: 9.4, rating: 4.4, reviews: 305, verified: false, specialties: ["Denting & painting", "Detailing", "Insurance claims"], fromPricePaise: 149900, nextSlot: "Mon, 11:00 am", hours: "9 am – 7 pm", pickup: true, evQualified: false },
];

const line = (productId: string, quantity: number) => {
  const p = products.find((x) => x.id === productId)!;
  return { productId, title: p.title, quantity, unitPricePaise: p.pricePaise, gstRatePct: p.gstRatePct };
};
const order = (o: Omit<Order, "totals" | "vendorId"> & { vendorId?: string }): Order => {
  const gross = o.lines.reduce((s, l) => s + l.unitPricePaise * l.quantity, 0);
  const tax = o.lines.reduce((s, l) => s + Math.round((l.unitPricePaise * l.quantity * l.gstRatePct) / (100 + l.gstRatePct)), 0);
  return { vendorId: VENDOR_IDS.sriGanesh, ...o, totals: { subtotalPaise: gross - tax, taxPaise: tax, shippingPaise: 0, discountPaise: 0, totalPaise: gross } };
};

/** Relative dates keep demo returns and RFQs inside their windows whenever the demo is run. */
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();
const daysAhead = (d: number) => daysAgo(-d);

export const orders: Order[] = [
  order({ id: "o-24811", number: "ORD-24811", customerId: "u-arjun", customerName: "Arjun M.", channel: "B2C", lines: [line("p-brake-pad-swift", 1)], status: "placed", createdAt: "2026-11-13T07:30:00Z" }),
  order({ id: "o-24807", number: "ORD-24807", customerId: "u-precision", customerName: "Precision Car Care", channel: "B2B", lines: [line("p-oil-filter", 12)], status: "placed", createdAt: "2026-11-13T07:08:00Z" }),
  order({ id: "o-24799", number: "ORD-24799", customerId: "u-neha", customerName: "Neha R.", channel: "B2C", lines: [line("p-engine-oil", 1), line("p-oil-filter", 1)], status: "accepted", createdAt: "2026-11-13T06:40:00Z" }),
  order({ id: "o-24782", number: "ORD-24782", customerId: "u-fleetline", customerName: "Fleetline Logistics", channel: "B2B", lines: [line("p-brake-pad-swift", 20)], status: "packed", createdAt: "2026-11-13T04:40:00Z" }),
  order({ id: "o-24760", number: "ORD-24760", customerId: "u-karthik", customerName: "Karthik S.", channel: "B2C", lines: [line("p-battery-35ah", 1)], status: "dispatched", createdAt: "2026-11-12T10:00:00Z" }),
  order({ id: "o-24711", number: "ORD-24711", customerId: "u-divya", customerName: "Divya P.", channel: "B2C", lines: [line("p-oil-filter", 2)], status: "return_requested", createdAt: "2026-11-11T09:00:00Z", deliveredAt: daysAgo(2) }),
  order({ id: "o-24702", number: "ORD-24702", customerId: "u-arjun", customerName: "Arjun Mehta", channel: "B2C", lines: [line("p-oil-filter", 1), line("p-brake-pad-swift", 1)], status: "delivered", createdAt: "2026-11-08T09:00:00Z", deliveredAt: daysAgo(3) }),
  order({ id: "o-t-5512", number: "TRD-5512", customerId: "u-sriganesh", customerName: "Sri Ganesh Auto Spares", vendorId: VENDOR_IDS.autohub, channel: "B2B", lines: [line("p-brake-pad-swift", 50), line("p-oil-filter", 120)], status: "placed", createdAt: "2026-11-13T06:10:00Z" }),
  order({ id: "o-t-5509", number: "TRD-5509", customerId: "u-precision", customerName: "Precision Car Care", vendorId: VENDOR_IDS.autohub, channel: "B2B", lines: [line("p-engine-oil", 24)], status: "packed", createdAt: "2026-11-12T11:00:00Z" }),
  order({ id: "o-t-5501", number: "TRD-5501", customerId: "u-fleetline", customerName: "Fleetline Logistics", vendorId: VENDOR_IDS.autohub, channel: "B2B", lines: [line("p-tyre-185", 16)], status: "delivered", createdAt: "2026-11-10T08:00:00Z" }),
  order({ id: "o-24690", number: "ORD-24690", customerId: "u-sameer", customerName: "Sameer K.", channel: "B2C", lines: [line("p-shock-absorber", 1)], status: "return_requested", createdAt: "2026-11-09T09:00:00Z" }),
];

const est = (pairs: [string, "part" | "labour" | "material", number][]) => pairs.map(([label, kind, amountPaise]) => ({ label, kind, amountPaise }));
export const jobCards: JobCard[] = [
  { id: "jc-1043", number: "JC-1043", workshopId: "w-precision", vehicleLabel: "Maruti Baleno 2020", registration: "TS 53 BL 6612", customerName: "Vikram J.", complaint: "Battery draining overnight", stage: "booked", technician: null, estimate: [], promisedAt: "Today, 4:30 pm" },
  { id: "jc-1039", number: "JC-1039", workshopId: "w-precision", vehicleLabel: "Tata Nexon 2022", registration: "TS 02 TN 1188", customerName: "Fleetline Logistics", complaint: "Clutch hard, pulling left", stage: "checked_in", technician: "Ravi", estimate: [], promisedAt: "Tomorrow, 4 pm" },
  { id: "jc-1040", number: "JC-1040", workshopId: "w-precision", vehicleLabel: "Honda City 2019", registration: "TS 51 AB 2290", customerName: "Meera K.", complaint: "Check engine light", stage: "diagnosis", technician: "Imran", estimate: [], promisedAt: "Tomorrow, 1 pm" },
  { id: "jc-1042", number: "JC-1042", workshopId: "w-precision", vehicleLabel: "Hyundai Creta 2020", registration: "TS 04 MN 7781", customerName: "Rahul V.", complaint: "AC not cooling, noise from front", stage: "awaiting_approval", technician: "Imran", estimate: est([["AC gas top-up (R134a)", "material", 280000], ["Cabin filter", "part", 65000], ["Compressor clutch bearing", "part", 640000], ["Compressor labour", "labour", 150000]]), promisedAt: "Today, 6 pm" },
  { id: "jc-1041", number: "JC-1041", workshopId: "w-precision", vehicleLabel: "Maruti Swift 2021", registration: "TS 03 MX 4412", customerName: "Arjun M.", complaint: "Periodic service + brake squeal", stage: "in_repair", technician: "Suresh", estimate: est([["Periodic service", "labour", 349000], ["Front brake pads", "part", 189900], ["Engine oil + filter", "material", 109100]]), promisedAt: "Today, 5 pm" },
  { id: "jc-1038", number: "JC-1038", workshopId: "w-precision", vehicleLabel: "Toyota Innova 2018", registration: "TS 01 IN 5521", customerName: "Sanjay T.", complaint: "Suspension noise", stage: "quality_check", technician: "Suresh", estimate: est([["Front struts (pair)", "part", 782000], ["Labour", "labour", 150000]]), promisedAt: "Today, 3 pm" },
  { id: "jc-1037", number: "JC-1037", workshopId: "w-precision", vehicleLabel: "Kia Seltos 2021", registration: "TS 05 KS 3320", customerName: "Priya D.", complaint: "General service", stage: "ready", technician: "Ravi", estimate: est([["General service", "labour", 512000]]), promisedAt: "Done" },
];

export const bookings: Booking[] = [
  { id: "b-1", workshopId: "w-precision", customerName: "Priya D.", vehicleLabel: "Kia Seltos", service: "General service", slot: "10:00", source: "marketplace" },
  { id: "b-2", workshopId: "w-precision", customerName: "Rahul V.", vehicleLabel: "Hyundai Creta", service: "AC diagnosis", slot: "11:30", source: "marketplace" },
  { id: "b-3", workshopId: "w-precision", customerName: "Walk-in", vehicleLabel: "Honda Amaze", service: "Wheel alignment", slot: "14:00", source: "walk_in" },
  { id: "b-4", workshopId: "w-precision", customerName: "Vikram J.", vehicleLabel: "Maruti Baleno", service: "Battery check", slot: "16:30", source: "marketplace" },
];

export const vendors: Vendor[] = [
  { id: VENDOR_IDS.autohub, name: "AutoHub Wholesale Pvt Ltd", type: "distributor", city: "Hyderabad", status: "pending", risk: "low", submittedAt: "2026-11-13T05:00:00Z", documents: [{ label: "GST certificate", verified: true }, { label: "Bank proof", verified: true }, { label: "Address proof", verified: true }] },
  { id: "ven-dent-shine", name: "Dent & Shine Body Shop", type: "workshop", city: "Hyderabad", status: "pending", risk: "medium", submittedAt: "2026-11-13T02:00:00Z", documents: [{ label: "Trade licence", verified: true }, { label: "Bank proof", verified: false }, { label: "Workshop photos", verified: true }] },
  { id: VENDOR_IDS.secondGear, name: "Second Gear Reclaim", type: "seller", city: "Warangal", status: "pending", risk: "high", submittedAt: "2026-11-12T09:00:00Z", documents: [{ label: "GST certificate", verified: false }, { label: "Bank proof", verified: true }, { label: "Refurbishment policy", verified: false }] },
  { id: "ven-citytow", name: "CityTow Partners", type: "towing", city: "Hyderabad", status: "pending", risk: "low", submittedAt: "2026-11-12T08:00:00Z", documents: [{ label: "Vehicle RC", verified: true }, { label: "Driver licences", verified: true }, { label: "Insurance", verified: true }] },
  { id: VENDOR_IDS.sriGanesh, name: "Sri Ganesh Auto Spares", type: "seller", city: "Hyderabad", status: "approved", risk: "low", submittedAt: "2026-09-01T08:00:00Z", documents: [{ label: "GST certificate", verified: true }, { label: "Bank proof", verified: true }] },
  { id: VENDOR_IDS.precision, name: "Precision Car Care", type: "workshop", city: "Hyderabad", status: "approved", risk: "low", submittedAt: "2026-09-04T08:00:00Z", documents: [{ label: "Trade licence", verified: true }, { label: "Bank proof", verified: true }] },
];

export const towingProviders: TowingProvider[] = [
  { id: VENDOR_IDS.swiftRecovery, name: "Swift Recovery Services", etaMin: 18, distanceKm: 4.1, truck: "Flatbed · up to 3.5 t", evSafe: false, pricePaise: 189900, rating: 4.7 },
  { id: "ven-highway-rescue", name: "Highway Rescue 24×7", etaMin: 26, distanceKm: 7.8, truck: "Wheel-lift · up to 2.5 t", evSafe: false, pricePaise: 149900, rating: 4.4 },
  { id: "ven-citytow", name: "CityTow Partners", etaMin: 34, distanceKm: 11.2, truck: "Flatbed · EV-safe", evSafe: true, pricePaise: 229900, rating: 4.8 },
];

export const towingTrips: TowingTrip[] = [
  { id: "t-8815", number: "TW-8815", customerName: "Ananya K.", issue: "breakdown", pickup: "Road No. 36, Jubilee Hills check post", drop: "Precision Car Care, Banjara Hills", providerId: VENDOR_IDS.swiftRecovery, driverName: null, status: "requested", etaMin: null, quotedPaise: 189900 },
  { id: "t-8814", number: "TW-8814", customerName: "Fleetline Logistics", issue: "accident_recovery", pickup: "ORR, Financial District exit", drop: "Fleetline depot, Patancheru", providerId: VENDOR_IDS.swiftRecovery, driverName: "Manjunath", status: "en_route", etaMin: 12, quotedPaise: 420000 },
  { id: "t-8812", number: "TW-8812", customerName: "Rohit S.", issue: "flat_tyre", pickup: "ORR, Kokapet", drop: "On-site fix", providerId: VENDOR_IDS.swiftRecovery, driverName: "Shiva", status: "arrived", etaMin: 0, quotedPaise: 69900 },
];

export const fleetVehicles: FleetVehicle[] = [
  { id: "fv-1", fleetId: VENDOR_IDS.fleetline, registration: "TS 01 AJ 1101", model: "Tata Ace Gold", category: "truck", odometerKm: 48210, nextServiceKm: 50000, status: "active", driver: "Ramesh" },
  { id: "fv-2", fleetId: VENDOR_IDS.fleetline, registration: "TS 01 AJ 1102", model: "Tata Ace Gold", category: "truck", odometerKm: 50340, nextServiceKm: 50000, status: "in_service", driver: null },
  { id: "fv-3", fleetId: VENDOR_IDS.fleetline, registration: "TS 02 TN 1188", model: "Tata Nexon", category: "car", odometerKm: 31220, nextServiceKm: 40000, status: "in_service", driver: null },
  { id: "fv-4", fleetId: VENDOR_IDS.fleetline, registration: "TS 05 EV 7744", model: "Mahindra Treo", category: "three-wheeler", odometerKm: 18890, nextServiceKm: 20000, status: "active", driver: "Salim" },
  { id: "fv-5", fleetId: VENDOR_IDS.fleetline, registration: "TS 51 BH 3003", model: "Ashok Leyland Dost", category: "truck", odometerKm: 77120, nextServiceKm: 80000, status: "breakdown", driver: "Prakash" },
];

export const fleetApprovals: ApprovalRequest[] = [
  { id: "fa-1", fleetId: VENDOR_IDS.fleetline, title: "Clutch overhaul — TS 02 TN 1188 at Precision Car Care", amountPaise: 1840000, requestedBy: "Precision Car Care", status: "pending" },
  { id: "fa-2", fleetId: VENDOR_IDS.fleetline, title: "20 × Brake pad sets (bulk order)", amountPaise: 3420000, requestedBy: "Depot manager", status: "pending" },
];

export const weeklyValue = [
  { day: "Mon", parts: 42, services: 18, towing: 4 },
  { day: "Tue", parts: 48, services: 21, towing: 5 },
  { day: "Wed", parts: 45, services: 24, towing: 3 },
  { day: "Thu", parts: 56, services: 22, towing: 6 },
  { day: "Fri", parts: 61, services: 27, towing: 7 },
  { day: "Sat", parts: 74, services: 35, towing: 9 },
  { day: "Sun", parts: 52, services: 30, towing: 8 },
];

export const adminAlerts = [
  { level: "high" as const, text: "3 orders past seller acceptance deadline in Hyderabad West" },
  { level: "medium" as const, text: "Bank detail change requested by Metro Motor Parts — needs second approval" },
  { level: "medium" as const, text: "Towing ETA breach on trip TW-8812 (42 min vs 25 min promised)" },
  { level: "low" as const, text: "12 listings flagged for 'genuine' claim without supporting proof" },
];

/** Demo accounts. In demo/seed mode the OTP for every account is 123456. */
export const demoUsers: { id: string; name: string; phone: string; roles: Role[]; vendorId: string | null; fleetId: string | null }[] = [
  { id: "u-arjun", name: "Arjun Mehta", phone: "+919800000001", roles: ["customer"], vendorId: null, fleetId: null },
  { id: "u-ganesh", name: "Ganesh Rao", phone: "+919800000002", roles: ["seller_owner"], vendorId: VENDOR_IDS.sriGanesh, fleetId: null },
  { id: "u-anita", name: "Anita Shetty", phone: "+919800000003", roles: ["workshop_manager"], vendorId: VENDOR_IDS.precision, fleetId: null },
  { id: "u-kavya", name: "Kavya Iyer", phone: "+919800000004", roles: ["admin_ops", "admin_finance"], vendorId: null, fleetId: null },
  { id: "u-farhan", name: "Farhan Ali", phone: "+919800000005", roles: ["distributor_admin"], vendorId: VENDOR_IDS.autohub, fleetId: null },
  { id: "u-manju", name: "Manjunath K", phone: "+919800000006", roles: ["towing_operator"], vendorId: VENDOR_IDS.swiftRecovery, fleetId: null },
  { id: "u-shiva", name: "Shiva", phone: "+919800000016", roles: ["driver"], vendorId: VENDOR_IDS.swiftRecovery, fleetId: null },
  { id: "u-deepa", name: "Deepa Nair", phone: "+919800000007", roles: ["fleet_manager"], vendorId: null, fleetId: VENDOR_IDS.fleetline },
];

/** The demo account each portal signs into by default. */
export const DEMO_ACCOUNT_BY_PORTAL: Record<PortalId, string> = {
  "customer-web": "+919800000001",
  "seller-portal": "+919800000002",
  "workshop-portal": "+919800000003",
  "admin-portal": "+919800000004",
  "distributor-portal": "+919800000005",
  "towing-portal": "+919800000006",
  "fleet-portal": "+919800000007",
};

export const DEMO_OTP = "123456";

// ---------- distributor trade ----------
export const rfqs: Rfq[] = [
  { id: "rfq-301", number: "RFQ-301", vendorId: VENDOR_IDS.autohub, buyerName: "Fleetline Logistics", buyerType: "fleet", status: "open", expiresAt: daysAhead(1), quotedTotalPaise: null, createdAt: daysAgo(1), lines: [{ title: "Clutch plate kit — Tata Ace", partNumber: "TA-CLT-220", quantity: 10, targetUnitPaise: 420000 }, { title: "Brake shoe set — Tata Ace", partNumber: "TA-BRS-110", quantity: 20, targetUnitPaise: 95000 }] },
  { id: "rfq-300", number: "RFQ-300", vendorId: VENDOR_IDS.autohub, buyerName: "Precision Car Care", buyerType: "workshop", status: "open", expiresAt: daysAhead(3), quotedTotalPaise: null, createdAt: daysAgo(1), lines: [{ title: "Engine oil 5W-30 · 20 L drum", partNumber: "CAS-5W30-20", quantity: 6, targetUnitPaise: null }] },
  { id: "rfq-298", number: "RFQ-298", vendorId: VENDOR_IDS.autohub, buyerName: "Sri Ganesh Auto Spares", buyerType: "retailer", status: "quoted", expiresAt: daysAhead(2), quotedTotalPaise: 1845000, createdAt: daysAgo(3), lines: [{ title: "Oil filter — Maruti", partNumber: "16510M68K00", quantity: 60, targetUnitPaise: 30000 }] },
  { id: "rfq-291", number: "RFQ-291", vendorId: VENDOR_IDS.autohub, buyerName: "Highway Spares Co.", buyerType: "retailer", status: "won", expiresAt: daysAgo(2), quotedTotalPaise: 2260000, createdAt: daysAgo(8), lines: [{ title: "Air filter element", partNumber: "PUR-A1129", quantity: 50, targetUnitPaise: 44000 }] },
];

export const priceLists: PriceList[] = [
  { id: "pl-1", vendorId: VENDOR_IDS.autohub, name: "Retailer standard", buyerGroup: "retailer", discountPct: 12, minOrderPaise: 2500000, skuCount: 1840, active: true },
  { id: "pl-2", vendorId: VENDOR_IDS.autohub, name: "Workshop trade", buyerGroup: "workshop", discountPct: 9, minOrderPaise: 1000000, skuCount: 1210, active: true },
  { id: "pl-3", vendorId: VENDOR_IDS.autohub, name: "Fleet contract", buyerGroup: "fleet", discountPct: 15, minOrderPaise: 5000000, skuCount: 420, active: true },
  { id: "pl-4", vendorId: VENDOR_IDS.autohub, name: "Festive clearance", buyerGroup: "retailer", discountPct: 20, minOrderPaise: 5000000, skuCount: 96, active: false },
];

export const creditAccounts: CreditAccount[] = [
  { id: "cr-1", vendorId: VENDOR_IDS.autohub, buyerName: "Sri Ganesh Auto Spares", limitPaise: 20000000, usedPaise: 14250000, termsDays: 30, overdueDays: 0 },
  { id: "cr-2", vendorId: VENDOR_IDS.autohub, buyerName: "Precision Car Care", limitPaise: 10000000, usedPaise: 10800000, termsDays: 21, overdueDays: 6 },
  { id: "cr-3", vendorId: VENDOR_IDS.autohub, buyerName: "Fleetline Logistics", limitPaise: 30000000, usedPaise: 18200000, termsDays: 45, overdueDays: 0 },
  { id: "cr-4", vendorId: VENDOR_IDS.autohub, buyerName: "Highway Spares Co.", limitPaise: 8000000, usedPaise: 5000000, termsDays: 30, overdueDays: 38 },
];

// ---------- towing fleet ----------
export const towTrucks: TowTruck[] = [
  { id: "tt-1", vendorId: VENDOR_IDS.swiftRecovery, registration: "TS 08 UB 4410", type: "flatbed", evSafe: true, driverName: "Manjunath", driverPhone: "+919800000006", status: "on_trip" },
  { id: "tt-2", vendorId: VENDOR_IDS.swiftRecovery, registration: "TS 08 UB 4411", type: "wheel_lift", evSafe: false, driverName: "Shiva", driverPhone: "+919800000016", status: "on_trip" },
  { id: "tt-3", vendorId: VENDOR_IDS.swiftRecovery, registration: "TS 07 UC 2290", type: "flatbed", evSafe: true, driverName: "Imran", driverPhone: "+919800000026", status: "available" },
  { id: "tt-4", vendorId: VENDOR_IDS.swiftRecovery, registration: "TS 10 UA 0871", type: "heavy_duty", evSafe: false, driverName: null, driverPhone: null, status: "maintenance" },
];

// ---------- fleet spend ----------
export const fleetSpend: FleetSpendMonth[] = [
  { month: "Jun", partsPaise: 18200000, servicePaise: 9600000, towingPaise: 840000 },
  { month: "Jul", partsPaise: 16400000, servicePaise: 11200000, towingPaise: 420000 },
  { month: "Aug", partsPaise: 21000000, servicePaise: 8800000, towingPaise: 1260000 },
  { month: "Sep", partsPaise: 17500000, servicePaise: 10400000, towingPaise: 630000 },
  { month: "Oct", partsPaise: 19800000, servicePaise: 12600000, towingPaise: 1050000 },
  { month: "Nov", partsPaise: 9400000, servicePaise: 5200000, towingPaise: 420000 },
];

// ---------- after-sales ----------
export const reviews: Review[] = [
  { id: "rv-w1", productId: "w-precision", authorId: "u-arjun", authorName: "Arjun M.", rating: 5, text: "AC was blowing warm. Fixed in one day and they called before adding any extra work.", verifiedPurchase: true, createdAt: daysAgo(3) },
  { id: "rv-w2", productId: "w-precision", authorId: "u-sameer", authorName: "Sameer K.", rating: 4, text: "Good general service and pickup from Kondapur. Delivery was an hour late.", verifiedPurchase: true, createdAt: daysAgo(9) },
  { id: "rv-1", productId: "p-brake-pad-swift", authorId: "u-karthik", authorName: "Karthik S.", rating: 5, text: "Exact fit on my 2020 Swift. Braking feels sharper and no squeal.", verifiedPurchase: true, createdAt: daysAgo(6) },
  { id: "rv-2", productId: "p-brake-pad-swift", authorId: "u-neha", authorName: "Neha R.", rating: 4, text: "Good pads, delivered next day in Madhapur. Box was a bit dented.", verifiedPurchase: true, createdAt: daysAgo(12) },
  { id: "rv-3", productId: "p-oil-filter", authorId: "u-divya", authorName: "Divya P.", rating: 5, text: "Same part number as the one the service centre used. Half the price.", verifiedPurchase: true, createdAt: daysAgo(4) },
];

export const returnRequests: ReturnRequest[] = [
  { id: "rt-1", orderId: "o-24711", orderNumber: "ORD-24711", customerId: "u-divya", customerName: "Divya P.", vendorId: VENDOR_IDS.sriGanesh, reason: "does_not_fit", note: "Thread size doesn't match my i20.", amountPaise: 64000, status: "requested", createdAt: daysAgo(1) },
];

const payout = (id: string, vendorId: string, vendorName: string, periodLabel: string, grossPaise: number, bps: number, refundsPaise: number, status: Payout["status"], payoutDate: string): Payout => ({
  id, vendorId, vendorName, periodLabel, status, payoutDate, ...computePayout({ grossPaise, commissionBps: bps, refundsPaise }),
});
export const payouts: Payout[] = [
  payout("po-1", VENDOR_IDS.sriGanesh, "Sri Ganesh Auto Spares", "4 – 10 Nov", 18450000, COMMISSION_BPS.seller, 64000, "scheduled", daysAhead(2)),
  payout("po-2", VENDOR_IDS.sriGanesh, "Sri Ganesh Auto Spares", "28 Oct – 3 Nov", 16210000, COMMISSION_BPS.seller, 0, "paid", daysAgo(5)),
  payout("po-3", VENDOR_IDS.sriGanesh, "Sri Ganesh Auto Spares", "21 – 27 Oct", 15120000, COMMISSION_BPS.seller, 189900, "paid", daysAgo(12)),
  payout("po-4", VENDOR_IDS.precision, "Precision Car Care", "4 – 10 Nov", 9620000, COMMISSION_BPS.workshop, 0, "scheduled", daysAhead(2)),
  payout("po-5", VENDOR_IDS.swiftRecovery, "Swift Recovery Services", "4 – 10 Nov", 2840000, COMMISSION_BPS.towing, 0, "on_hold", daysAhead(2)),
  payout("po-6", VENDOR_IDS.autohub, "AutoHub Wholesale Pvt Ltd", "4 – 10 Nov", 48600000, COMMISSION_BPS.distributor, 0, "scheduled", daysAhead(2)),
];

export const notifications: AppNotification[] = [
  { id: "n-1", userId: "u-arjun", title: "Order ORD-24702 delivered", body: "Your oil filter and brake pads were delivered in Banjara Hills.", channel: "in_app", read: false, createdAt: daysAgo(3) },
  { id: "n-2", userId: "u-arjun", title: "Service reminder", body: "Your Swift (TS 09 MX 4412) is due for its 30,000 km service.", channel: "in_app", read: false, createdAt: daysAgo(1) },
  { id: "n-3", userId: "u-ganesh", title: "New return request", body: "Divya P. asked to return ORD-24711 — doesn't fit.", channel: "in_app", read: false, createdAt: daysAgo(1) },
  { id: "n-4", userId: "u-ganesh", title: "Payout scheduled", body: "Your payout for 4 – 10 Nov is scheduled.", channel: "in_app", read: true, createdAt: daysAgo(2) },
];

/** Seller/workshop GST registration state, used to choose CGST+SGST or IGST. Pilot city partners are in Telangana. */
export const VENDOR_STATE: Record<string, string> = { [VENDOR_IDS.secondGear]: "Telangana" };
export const DEFAULT_STATE = "Telangana";

// ---- workspace: team, settings, support ----
export const teamMembers: TeamMember[] = [
  { id: "tm-1", ownerId: VENDOR_IDS.precision, name: "Ramesh Goud", phone: "+919811100001", title: "Senior technician", active: true, joinedAt: daysAgo(900) },
  { id: "tm-2", ownerId: VENDOR_IDS.precision, name: "Salma Begum", phone: "+919811100002", title: "AC specialist", active: true, joinedAt: daysAgo(420) },
  { id: "tm-3", ownerId: VENDOR_IDS.precision, name: "Venkat Reddy", phone: "+919811100003", title: "Technician", active: true, joinedAt: daysAgo(200) },
  { id: "tm-4", ownerId: VENDOR_IDS.precision, name: "Imran Khan", phone: "+919811100004", title: "Trainee", active: false, joinedAt: daysAgo(60) },
  { id: "tm-5", ownerId: VENDOR_IDS.sriGanesh, name: "Lakshmi Rao", phone: "+919811100005", title: "Store manager", active: true, joinedAt: daysAgo(700) },
  { id: "tm-6", ownerId: VENDOR_IDS.sriGanesh, name: "Naveen P", phone: "+919811100006", title: "Packing & dispatch", active: true, joinedAt: daysAgo(150) },
  { id: "tm-7", ownerId: VENDOR_IDS.autohub, name: "Suresh Babu", phone: "+919811100007", title: "Sales executive · Madhapur", active: true, joinedAt: daysAgo(500) },
  { id: "tm-8", ownerId: VENDOR_IDS.autohub, name: "Priya Varma", phone: "+919811100008", title: "Sales executive · Gachibowli", active: true, joinedAt: daysAgo(320) },
];

/** Starts empty: each portal shows its own defaults until the business saves. */
export const businessSettings: BusinessSettings[] = [];

export const supportTickets: SupportTicket[] = [
  { id: "tk-1", number: "TCK-1042", subject: "Brake pads delivered for the wrong model", raisedBy: "Neha R.", raisedByType: "customer", priority: "high", status: "open", createdAt: daysAgo(0.2) },
  { id: "tk-2", number: "TCK-1041", subject: "Payout for last week not received", raisedBy: "Metro Motor Parts", raisedByType: "partner", priority: "medium", status: "in_progress", createdAt: daysAgo(1) },
  { id: "tk-3", number: "TCK-1039", subject: "Workshop asked for extra money at delivery", raisedBy: "Karthik S.", raisedByType: "customer", priority: "high", status: "open", createdAt: daysAgo(1.5) },
  { id: "tk-4", number: "TCK-1035", subject: "How do I add a second branch?", raisedBy: "Ravi Two-Wheeler Clinic", raisedByType: "partner", priority: "low", status: "resolved", createdAt: daysAgo(4) },
];

export const branchStock: BranchStock[] = [
  { id: "bs-1", vendorId: VENDOR_IDS.autohub, branch: "Madhapur warehouse", title: "Brake pads — Maruti Swift", partNumber: "BP-SW-2018", onHand: 420, reorderLevel: 150 },
  { id: "bs-2", vendorId: VENDOR_IDS.autohub, branch: "Madhapur warehouse", title: "Oil filter — Maruti", partNumber: "16510M68K00", onHand: 90, reorderLevel: 200 },
  { id: "bs-3", vendorId: VENDOR_IDS.autohub, branch: "Madhapur warehouse", title: "Engine oil 5W-30 · 20 L drum", partNumber: "CAS-5W30-20", onHand: 38, reorderLevel: 20 },
  { id: "bs-4", vendorId: VENDOR_IDS.autohub, branch: "Kondapur depot", title: "Tyre 185/65 R15", partNumber: "TY-1856515", onHand: 64, reorderLevel: 40 },
  { id: "bs-5", vendorId: VENDOR_IDS.autohub, branch: "Kondapur depot", title: "Clutch plate kit — Tata Ace", partNumber: "TA-CLT-220", onHand: 6, reorderLevel: 15 },
  { id: "bs-6", vendorId: VENDOR_IDS.autohub, branch: "Kondapur depot", title: "Brake shoe set — Tata Ace", partNumber: "TA-BRS-110", onHand: 55, reorderLevel: 30 },
];
