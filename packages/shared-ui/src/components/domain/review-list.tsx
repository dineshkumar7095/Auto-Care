import type { Review } from "@automotive/shared-types";
import { formatDate } from "@automotive/utilities";
import { Star } from "lucide-react";
import { cn } from "../../lib/cn";
import { StatusBadge } from "./status-badge";

export function ReviewList({ reviews, subjectName }: { reviews: Review[]; subjectName?: (r: Review) => string | undefined }) {
  if (!reviews.length) return <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No reviews yet.</p>;
  return (
    <ul className="divide-y rounded-xl border bg-card">
      {reviews.map((r) => (
        <li key={r.id} className="space-y-1.5 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex" aria-label={`${r.rating} out of 5`}>
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className={cn("size-4", i <= r.rating ? "fill-warning text-warning" : "text-muted-foreground/40")} />)}
            </span>
            <span className="text-sm font-semibold">{r.authorName}</span>
            {r.verifiedPurchase && <StatusBadge label="Verified" tone="success" />}
            <span className="ml-auto text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
          </div>
          {subjectName?.(r) && <p className="text-xs text-muted-foreground">{subjectName(r)}</p>}
          <p className="text-sm">{r.text}</p>
        </li>
      ))}
    </ul>
  );
}
