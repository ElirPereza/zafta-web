"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

const products = [
  {
    name: "Torta de Chocolate",
    description: "Chocolate belga premium, textura húmeda y cremosa.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
  },
  {
    name: "Torta de Vainilla",
    description: "Suave, esponjosa y con vainilla natural.",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
  },
  {
    name: "Torta Tradicional",
    description: "Receta original de Fanny, con el sabor de siempre.",
    image:
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80",
  },
  {
    name: "Torta de Zanahoria",
    description: "Con nueces y especias, glaseado de queso crema.",
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80",
  },
  {
    name: "Torta Red Velvet",
    description: "Capas de terciopelo rojo con frosting de queso.",
    image:
      "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80",
  },
  {
    name: "Torta de Limón",
    description: "Fresca y cítrica, perfecta para cualquier ocasión.",
    image:
      "https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=800&q=80",
  },
];

interface ProductGalleryProps {
  onOpenOrder: (product?: {
    id: string;
    name: string;
    price: number;
    image: string;
  }) => void;
}

const ProductGallery = ({ onOpenOrder }: ProductGalleryProps) => {
  return (
    <section
      id="our-cakes"
      className="py-16 md:py-20 px-6 md:px-8 bg-gradient-to-b from-background via-secondary/10 to-background"
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
          <h2 className="mb-6 text-4xl font-serif italic md:text-5xl text-foreground">
            Nuestras Creaciones – Hechas con Amor
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Hechas con cuidado, los mejores ingredientes y generaciones de amor.
            Cada bocado cuenta una historia.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              key={index}
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
                <Card className="group overflow-hidden border-border/50 shadow-soft transition-all duration-500 hover:shadow-warm hover:-translate-y-2 bg-card/95 backdrop-blur-sm rounded-2xl cursor-pointer">
                  <div className="aspect-square overflow-hidden relative rounded-t-2xl">
                    <Image
                      src={product.image}
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
                    <h3 className="mb-3 text-xl md:text-2xl font-serif italic text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans">
                      {product.description}
                    </p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGallery;
