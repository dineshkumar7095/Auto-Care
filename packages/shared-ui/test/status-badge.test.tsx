import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../src/components/domain/status-badge";
import { FitmentBadge } from "../src/components/domain/fitment-badge";

describe("shared domain components", () => {
  it("renders a status label", () => {
    render(<StatusBadge label="Awaiting approval" tone="warning" />);
    expect(screen.getByText("Awaiting approval")).toBeTruthy();
  });
  it("never shows 'Verified fit' for unverified parts", () => {
    render(<FitmentBadge fitment="not-verified" />);
    expect(screen.queryByText("Verified fit")).toBeNull();
    expect(screen.getByText("Fit not verified")).toBeTruthy();
  });
});
