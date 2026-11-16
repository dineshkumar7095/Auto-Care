// Runs once when the Mongo container is first created.
// The app creates its own indexes on start-up (Mongoose autoIndex); this file adds the ones that matter
// most for production so they exist even if autoIndex is turned off.
db = db.getSiblingDB("automotive_marketplace");

db.users.createIndex({ phone: 1 }, { unique: true });
db.products.createIndex({ listingStatus: 1, category: 1 });
db.products.createIndex({ partNumber: 1 });
db.products.createIndex({ vendorId: 1 });
db.products.createIndex({ title: "text", brand: "text", partNumber: "text" });
db.orders.createIndex({ number: 1 }, { unique: true });
db.orders.createIndex({ vendorId: 1, status: 1, createdAt: -1 });
db.orders.createIndex({ customerId: 1, createdAt: -1 });
db.jobcards.createIndex({ workshopId: 1, stage: 1 });
db.towingtrips.createIndex({ providerId: 1, status: 1 });
db.otps.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
db.auditlogs.createIndex({ entityId: 1, createdAt: -1 });
