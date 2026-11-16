import { useState, type FormEvent, type ReactNode } from "react";
import { PART_CATEGORIES, PART_CLASSES, type PartCategory, type PartClass } from "@automotive/shared-types";
import { Button } from "@automotive/shared-ui/ui/button";
import { Input } from "@automotive/shared-ui/ui/input";
import { Label } from "@automotive/shared-ui/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@automotive/shared-ui/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@automotive/shared-ui/ui/sheet";
import { rupeesToPaise } from "@automotive/utilities";
import { productInputSchema } from "@automotive/validation";
import { useCreateListing } from "../api";

export function AddProductSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const create = useCreateListing(() => onOpenChange(false));
  const [category, setCategory] = useState<PartCategory>("Brakes");
  const [partClass, setPartClass] = useState<PartClass>("Aftermarket");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const parsed = productInputSchema.safeParse({
      title: f.get("title"),
      brand: f.get("brand"),
      partNumber: f.get("partNumber"),
      category,
      partClass,
      pricePaise: rupeesToPaise(Number(f.get("price"))),
      mrpPaise: rupeesToPaise(Number(f.get("mrp"))),
      stock: Number(f.get("stock")),
      proofDocumentUrl: (f.get("proof") as string) || undefined,
    });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Check the form");
    setError(null);
    create.mutate(parsed.data);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <form onSubmit={submit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>Add product</SheetTitle>
            <SheetDescription>New listings are reviewed before going live. OEM claims need a proof document.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4">
            <Field label="Product name"><Input name="title" required placeholder="Front Disc Brake Pad Set" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Brand"><Input name="brand" required placeholder="Bosch" /></Field>
              <Field label="Part number"><Input name="partNumber" required placeholder="0986AB1234" /></Field>
            </div>
            <Field label="Category">
              <Select value={category} onValueChange={(v) => setCategory(v as PartCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PART_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Part type">
              <Select value={partClass} onValueChange={(v) => setPartClass(v as PartClass)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PART_CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            {partClass === "OEM" && <Field label="Proof document link"><Input name="proof" type="url" placeholder="https://…/oem-authorisation.pdf" /></Field>}
            <div className="grid grid-cols-3 gap-3">
              <Field label="Price (₹)"><Input name="price" type="number" min={1} required /></Field>
              <Field label="MRP (₹)"><Input name="mrp" type="number" min={1} required /></Field>
              <Field label="Stock"><Input name="stock" type="number" min={0} required /></Field>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <SheetFooter>
            <Button type="submit" disabled={create.isPending}>{create.isPending ? "Submitting…" : "Submit for review"}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
