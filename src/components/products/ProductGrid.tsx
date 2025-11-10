"use client";

import type { Product } from "@prisma/client";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";

// Tipo más flexible que acepta tanto Decimal como number
type ProductWithNumberPrice = Omit<Product, "price" | "comparePrice"> & {
  price: number;
  comparePrice: number | null;
};

interface ProductGridProps {
  products: ProductWithNumberPrice[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: ProductWithNumberPrice) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price, // Ya es number
      image: product.images[0] || "/placeholder.png",
      slug: product.slug,
    });
    setCartOpen(true);
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-beige-400 rounded-lg bg-beige-50">
        <h3 className="text-lg font-sans font-semibold text-foreground mb-2">
          No hay productos disponibles
        </h3>
        <p className="text-sm text-muted-foreground font-sans">
          Pronto tendremos más delicias para ti
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <Card className="group overflow-hidden border-border/50 shadow-soft transition-all duration-500 hover:shadow-warm hover:-translate-y-2 bg-card/95 backdrop-blur-sm rounded-2xl">
              {/* Image */}
              <div className="aspect-square overflow-hidden relative rounded-t-2xl">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    quality={80}
                  />
                ) : (
                  <div className="w-full h-full bg-beige-100 flex items-center justify-center">
                    <ShoppingCart className="h-16 w-16 text-beige-400" />
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-sans font-medium text-foreground">
                    {product.category}
                  </span>
                </div>

                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-sans font-medium text-primary-foreground">
                      Destacado
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 text-xl md:text-2xl font-sans italic text-foreground">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="mb-4 text-base text-muted-foreground leading-relaxed font-sans line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Price & Button */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div>
                    {product.comparePrice &&
                      product.comparePrice > product.price && (
                        <p className="text-sm text-muted-foreground font-sans line-through">
                          {formatPrice(product.comparePrice)}
                        </p>
                      )}
                    <p className="text-2xl md:text-3xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="gap-2 shadow-warm hover:shadow-medium transition-all duration-300"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.inStock ? "Agregar" : "Agotado"}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
