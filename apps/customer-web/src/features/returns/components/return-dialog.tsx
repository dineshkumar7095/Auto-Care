import { useState } from "react";
import { RETURN_REASONS, RETURN_REASON_LABEL, type Order, type ReturnReason } from "@automotive/shared-types";
import { Button } from "@automotive/shared-ui/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@automotive/shared-ui/ui/dialog";
import { Label } from "@automotive/shared-ui/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@automotive/shared-ui/ui/select";
import { Textarea } from "@automotive/shared-ui/ui/textarea";
import { RETURN_WINDOW_DAYS, formatINR } from "@automotive/utilities";
import { useRequestReturn } from "../api";

export function ReturnDialog({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReturnReason | "">("");
  const [note, setNote] = useState("");
  const request = useRequestReturn();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline">Return</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Return {order.number}</DialogTitle>
          <DialogDescription>Returns are accepted within {RETURN_WINDOW_DAYS} days of delivery. Refund of {formatINR(order.totals.totalPaise)} goes back to your original payment method.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Select value={reason} onValueChange={(v) => setReason(v as ReturnReason)}>
              <SelectTrigger id="reason"><SelectValue placeholder="Choose a reason" /></SelectTrigger>
              <SelectContent>{RETURN_REASONS.map((r) => <SelectItem key={r} value={r}>{RETURN_REASON_LABEL[r]}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="note">Anything else? (optional)</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={!reason || request.isPending} onClick={() => reason && request.mutate({ orderId: order.id, reason, note }, { onSuccess: () => setOpen(false) })}>Request return</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
