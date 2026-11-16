import type { CreditAccount, PriceList, Rfq } from "@automotive/shared-types";
import { request } from "../http";

export const tradeApi = {
  listRfqs: () => request<Rfq[]>("GET", "/trade/rfqs"),
  quoteRfq: (id: string, totalPaise: number) => request<Rfq>("POST", `/trade/rfqs/${id}/quote`, { body: { totalPaise } }),
  listPriceLists: () => request<PriceList[]>("GET", "/trade/price-lists"),
  togglePriceList: (id: string, active: boolean) => request<PriceList>("PATCH", `/trade/price-lists/${id}`, { body: { active } }),
  listCredit: () => request<CreditAccount[]>("GET", "/trade/credit"),
};
