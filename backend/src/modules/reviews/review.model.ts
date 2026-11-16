import { Schema, model } from "mongoose";
import { idField, schemaOptions } from "../../db/schema";

const reviewSchema = new Schema(
  {
    ...idField,
    productId: { type: String, required: true, index: true },
    authorId: { type: String, required: true },
    authorName: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: false },
  },
  schemaOptions,
);
reviewSchema.index({ productId: 1, authorId: 1 }, { unique: true });
export const Review = model("Review", reviewSchema);
