import { estimateTotals, primaryNext } from "./job-rules";

describe("job card rules", () => {
  it("a diagnosed job goes to customer approval before repair", () => expect(primaryNext("diagnosis")).toBe("awaiting_approval"));
  it("a ready vehicle can only be delivered", () => expect(primaryNext("ready")).toBe("delivered"));
  it("totals an estimate with GST included", () => {
    expect(estimateTotals([{ label: "Labour", kind: "labour", amountPaise: 118000 }])).toEqual({ totalPaise: 118000, gstPaise: 18000 });
  });
});
