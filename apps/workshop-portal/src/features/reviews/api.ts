import { queryOptions } from "@tanstack/react-query";
import { api } from "@automotive/api-client";

export const myReviewsQuery = () => queryOptions({ queryKey: ["reviews", "vendor"], queryFn: () => api.reviews.listForVendor() });
