import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().default(4000),
  MONGODB_URI: z.string().min(1).default("mongodb://localhost:27017/automotive_marketplace"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("12h"),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
  OTP_DEV_CODE: z.string().regex(/^\d{6}$/).optional().or(z.literal("").transform(() => undefined)),
});

export type Env = z.infer<typeof schema>;

let cached: Env | null = null;
export function env(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
  }
  if (parsed.data.NODE_ENV === "production" && parsed.data.OTP_DEV_CODE) throw new Error("OTP_DEV_CODE must not be set in production");
  cached = parsed.data;
  return cached;
}
export const resetEnvCache = () => {
  cached = null;
};
