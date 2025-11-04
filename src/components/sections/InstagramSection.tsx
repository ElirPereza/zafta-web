"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstagramSectionProps {
  onOpenOrder: () => void;
}

const instagramPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    alt: "Delicious chocolate cake with berries",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1588195538326-c5aeb790a8c3?w=400&h=400&fit=crop",
    alt: "Vanilla cake with cream frosting",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop",
    alt: "Red velvet cake slice",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=400&fit=crop",
    alt: "Lemon cake with fresh lemons",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop",
    alt: "Carrot cake with cream cheese frosting",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=400&fit=crop",
    alt: "Traditional birthday cake",
  },
];

const InstagramSection = ({ onOpenOrder }: InstagramSectionProps) => {
  return (
    <section id="instagram" className="py-16 md:py-20 px-6 md:px-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12 md:mb-14"
        >
          <h2 className="mb-4 text-4xl font-serif italic md:text-5xl text-foreground">
            Desde Nuestro Instagram
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Descubre nuestros momentos más dulces y creaciones.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href="https://instagram.com/zafta_reposteria"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-card hover:shadow-medium transition-all duration-300"
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                <Instagram className="w-10 h-10 text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-background font-sans font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Ver en Instagram
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="text-center"
        >
          <Button
            variant="default"
            size="lg"
            onClick={onOpenOrder}
            className="shadow-warm hover:shadow-medium transition-all duration-300"
          >
            Haz tu pedido personalizado
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramSection;
