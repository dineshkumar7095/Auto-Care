import { env } from "../config/env";
import { connectDb, disconnectDb } from "../db/connect";
import { seedDatabase } from "./seed-data";

if (env().NODE_ENV === "production") throw new Error("Refusing to seed a production database");
await connectDb(env().MONGODB_URI);
await seedDatabase();
console.info("Seeded sample data. Demo OTP: use OTP_DEV_CODE from .env. Demo numbers: +919800000001 (customer) … +919800000007 (fleet).");
await disconnectDb();
