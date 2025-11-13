"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface InstagramSectionProps {
  onOpenOrder?: () => void;
}

interface GalleryImage {
  id: string;
  imageUrl: string;
  alt: string;
}

const InstagramSection = ({ onOpenOrder }: InstagramSectionProps) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/gallery?section=PERSONALIZADAS");
        const data = await response.json();
        if (response.ok && data.images) {
          setImages(data.images);
        }
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);
  return (
    <section id="instagram" className="relative py-16 md:py-20 px-6 md:px-8">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12 md:mb-14"
        >
          <h2 className="mb-4 text-4xl md:text-5xl text-foreground">
            Tortas Personalizadas
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Creamos la torta de tus sueños. Cada diseño es único y hecho con
            amor.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando imágenes...</p>
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            {images.map((image, index) => (
              <motion.a
                key={image.id}
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
                  src={image.imageUrl}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay imágenes disponibles en este momento.
            </p>
          </div>
        )}

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
