"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import OrderSidebar from "./OrderSidebar";

const eventosPhotos = [
  {
    id: 1,
    image: "/eventos/eventos-1.jpg",
    alt: "Evento especial ZAFTA - Celebración elegante",
  },
  {
    id: 2,
    image: "/eventos/eventos-2.jpg",
    alt: "Evento especial ZAFTA - Mesa de dulces personalizada",
  },
  {
    id: 3,
    image: "/eventos/eventos-3.jpg",
    alt: "Evento especial ZAFTA - Torta para ocasión especial",
  },
];

const EventosSection = () => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  return (
    <>
      <section
        id="eventos"
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
          <h2 className="mb-4 text-4xl italic md:text-5xl text-foreground">
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
            onClick={() => setIsOrderOpen(true)}
            className="shadow-warm hover:shadow-medium transition-all duration-300"
          >
            Cotiza tu evento
          </Button>
        </motion.div>
      </div>
    </section>

      <OrderSidebar
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        orderType="event"
      />
    </>
  );
};

export default EventosSection;
