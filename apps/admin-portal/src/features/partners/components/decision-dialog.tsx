import { useState } from "react";
import { vendorDecisionSchema } from "@automotive/validation";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@automotive/shared-ui/ui/alert-dialog";
import { Button } from "@automotive/shared-ui/ui/button";
import { Textarea } from "@automotive/shared-ui/ui/textarea";
import { useDecidePartner } from "../api";

export type PendingDecision = { id: string; name: string; decision: "approve" | "reject" } | null;

export function DecisionDialog({ pending, onClose }: { pending: PendingDecision; onClose: () => void }) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const decide = useDecidePartner(() => {
    setNote("");
    onClose();
  });
  const confirm = () => {
    if (!pending) return;
    const parsed = vendorDecisionSchema.safeParse({ decision: pending.decision, note: note || undefined });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Check the note");
    setError(null);
    decide.mutate({ id: pending.id, ...parsed.data });
  };
  return (
    <AlertDialog open={!!pending} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{pending?.decision === "approve" ? "Approve" : "Reject"} {pending?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            {pending?.decision === "approve" ? "They can start trading straight away." : "They'll see your reason and can re-apply."} This is recorded in the audit log.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note for the audit log (required when rejecting)" />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={confirm} disabled={decide.isPending}>Confirm</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
