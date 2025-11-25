"use client";

import type { Product, ProductSize } from "@prisma/client";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";

// Tipo para tamaño con precio numérico
type SizeWithNumberPrice = Omit<ProductSize, "price"> & {
  price: number;
};

// Tipo más flexible que acepta tanto Decimal como number
type ProductWithNumberPrice = Omit<Product, "price" | "comparePrice"> & {
  price: number;
  comparePrice: number | null;
  sizes?: SizeWithNumberPrice[];
};

interface ProductGridProps {
  products: ProductWithNumberPrice[];
}

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(numPrice);
};

// Individual product card component to manage size selection state
function ProductCard({
  product,
  onAddToCart,
}: {
  product: ProductWithNumberPrice;
  onAddToCart: () => void;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const hasSizes = product.sizes && product.sizes.length > 0;

  // Initialize with first size or null
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(
    hasSizes ? product.sizes![0].id : null,
  );

  const selectedSize = hasSizes
    ? product.sizes!.find((s) => s.id === selectedSizeId)
    : null;

  const currentPrice = selectedSize ? selectedSize.price : product.price;

  const handleAddToCart = () => {
    const cartId = selectedSize
      ? `${product.id}-${selectedSize.id}`
      : product.id;

    addItem({
      id: cartId,
      productId: product.id,
      name: product.name,
      sizeName: selectedSize?.name,
      price: currentPrice,
      image: product.images[0] || "/placeholder.png",
      slug: product.slug,
    });
    onAddToCart();
  };

  return (
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
        {product.category && (
          <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-sans font-medium text-foreground">
              {product.category}
            </span>
          </div>
        )}

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
        <h3 className="mb-2 text-xl md:text-2xl font-sans text-foreground">
          {product.name}
        </h3>
        {product.description && (
          <p className="mb-4 text-base text-muted-foreground leading-relaxed font-sans line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Size Selector */}
        {hasSizes && (
          <div className="mb-4">
            <Select
              value={selectedSizeId || undefined}
              onValueChange={setSelectedSizeId}
            >
              <SelectTrigger className="w-full text-left">
                <SelectValue placeholder="Selecciona un tamaño" />
              </SelectTrigger>
              <SelectContent className="w-(--radix-select-trigger-width) max-w-full">
                {product.sizes!.map((size) => (
                  <SelectItem key={size.id} value={size.id} className="cursor-pointer">
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className="truncate">{size.name}</span>
                      <span className="font-semibold shrink-0">{formatPrice(size.price)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            {product.comparePrice && product.comparePrice > currentPrice && (
              <p className="text-sm text-muted-foreground font-sans line-through">
                {formatPrice(product.comparePrice)}
              </p>
            )}
            <p
              className="text-2xl md:text-3xl font-bold text-primary"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              {formatPrice(currentPrice)}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleAddToCart}
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
  );
}

export function ProductGrid({ products }: ProductGridProps) {
  const [cartOpen, setCartOpen] = useState(false);

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
            <ProductCard
              product={product}
              onAddToCart={() => setCartOpen(true)}
            />
          </motion.div>
        ))}
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
