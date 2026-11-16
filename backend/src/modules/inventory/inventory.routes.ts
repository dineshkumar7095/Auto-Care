import { Router } from "express";
import { z } from "zod";
import { requireAuth, requirePermission, vendorIdOf } from "../../common/auth";
import { notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { validateBody } from "../../common/validate";
import { branchStockSchema } from "@automotive/validation";
import { Product } from "../catalogue/product.model";
import { BranchStock } from "../workspace/workspace.model";

export const inventoryRouter = Router();
const adjustSchema = z.object({ stock: z.number().int().min(0) });

/** Distributor stock per branch/warehouse. Declared before /:productId so "branches" isn't read as a product id. */
inventoryRouter.get("/branches", requireAuth, async (req, res) => {
  send(res, (await BranchStock.find({ vendorId: vendorIdOf(req) }).sort({ branch: 1, title: 1 })).map((b) => b.toJSON()));
});
inventoryRouter.patch("/branches/:id", requireAuth, requirePermission("catalogue:write"), validateBody(branchStockSchema), async (req, res) => {
  const b = await BranchStock.findOneAndUpdate({ _id: req.params["id"], vendorId: vendorIdOf(req) }, { onHand: req.body.onHand }, { new: true });
  if (!b) throw notFound("Stock line");
  send(res, b.toJSON());
});

inventoryRouter.patch("/:productId", requireAuth, requirePermission("catalogue:write"), validateBody(adjustSchema), async (req, res) => {
  const p = await Product.findOneAndUpdate({ _id: req.params["productId"], vendorId: vendorIdOf(req) }, { stock: req.body.stock }, { new: true });
  if (!p) throw notFound("Product");
  send(res, p.toJSON());
});
