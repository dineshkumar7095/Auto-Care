import { Router } from "express";
import { reviewSchema } from "@automotive/validation";
import { z } from "zod";
import { currentUser, requireAuth, vendorIdOf } from "../../common/auth";
import { Workshop } from "../bookings/workshop.model";
import { Product } from "../catalogue/product.model";
import { conflict } from "../../common/http-error";
import { send } from "../../common/respond";
import { parsedQuery, validateBody, validateQuery } from "../../common/validate";
import { Order } from "../orders/order.model";
import { Review } from "./review.model";

export const reviewsRouter = Router();
const listQuery = z.object({ productId: z.string().min(1) });

reviewsRouter.get("/", validateQuery(listQuery), async (_req, res) => {
  const { productId } = parsedQuery(res, listQuery);
  send(res, (await Review.find({ productId }).sort({ createdAt: -1 }).limit(50)).map((r) => r.toJSON()));
});

/** Reviews of the signed-in vendor's parts and workshops. */
reviewsRouter.get("/vendor", requireAuth, async (req, res) => {
  const vendorId = vendorIdOf(req);
  const [products, workshops] = await Promise.all([Product.find({ vendorId }, { _id: 1 }).lean(), Workshop.find({ vendorId }, { _id: 1 }).lean()]);
  const ids = [...products, ...workshops].map((d) => String(d._id));
  send(res, (await Review.find({ productId: { $in: ids } }).sort({ createdAt: -1 }).limit(100)).map((r) => r.toJSON()));
});

/** One review per person per part. "Verified purchase" is decided here from delivered orders, never by the client. */
reviewsRouter.post("/", requireAuth, validateBody(reviewSchema), async (req, res) => {
  const u = currentUser(req);
  if (await Review.exists({ productId: req.body.productId, authorId: u.id })) throw conflict("already_reviewed", "You've already reviewed this part");
  const verifiedPurchase = !!(await Order.exists({ customerId: u.id, status: { $in: ["delivered", "return_requested", "returned"] }, "lines.productId": req.body.productId }));
  const r = await Review.create({ ...req.body, authorId: u.id, authorName: u.name, verifiedPurchase });
  send(res, r.toJSON(), 201);
});
