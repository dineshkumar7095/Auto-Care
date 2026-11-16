import { describe, expect, it } from "vitest";
import { invoiceable, partRequests } from "./job-rules";

const job = (over: object) => ({ id: "j", number: "JC-1", registration: "TS 01", stage: "in_repair" as const, estimate: [], ...over });

describe("parts requests", () => {
  it("lists part lines only, and holds them while the customer hasn't approved", () => {
    const list = partRequests([
      job({ estimate: [{ label: "Clutch kit", kind: "part", amountPaise: 500000 }, { label: "Labour", kind: "labour", amountPaise: 100000 }] }),
      job({ id: "k", stage: "awaiting_approval", estimate: [{ label: "Brake pads", kind: "part", amountPaise: 200000 }] }),
      job({ id: "z", stage: "ready", estimate: [{ label: "Filter", kind: "part", amountPaise: 30000 }] }),
    ]);
    expect(list.map((p) => [p.label, p.approved])).toEqual([["Clutch kit", true], ["Brake pads", false]]);
  });
});

describe("invoices", () => {
  it("only ready or delivered jobs, without unapproved lines", () => {
    const out = invoiceable([
      job({ stage: "ready", estimate: [{ label: "Service", kind: "labour", amountPaise: 118000 }, { label: "Extra", kind: "part", amountPaise: 50000, approved: false }] }),
      job({ stage: "in_repair", estimate: [{ label: "Service", kind: "labour", amountPaise: 118000 }] }),
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]!.totalPaise).toBe(118000);
    expect(out[0]!.gstPaise).toBe(18000);
  });
});
