"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const eventosPhotos = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1464347744102-11db6282f854?w=400&h=400&fit=crop",
    alt: "Boda elegante con torta de varios pisos",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop",
    alt: "Celebración de cumpleaños especial",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop",
    alt: "Evento corporativo con mesa de dulces",
  },
];

const EventosSection = () => {
  return (
    <section
      id="eventos"
      className="py-16 md:py-20 px-6 md:px-8 bg-gradient-to-b from-background to-beige-100"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12 md:mb-14"
        >
          <h2 className="mb-4 text-4xl font-sans font-bold md:text-5xl text-foreground">
            Eventos Especiales
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Hacemos de tu evento un momento inolvidable con tortas y dulces diseñados especialmente para la ocasión.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {eventosPhotos.map((photo, index) => (
            <motion.a
              key={photo.id}
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
                src={photo.image}
                alt={photo.alt}
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
          <Button
            variant="default"
            size="lg"
            asChild
            className="shadow-warm hover:shadow-medium transition-all duration-300"
          >
            <Link href="/contacto">Cotiza tu evento</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventosSection;
