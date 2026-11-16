import { nextTripAction } from "./trip-rules";

describe("towing trip steps", () => {
  it("a new request is accepted first", () => expect(nextTripAction("requested")?.to).toBe("accepted"));
  it("arrived goes to pickup", () => expect(nextTripAction("arrived")?.to).toBe("picked_up"));
  it("completed trips have no next step", () => expect(nextTripAction("completed")).toBeNull());
});
