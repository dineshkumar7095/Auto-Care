import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { createApp } from "../src/app";
import { connectDb, disconnectDb } from "../src/db/connect";
import { seedDatabase } from "../src/seed/seed-data";

let mongo: MongoMemoryServer;
export const app = createApp();

export async function startDb() {
  mongo = await MongoMemoryServer.create();
  await connectDb(mongo.getUri());
  await seedDatabase();
}
export async function stopDb() {
  await disconnectDb();
  await mongo?.stop();
}

export async function signIn(phone: string, portal: string) {
  await request(app).post("/api/v1/auth/otp/request").send({ phone }).expect(200);
  const res = await request(app).post("/api/v1/auth/otp/verify").send({ phone, code: "123456", portal });
  return { status: res.status, token: res.body.data?.accessToken as string | undefined, body: res.body };
}
