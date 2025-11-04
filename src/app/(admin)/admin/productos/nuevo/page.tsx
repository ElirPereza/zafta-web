import { ProductForm } from "@/components/admin/products/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/productos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-semibold text-foreground">
            Nuevo Producto
          </h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            Agrega un nuevo producto al catálogo
          </p>
        </div>
      </div>

      {/* Form */}
      <ProductForm />
    </div>
  );
}
