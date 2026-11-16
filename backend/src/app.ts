import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "./common/error-handler";
import { env } from "./config/env";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: env().CORS_ORIGINS.split(",").map((s) => s.trim()), credentials: true }));
  // Gateways sign the exact bytes they send, so the webhook gets the raw body.
  app.use("/api/v1/payments/webhook", express.text({ type: "*/*", limit: "1mb" }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, data: { status: "up" } });
  });
  app.use("/api/v1", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
