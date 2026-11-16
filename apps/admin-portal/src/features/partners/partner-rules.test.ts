import { canApprove } from "./partner-rules";

describe("partner approval", () => {
  it("is blocked while any document is unverified", () => {
    expect(canApprove({ documents: [{ label: "GST", verified: true }, { label: "Bank", verified: false }] })).toBe(false);
  });
  it("is allowed once all documents are verified", () => {
    expect(canApprove({ documents: [{ label: "GST", verified: true }] })).toBe(true);
  });
});
