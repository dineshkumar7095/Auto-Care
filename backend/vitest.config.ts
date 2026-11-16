import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 60_000,
    hookTimeout: 180_000,
    fileParallelism: false,
    env: { NODE_ENV: "test", JWT_SECRET: "test-secret-test-secret-test-secret-1234", OTP_DEV_CODE: "123456", MONGODB_URI: "mongodb://unused" },
  },
});
