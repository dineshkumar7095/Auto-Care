import { Router } from "express";
import { adminRouter } from "./modules/admin/admin.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { bookingsRouter } from "./modules/bookings/bookings.routes";
import { catalogueRouter } from "./modules/catalogue/catalogue.routes";
import { fleetRouter } from "./modules/fleet/fleet.routes";
import { inventoryRouter } from "./modules/inventory/inventory.routes";
import { ordersRouter } from "./modules/orders/orders.routes";
import { paymentsRouter } from "./modules/payments/payments.routes";
import { towingRouter } from "./modules/towing/towing.routes";
import { usersRouter } from "./modules/users/users.routes";
import { vehiclesRouter } from "./modules/vehicles/vehicles.routes";
import { notificationsRouter } from "./modules/notifications/notifications.routes";
import { payoutsRouter } from "./modules/payouts/payouts.routes";
import { returnsRouter } from "./modules/returns/returns.routes";
import { reviewsRouter } from "./modules/reviews/reviews.routes";
import { tradeRouter } from "./modules/trade/trade.routes";
import { settingsRouter, supportRouter, teamRouter } from "./modules/workspace/workspace.routes";
import { vendorsRouter } from "./modules/vendors/vendors.routes";

/** Every module mounts under /api/v1/<module>. Paths match packages/api-client. */
export const apiRouter = Router()
  .use("/auth", authRouter)
  .use("/users", usersRouter)
  .use("/vendors", vendorsRouter)
  .use("/vehicles", vehiclesRouter)
  .use("/catalogue", catalogueRouter)
  .use("/inventory", inventoryRouter)
  .use("/orders", ordersRouter)
  .use("/payments", paymentsRouter)
  .use("/bookings", bookingsRouter)
  .use("/towing", towingRouter)
  .use("/fleet", fleetRouter)
  .use("/trade", tradeRouter)
  .use("/reviews", reviewsRouter)
  .use("/returns", returnsRouter)
  .use("/payouts", payoutsRouter)
  .use("/notifications", notificationsRouter)
  .use("/team", teamRouter)
  .use("/settings", settingsRouter)
  .use("/support", supportRouter)
  .use("/admin", adminRouter);
