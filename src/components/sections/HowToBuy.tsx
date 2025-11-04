"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: ShoppingBag,
    title: "Elige tu torta favorita",
    description: "Explora nuestro catálogo y selecciona tu sabor preferido",
  },
  {
    icon: Sparkles,
    title: "Personalízala a tu gusto",
    description: "Indícanos el tamaño, relleno o dedicatoria especial.",
  },
  {
    icon: MapPin,
    title: "Ubica tu dirección",
    description:
      "Marca tu ubicación o escribe la dirección de entrega en el mapa dinámico",
  },
  {
    icon: MessageCircle,
    title: "Recibe tu cotización por WhatsApp",
    description:
      "Confirma tu pedido y recibe los detalles finales en nuestro chat.",
  },
];

const HowToBuy = () => {
  const scrollToGallery = () => {
    const gallery = document.getElementById("gallery");
    gallery?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="how-to-buy"
      className="relative py-16 md:py-20 px-6 md:px-8 bg-background"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/15 to-background" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="mb-6 text-4xl font-serif italic md:text-5xl text-foreground">
            Cómo Comprar tu Torta ZAFTA
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Un proceso fácil, dulce y lleno de amor. Como debe ser.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="group text-center"
            >
              <motion.div
                className="relative mb-6"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-card border-2 border-secondary/40 shadow-warm transition-all duration-300 group-hover:border-secondary group-hover:shadow-medium">
                  <step.icon
                    className="h-12 w-12 text-primary transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-warm">
                  {index + 1}
                </div>
              </motion.div>
              <h3 className="mb-4 text-xl md:text-2xl font-serif italic text-foreground">
                {step.title}
              </h3>
              <p className="text-base md:text-lg text-muted-foreground font-sans leading-relaxed px-2">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="text-center"
        >
          <Button
            onClick={scrollToGallery}
            variant="default"
            size="lg"
            className="shadow-warm hover:shadow-medium transition-all duration-300"
          >
            Descubre Nuestras Tortas
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowToBuy;
