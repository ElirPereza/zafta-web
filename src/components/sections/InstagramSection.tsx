"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface InstagramSectionProps {
  onOpenOrder?: () => void;
}

const instagramPosts = [
  {
    id: 1,
    image: "/especiales/especiales-1.jpeg",
    alt: "Torta personalizada ZAFTA - Diseño único y artesanal",
  },
  {
    id: 2,
    image: "/especiales/especiales-2.jpeg",
    alt: "Torta personalizada ZAFTA - Creación especial",
  },
  {
    id: 3,
    image: "/especiales/especiales-3.jpeg",
    alt: "Torta personalizada ZAFTA - Hecha con amor",
  },
];

const InstagramSection = ({ onOpenOrder }: InstagramSectionProps) => {
  return (
    <section
      id="instagram"
      className="relative py-16 md:py-20 px-6 md:px-8"
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12 md:mb-14"
        >
          <h2 className="mb-4 text-4xl font-sans italic md:text-5xl text-foreground">
            Tortas Personalizadas
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Creamos la torta de tus sueños. Cada diseño es único y hecho con amor.
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
                <Instagram className="w-10 h-10 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-foreground font-sans font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
          {onOpenOrder ? (
            <Button
              variant="default"
              size="lg"
              onClick={onOpenOrder}
              className="shadow-warm hover:shadow-medium transition-all duration-300"
            >
              Haz tu pedido personalizado
            </Button>
          ) : (
            <Button
              variant="default"
              size="lg"
              asChild
              className="shadow-warm hover:shadow-medium transition-all duration-300"
            >
              <Link href="/productos">Haz tu pedido personalizado</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramSection;
