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
        // Try to get featured products first
        let response = await fetch("/api/products?featured=true&limit=6");
        if (response.ok) {
          const data = await response.json();
          // If no featured products, get all products (for now)
          if (data.products && data.products.length === 0) {
            response = await fetch("/api/products?limit=6");
            if (response.ok) {
              const allData = await response.json();
              setProducts(allData.products || []);
            }
          } else {
            setProducts(data.products || []);
          }
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
      className="relative py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8"
    >
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-8 md:mb-12 lg:mb-16 text-center px-2"
        >
          <h2 className="mb-4 md:mb-6 text-3xl sm:text-4xl md:text-5xl italic text-foreground">
            Nuestros Productos de Línea
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed px-4">
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
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                <Link href="/productos">
                  <Card className="group overflow-hidden border-border/50 shadow-soft transition-all duration-500 hover:shadow-warm hover:-translate-y-2 bg-card/95 backdrop-blur-sm rounded-xl md:rounded-2xl cursor-pointer">
                    <div className="aspect-square overflow-hidden relative rounded-t-xl md:rounded-t-2xl">
                      <Image
                        src={product.images[0] || "/zafta_assets/placeholder.webp"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        quality={80}
                        priority={index < 3}
                      />
                      {/* Hover overlay con carrito - Hidden on touch devices */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-300 hidden sm:flex flex-col items-center justify-center gap-3">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-background" />
                        </motion.div>
                        <span className="text-background font-sans font-medium text-base md:text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Dale una probada
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 md:p-8">
                      <h3 className="mb-2 md:mb-3 text-lg sm:text-xl md:text-2xl font-sans italic text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed font-sans line-clamp-2">
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
