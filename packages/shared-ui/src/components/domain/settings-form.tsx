import { useEffect, useState, type FormEvent } from "react";
import type { SettingValue } from "@automotive/shared-types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

export type SettingField =
  | { key: string; label: string; help?: string; type: "text" | "textarea"; default: string }
  | { key: string; label: string; help?: string; type: "number"; default: number; min?: number; max?: number; suffix?: string }
  | { key: string; label: string; help?: string; type: "switch"; default: boolean };
export type SettingSection = { title: string; fields: SettingField[] };

/** Merges saved values over each field's default so new fields show sensible values. */
export const withDefaults = (sections: SettingSection[], saved: Record<string, SettingValue>) =>
  Object.fromEntries(sections.flatMap((s) => s.fields).map((f) => [f.key, saved[f.key] ?? f.default])) as Record<string, SettingValue>;

/** Generic business settings form; each portal supplies its own sections. */
export function SettingsForm({ sections, saved, saving = false, readOnly = false, onSave }: { sections: SettingSection[]; saved: Record<string, SettingValue>; saving?: boolean; readOnly?: boolean; onSave: (values: Record<string, SettingValue>) => void }) {
  const [values, setValues] = useState(() => withDefaults(sections, saved));
  useEffect(() => setValues(withDefaults(sections, saved)), [sections, saved]);
  const set = (k: string, v: SettingValue) => setValues((prev) => ({ ...prev, [k]: v }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave(values);
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      {sections.map((s) => (
        <fieldset key={s.title} disabled={readOnly} className="surface space-y-4 p-4 sm:p-5">
          <legend className="sr-only">{s.title}</legend>
          <h2 className="font-display text-base font-semibold">{s.title}</h2>
          {s.fields.map((f) => {
            const id = `set-${f.key}`;
            if (f.type === "switch")
              return (
                <div key={f.key} className="flex items-start justify-between gap-4">
                  <div className="min-w-0"><Label htmlFor={id}>{f.label}</Label>{f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}</div>
                  <Switch id={id} checked={Boolean(values[f.key])} onCheckedChange={(v) => set(f.key, v)} />
                </div>
              );
            return (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={id}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea id={id} value={String(values[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)} />
                ) : f.type === "number" ? (
                  <div className="flex items-center gap-2">
                    <Input id={id} type="number" className="max-w-40" min={f.min} max={f.max} value={Number(values[f.key] ?? 0)} onChange={(e) => set(f.key, e.target.valueAsNumber || 0)} />
                    {f.suffix && <span className="text-sm text-muted-foreground">{f.suffix}</span>}
                  </div>
                ) : (
                  <Input id={id} value={String(values[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)} />
                )}
                {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
              </div>
            );
          })}
        </fieldset>
      ))}
      {!readOnly && <div className="flex justify-end"><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button></div>}
    </form>
  );
}
