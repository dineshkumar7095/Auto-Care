import type { AppNotification } from "@automotive/shared-types";
import { formatDate } from "@automotive/utilities";
import { Bell } from "lucide-react";
import { cn } from "../../lib/cn";

export function NotificationList({ items, onRead }: { items: AppNotification[]; onRead?: (id: string) => void }) {
  if (!items.length) return <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">You're all caught up.</p>;
  return (
    <ul className="divide-y rounded-xl border bg-card">
      {items.map((n) => (
        <li key={n.id}>
          <button type="button" onClick={() => !n.read && onRead?.(n.id)} className={cn("flex w-full gap-3 p-4 text-left", !n.read && "bg-info-soft")}>
            <Bell className={cn("mt-0.5 size-4 shrink-0", n.read ? "text-muted-foreground" : "text-accent")} />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{n.title}</span>
              <span className="block text-sm text-muted-foreground">{n.body}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{formatDate(n.createdAt)}{n.read ? "" : " · New"}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
