import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-gotham font-bold text-[hsl(var(--midnight-navy))] mb-2">
            Productos
          </h1>
          <p className="text-[hsl(var(--midnight-navy))]/70 font-sans text-base">
            Gestiona el catálogo de productos de ZAFTA
          </p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button className="gap-2 bg-[hsl(var(--burgundy))] hover:bg-[hsl(var(--burgundy))]/90 text-white shadow-lg hover:shadow-xl transition-all">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* Products Table */}
      <ProductsTable />
    </div>
  );
}
