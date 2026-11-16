import type { Product } from "@automotive/shared-types";
import { FitmentBadge } from "@automotive/shared-ui/domain/fitment-badge";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@automotive/shared-ui/ui/table";
import { formatINR } from "@automotive/utilities";
import { isLowStock, listingStatus } from "../listing-status";

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <div className="surface overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="hidden lg:table-cell">Fitment</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <p className="font-semibold">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.brand} · {p.partNumber}</p>
              </TableCell>
              <TableCell className="hidden lg:table-cell"><FitmentBadge fitment={p.fitment} /></TableCell>
              <TableCell className="font-semibold">{formatINR(p.pricePaise)}</TableCell>
              <TableCell className={isLowStock(p) ? "font-semibold text-destructive" : ""}>{p.stock}</TableCell>
              <TableCell><StatusBadge {...listingStatus[p.listingStatus]} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
