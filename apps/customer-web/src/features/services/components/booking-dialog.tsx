import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@automotive/authentication";
import type { Workshop } from "@automotive/shared-types";
import { cn } from "@automotive/shared-ui/lib/cn";
import { Button } from "@automotive/shared-ui/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@automotive/shared-ui/ui/dialog";
import { Textarea } from "@automotive/shared-ui/ui/textarea";
import { defaultVehicle } from "@/features/vehicles/saved-vehicles";
import { useCreateBooking } from "../api";

const SLOTS = ["10:00 am", "11:30 am", "2:00 pm", "4:30 pm", "6:00 pm"];

export function BookingDialog({ workshop, service, onClose }: { workshop: Workshop | null; service: string; onClose: () => void }) {
  const auth = useAuth();
  const location = useLocation();
  const [slot, setSlot] = useState(SLOTS[2]!);
  const [issue, setIssue] = useState("");
  const book = useCreateBooking(onClose);
  return (
    <Dialog open={!!workshop} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book at {workshop?.name}</DialogTitle>
          <DialogDescription>Final price is confirmed after inspection. You approve any extra work first.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Pick a time today</p>
            <div className="flex flex-wrap gap-2">
              {SLOTS.map((s) => (
                <button key={s} onClick={() => setSlot(s)} className={cn("rounded-lg border px-3 py-1.5 text-sm", slot === s && "border-primary bg-primary text-primary-foreground")}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Describe the issue</p>
            <Textarea value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g. Squealing noise when braking, due for 30,000 km service" />
          </div>
        </div>
        <DialogFooter>
          {auth.isAuthenticated ? (
            <Button disabled={book.isPending} onClick={() => workshop && book.mutate({ workshopId: workshop.id, service, slot, vehicleLabel: defaultVehicle.label, issue: issue || undefined })}>
              Request booking
            </Button>
          ) : (
            <Button asChild><Link to="/login" search={{ redirect: location.href }}>Sign in to book</Link></Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
