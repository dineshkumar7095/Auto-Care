import type { Offer, Paginated, Product } from "@automotive/shared-types";
import type { ProductInput } from "@automotive/validation";
import { request } from "../http";

export type ProductQuery = { q?: string; category?: string; verifiedOnly?: boolean; sort?: "fit" | "price-asc" | "price-desc" | "rating"; page?: number; pageSize?: number };

export const catalogueApi = {
  listProducts: (query: ProductQuery = {}) => request<Paginated<Product>>("GET", "/catalogue/products", { query }),
  getProduct: (id: string) => request<{ product: Product; offers: Offer[] }>("GET", `/catalogue/products/${encodeURIComponent(id)}`),
  listMyListings: () => request<Product[]>("GET", "/catalogue/vendor/products"),
  createListing: (input: ProductInput) => request<Product>("POST", "/catalogue/vendor/products", { body: input }),
};
