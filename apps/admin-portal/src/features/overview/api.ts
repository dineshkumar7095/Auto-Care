import { queryOptions } from "@tanstack/react-query";
import { api } from "@automotive/api-client";

export const overviewQuery = () => queryOptions({ queryKey: ["admin", "overview"], queryFn: () => api.admin.overview() });
