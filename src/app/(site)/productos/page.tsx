import { ProductGrid } from "@/components/products/ProductGrid";
import { prisma } from "@/lib/prisma";
import { motion } from "framer-motion";
import { generateMetadata as genMetadata } from "@/lib/metadata";

export const metadata = genMetadata({
  title: "Nuestras Delicias",
  description:
    "Descubre nuestra selección de tortas artesanales. Chocolate, frutas, personalizadas y más. Hechas con amor y los mejores ingredientes en Bogotá.",
  path: "/productos",
  keywords: [
    "comprar tortas",
    "tortas en línea",
    "pedidos tortas",
    "tortas a domicilio",
    "catálogo tortas",
  ],
});

export const dynamic = "force-dynamic"; // Forzar renderizado dinámico
export const revalidate = 60; // Revalidar cada 60 segundos

export default async function ProductosPage() {
  // Obtener productos de la base de datos
  const rawProducts = await prisma.product.findMany({
    where: {
      inStock: true, // Solo productos en stock
    },
    include: {
      sizes: {
        orderBy: { displayOrder: "asc" },
      },
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
    sizes: product.sizes.map((size) => ({
      ...size,
      price: Number(size.price),
    })),
  }));

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <section className="py-16 md:py-20 px-6 md:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="mb-6 text-5xl md:text-6xl text-foreground font-gotham">
              Nuestras Delicias
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-3xl mx-auto leading-relaxed">
              Descubre nuestra selección de tortas artesanales, hechas con amor
              y los mejores ingredientes. Cada bocado es una celebración.
            </p>
          </div>

          {/* Products Grid */}
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}
