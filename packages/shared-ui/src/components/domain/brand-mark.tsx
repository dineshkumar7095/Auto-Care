import { cn } from "../../lib/cn";

export const BRAND = { name: "Dono Auto Care", short: "Dono", monogram: "DA" } as const;

/** Logo lockup. Wrap it in your router's Link where it should navigate. */
export function BrandMark({ className, tone = "dark", suffix }: { className?: string; tone?: "dark" | "light"; suffix?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg font-display text-sm font-bold",
          tone === "dark" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
        )}
      >
        {BRAND.monogram}
      </span>
      <span className={cn("font-display text-lg font-semibold leading-none", tone === "dark" ? "text-primary" : "text-sidebar-accent-foreground")}>
        {BRAND.short}
        <span className="font-medium opacity-80"> Auto Care</span>
        {suffix && <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.18em] opacity-70">{suffix}</span>}
      </span>
    </span>
  );
}
