import { Router } from "express";
import type { SortOrder } from "mongoose";
import { productInputSchema, productQuerySchema } from "@automotive/validation";
import { currentUser, requireAuth, requirePermission, vendorIdOf } from "../../common/auth";
import { notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { parsedQuery, validateBody, validateQuery } from "../../common/validate";
import { Vendor } from "../vendors/vendor.model";
import { Product } from "./product.model";

export const catalogueRouter = Router();

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const FIT_ORDER = ["verified", "seller-confirmed", "possible", "not-verified"];
const SORTS: Record<string, Record<string, SortOrder>> = { "price-asc": { pricePaise: 1 }, "price-desc": { pricePaise: -1 }, rating: { rating: -1 } };

catalogueRouter.get("/products", validateQuery(productQuerySchema), async (_req, res) => {
  const q = parsedQuery(res, productQuerySchema);
  const filter: Record<string, unknown> = { listingStatus: "live" };
  if (q.category) filter["category"] = q.category;
  if (q.verifiedOnly) filter["fitment"] = "verified";
  if (q.q) {
    const rx = new RegExp(escape(q.q), "i");
    filter["$or"] = [{ title: rx }, { brand: rx }, { partNumber: rx }, { category: rx }];
  }
  const [docs, total] = await Promise.all([
    Product.find(filter).sort(SORTS[q.sort] ?? { rating: -1 }).skip((q.page - 1) * q.pageSize).limit(q.pageSize),
    Product.countDocuments(filter),
  ]);
  let items = docs.map((d) => d.toJSON());
  if (q.sort === "fit") items = items.sort((a, b) => FIT_ORDER.indexOf(a.fitment) - FIT_ORDER.indexOf(b.fitment));
  send(res, { items, total, page: q.page, pageSize: q.pageSize });
});

catalogueRouter.get("/products/:id", async (req, res) => {
  const product = await Product.findOne({ _id: req.params["id"], listingStatus: "live" });
  if (!product) throw notFound("Product");
  // Offers: the same part number listed live by other vendors.
  const others = await Product.find({ partNumber: product.partNumber, _id: { $ne: product._id }, listingStatus: "live" }).limit(10);
  const offers = others.map((o) => ({ vendorId: o.vendorId, sellerName: o.sellerName, pricePaise: o.pricePaise, delivery: o.delivery, rating: o.rating, verified: o.sellerVerified }));
  send(res, { product: product.toJSON(), offers });
});

catalogueRouter.get("/vendor/products", requireAuth, async (req, res) => {
  send(res, (await Product.find({ vendorId: vendorIdOf(req) }).sort({ createdAt: -1 })).map((p) => p.toJSON()));
});

catalogueRouter.post("/vendor/products", requireAuth, requirePermission("catalogue:write"), validateBody(productInputSchema), async (req, res) => {
  const vendorId = vendorIdOf(req);
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) throw notFound("Business");
  const p = await Product.create({
    ...req.body,
    vendorId,
    sellerName: vendor.name,
    sellerCity: vendor.city,
    sellerVerified: vendor.status === "approved",
    listingStatus: "pending_review", // every new listing is reviewed before going live
  });
  void currentUser(req);
  send(res, p.toJSON(), 201);
});
