import { ProductGrid } from "@/components/products/ProductGrid";
import { prisma } from "@/lib/prisma";
import { motion } from "framer-motion";

export const revalidate = 60; // Revalidar cada 60 segundos

export default async function ProductosPage() {
  // Obtener productos de la base de datos
  const rawProducts = await prisma.product.findMany({
    where: {
      inStock: true, // Solo productos en stock
    },
    orderBy: [
      { featured: "desc" }, // Destacados primero
      { createdAt: "desc" }, // Luego los más recientes
    ],
  });

  // Convertir Decimal a números para poder pasar a Client Component
  const products = rawProducts.map((product) => ({
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
  }));

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <section className="py-16 md:py-20 px-6 md:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="mb-6 text-5xl font-serif italic md:text-6xl text-foreground">
              Nuestras Delicias
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-3xl mx-auto leading-relaxed">
              Descubre nuestra selección de tortas artesanales, hechas con amor y
              los mejores ingredientes. Cada bocado es una celebración.
            </p>
          </div>

          {/* Products Grid */}
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}
