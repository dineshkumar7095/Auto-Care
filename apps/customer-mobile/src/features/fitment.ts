import { FITMENT_LABEL, type Fitment } from "@automotive/shared-types";
import type { Tone } from "@automotive/mobile-kit/tone";

/** Same wording as the website's fitment badge. Never imply a fit we haven't verified. */
const TONE: Record<Fitment, Tone> = { verified: "success", "seller-confirmed": "info", possible: "warning", "not-verified": "neutral" };
export const fitmentBadge = (f: Fitment) => ({ label: FITMENT_LABEL[f], tone: TONE[f] });
