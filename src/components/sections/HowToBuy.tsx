"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Elige tu favorita.",
    description: "Mira los sabores y tamaños que tenemos.",
  },
  {
    title: "Personalízala.",
    description:
      "¿Tienes una idea diferente? ¡Contáctanos por WhatsApp y la hacemos realidad!",
  },
  {
    title: "Haz tu pedido.",
    description:
      "Confirma los detalles y listo, nosotros nos encargamos del resto.",
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
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/8 to-background" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="mb-6 text-4xl font-sans italic md:text-5xl text-foreground">
            ¿cómo pido mi torta?
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 mb-12 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="text-center"
            >
              {/* Número simple */}
              <div className="mb-6">
                <span className="inline-flex items-center justify-center text-5xl md:text-6xl font-sans italic text-primary">
                  {index + 1}
                </span>
              </div>

              {/* Título */}
              <h3 className="mb-3 text-xl md:text-2xl font-sans italic text-foreground">
                {step.title}
              </h3>

              {/* Descripción */}
              <p className="text-base md:text-lg text-muted-foreground font-sans leading-relaxed">
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
