import { queryOptions } from "@tanstack/react-query";
import { api, type ProductQuery } from "@automotive/api-client";

export const productsQuery = (q: ProductQuery) => queryOptions({ queryKey: ["products", q], queryFn: () => api.catalogue.listProducts(q) });
export const productQuery = (id: string) => queryOptions({ queryKey: ["product", id], queryFn: () => api.catalogue.getProduct(id) });
