import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, Star } from "lucide-react";
import { useAuth } from "@automotive/authentication";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { Button } from "@automotive/shared-ui/ui/button";
import { Textarea } from "@automotive/shared-ui/ui/textarea";
import { cn } from "@automotive/shared-ui/lib/cn";
import { formatDate } from "@automotive/utilities";
import { reviewSchema } from "@automotive/validation";
import { reviewsQuery, useCreateReview } from "../api";

export function ReviewsSection({ productId }: { productId: string }) {
  const auth = useAuth();
  const reviews = useQuery(reviewsQuery(productId));
  const create = useCreateReview(productId);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const mine = reviews.data?.some((r) => r.authorId === auth.user?.id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reviewSchema.safeParse({ productId, rating, text });
    if (!parsed.success) return setError(rating ? parsed.error.issues[0]?.message ?? "Check your review" : "Pick a star rating");
    setError(null);
    create.mutate({ rating, text }, { onSuccess: () => { setText(""); setRating(0); } });
  };

  return (
    <section className="mt-10">
      <h2 className="mb-1 text-xl font-semibold">Reviews</h2>
      <p className="mb-4 text-sm text-muted-foreground">"Verified purchase" means the reviewer received this part through Dono Auto Care.</p>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          {reviews.isPending ? <ListSkeleton rows={2} /> : reviews.data?.length ? (
            <ul className="divide-y rounded-xl border bg-card">
              {reviews.data.map((r) => (
                <li key={r.id} className="p-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="flex" aria-label={`${r.rating} out of 5`}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} className={cn("size-4", i <= r.rating ? "fill-warning text-warning" : "text-muted-foreground")} />)}</span>
                    <b>{r.authorName}</b>
                    {r.verifiedPurchase && <span className="flex items-center gap-1 text-xs font-medium text-success"><BadgeCheck className="size-3.5" /> Verified purchase</span>}
                    <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm">{r.text}</p>
                </li>
              ))}
            </ul>
          ) : <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No reviews yet. Be the first.</p>}
        </div>
        <div className="surface h-fit p-4">
          {!auth.isAuthenticated ? (
            <p className="text-sm"><Link to="/login" search={{ redirect: `/parts/${productId}` }} className="font-semibold text-accent underline">Sign in</Link> to write a review.</p>
          ) : mine ? (
            <p className="text-sm text-muted-foreground">You've reviewed this part. Thank you!</p>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <p className="font-semibold">Write a review</p>
              <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} type="button" role="radio" aria-checked={rating === i} aria-label={`${i} star${i > 1 ? "s" : ""}`} onClick={() => setRating(i)} className="p-0.5">
                    <Star className={cn("size-6", i <= rating ? "fill-warning text-warning" : "text-muted-foreground")} />
                  </button>
                ))}
              </div>
              <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="How was the fit and quality?" rows={4} maxLength={1000} aria-label="Your review" />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={create.isPending}>Post review</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
