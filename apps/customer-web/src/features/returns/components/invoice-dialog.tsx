import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { Button } from "@automotive/shared-ui/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@automotive/shared-ui/ui/dialog";
import { formatDate, formatINR } from "@automotive/utilities";
import { invoiceQuery } from "../api";

export function InvoiceDialog({ orderId, orderNumber }: { orderId: string; orderNumber: string }) {
  const [open, setOpen] = useState(false);
  const inv = useQuery({ ...invoiceQuery(orderId), enabled: open });
  const d = inv.data;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="ghost" aria-label={`Invoice for ${orderNumber}`}><FileText /> Invoice</Button></DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Tax invoice</DialogTitle></DialogHeader>
        {!d ? <ListSkeleton rows={3} /> : (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-muted-foreground">Invoice</p><p className="font-semibold">{d.invoiceNumber}</p><p className="text-xs">{formatDate(d.issuedAt)} · {d.orderNumber}</p></div>
              <div className="text-right"><p className="text-xs text-muted-foreground">Sold by</p><p className="font-semibold">{d.sellerName}</p><p className="text-xs">{d.sellerState}</p></div>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="border-b text-muted-foreground"><tr><th className="py-1.5 font-medium">Item</th><th className="py-1.5 text-right font-medium">Taxable</th><th className="py-1.5 text-right font-medium">GST</th><th className="py-1.5 text-right font-medium">Total</th></tr></thead>
              <tbody className="divide-y">
                {d.lines.map((l) => (
                  <tr key={l.title}><td className="py-1.5">{l.quantity} × {l.title}</td><td className="py-1.5 text-right">{formatINR(l.taxablePaise, { decimals: true })}</td><td className="py-1.5 text-right">{l.gstRatePct}%</td><td className="py-1.5 text-right">{formatINR(l.totalPaise, { decimals: true })}</td></tr>
                ))}
              </tbody>
            </table>
            <dl className="space-y-1 border-t pt-3">
              <div className="flex justify-between"><dt>Taxable value</dt><dd>{formatINR(d.taxablePaise, { decimals: true })}</dd></div>
              {d.interState ? (
                <div className="flex justify-between"><dt>IGST</dt><dd>{formatINR(d.igstPaise, { decimals: true })}</dd></div>
              ) : (
                <>
                  <div className="flex justify-between"><dt>CGST</dt><dd>{formatINR(d.cgstPaise, { decimals: true })}</dd></div>
                  <div className="flex justify-between"><dt>SGST</dt><dd>{formatINR(d.sgstPaise, { decimals: true })}</dd></div>
                </>
              )}
              <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{formatINR(d.totalPaise, { decimals: true })}</dd></div>
            </dl>
            <Button variant="outline" className="w-full" onClick={() => window.print()}>Print or save as PDF</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
