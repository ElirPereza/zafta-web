"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  slug: string;
}

interface ProductGalleryProps {
  onOpenOrder: (product?: {
    id: string;
    name: string;
    price: number;
    image: string;
  }) => void;
}

const ProductGallery = ({ onOpenOrder }: ProductGalleryProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Get only featured products (max 6)
        const response = await fetch("/api/products?featured=true&limit=6");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section
      id="our-cakes"
      className="py-16 md:py-20 px-6 md:px-8 bg-gradient-to-b from-background via-primary/5 to-background"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-12 md:mb-16 text-center"
        >
          <h2 className="mb-6 text-4xl font-sans italic md:text-5xl text-foreground">
            Nuestras Creaciones – Hechas con Amor
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Hechas con cuidado, los mejores ingredientes y generaciones de amor.
            Cada bocado cuenta una historia.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-sans">Cargando productos...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-sans">
              No hay productos destacados disponibles.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Link href={`/productos/${product.slug}`}>
                  <Card className="group overflow-hidden border-border/50 shadow-soft transition-all duration-500 hover:shadow-warm hover:-translate-y-2 bg-card/95 backdrop-blur-sm rounded-2xl cursor-pointer">
                    <div className="aspect-square overflow-hidden relative rounded-t-2xl">
                      <Image
                        src={product.images[0] || "/zafta_assets/placeholder.webp"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        quality={80}
                      />
                      {/* Hover overlay con carrito */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <ShoppingCart className="w-12 h-12 text-background" />
                        </motion.div>
                        <span className="text-background font-sans font-medium text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Dale una probada
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="mb-3 text-xl md:text-2xl font-sans italic text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans">
                        {product.description || "Deliciosa creación artesanal"}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGallery;
