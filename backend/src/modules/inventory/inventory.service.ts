import type { ClientSession } from "mongoose";
import { conflict } from "../../common/http-error";
import { Product } from "../catalogue/product.model";

/** Atomically reserve stock: succeeds only if enough units remain, so two buyers can't take the last unit. */
export async function reserveStock(productId: string, quantity: number, session?: ClientSession) {
  const updated = await Product.findOneAndUpdate({ _id: productId, stock: { $gte: quantity } }, { $inc: { stock: -quantity } }, { new: true, session });
  if (!updated) throw conflict("out_of_stock", "Not enough stock for one of the items");
  return updated;
}

export async function releaseStock(productId: string, quantity: number, session?: ClientSession) {
  await Product.updateOne({ _id: productId }, { $inc: { stock: quantity } }, { session });
}
