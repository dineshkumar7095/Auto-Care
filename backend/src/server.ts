import { createApp } from "./app";
import { env } from "./config/env";
import { connectDb } from "./db/connect";

async function main() {
  const config = env();
  await connectDb(config.MONGODB_URI);
  const server = createApp().listen(config.API_PORT, () => console.info(`API listening on http://localhost:${config.API_PORT}/api/v1`));
  const shutdown = () => server.close(() => process.exit(0));
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
