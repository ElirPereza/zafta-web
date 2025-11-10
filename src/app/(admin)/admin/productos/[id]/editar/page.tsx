import { ProductForm } from "@/components/admin/products/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

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
            Editar Producto
          </h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            Actualiza la información del producto
          </p>
        </div>
      </div>

      {/* Form */}
      <ProductForm product={product} />
    </div>
  );
}
