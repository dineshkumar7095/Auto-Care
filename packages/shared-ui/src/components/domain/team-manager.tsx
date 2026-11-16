import { useState, type FormEvent } from "react";
import type { TeamMember } from "@automotive/shared-types";
import { formatDate, initials, maskPhone } from "@automotive/utilities";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { StatusBadge } from "./status-badge";

export type NewTeamMember = { name: string; phone: string; title: string };

/** Team list with add + activate/deactivate. Used for seller staff, distributor sales team and workshop technicians. */
export function TeamManager({
  members,
  noun = "team member",
  titlePlaceholder = "e.g. Store manager",
  canManage = true,
  saving = false,
  onAdd,
  onToggle,
}: {
  members: TeamMember[];
  noun?: string;
  titlePlaceholder?: string;
  canManage?: boolean;
  saving?: boolean;
  onAdd: (m: NewTeamMember) => Promise<unknown>;
  onToggle: (id: string, active: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<NewTeamMember>({ name: "", phone: "", title: "" });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await onAdd(form);
      setForm({ name: "", phone: "", title: "" });
      setOpen(false);
    } catch {
      /* the caller shows the error */
    }
  };
  const active = members.filter((m) => m.active).length;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{active} active · {members.length - active} inactive</p>
        {canManage && <Button size="sm" onClick={() => setOpen(true)}><UserPlus className="size-4" /> Add {noun}</Button>}
      </div>
      <ul className="divide-y rounded-xl border bg-card">
        {members.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center gap-3 p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">{initials(m.name)}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{m.name}</p>
              <p className="truncate text-xs text-muted-foreground">{m.title} · {maskPhone(m.phone)} · since {formatDate(m.joinedAt)}</p>
            </div>
            <StatusBadge label={m.active ? "Active" : "Inactive"} tone={m.active ? "success" : "neutral"} />
            {canManage && <Switch aria-label={`${m.active ? "Deactivate" : "Activate"} ${m.name}`} checked={m.active} onCheckedChange={(v) => onToggle(m.id, v)} />}
          </li>
        ))}
        {!members.length && <li className="p-6 text-center text-sm text-muted-foreground">No {noun}s yet.</li>}
      </ul>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {noun}</DialogTitle>
            <DialogDescription>They sign in with this mobile number using a one-time code.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5"><Label htmlFor="tm-name">Name</Label><Input id="tm-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label htmlFor="tm-phone">Mobile number</Label><Input id="tm-phone" inputMode="tel" placeholder="98xxxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label htmlFor="tm-title">Job title</Label><Input id="tm-title" placeholder={titlePlaceholder} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <DialogFooter><Button type="submit" disabled={saving}>{saving ? "Adding…" : "Add"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
