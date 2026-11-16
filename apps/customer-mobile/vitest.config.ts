import { defineConfig } from "vitest/config";

// Only pure logic is unit-tested here (no React Native imports); screens are checked on a device or emulator.
export default defineConfig({ test: { include: ["src/**/*.test.ts"] } });
