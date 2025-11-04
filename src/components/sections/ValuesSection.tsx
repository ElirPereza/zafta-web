"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Clock, Camera } from "lucide-react";

const values = [
  {
    icon: Clock,
    title: "Tradición",
    description:
      "Recetas transmitidas de generación en generación, preservando los sabores auténticos que nuestras familias aman.",
  },
  {
    icon: Heart,
    title: "Amor",
    description:
      "Cada torta se hace con cuidado, dedicación y la calidez de una receta familiar.",
  },
  {
    icon: Sparkles,
    title: "Creatividad",
    description:
      "Combinando técnicas tradicionales con sabores modernos para crear experiencias únicas.",
  },
  {
    icon: Camera,
    title: "Memoria",
    description:
      "Cada bocado cuenta una historia — celebrando momentos que se convierten en recuerdos atesorados.",
  },
];

const ValuesSection = () => {
  return (
    <section
      id="values"
      className="py-32 px-6 md:px-8 bg-gradient-to-b from-background via-secondary/10 to-background"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-20"
        >
          <h2 className="mb-6 text-4xl font-serif italic md:text-5xl text-foreground">
            Nuestros Valores
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Los pilares que guían cada creación desde nuestra cocina hasta tu
            mesa.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-24">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
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
                className="mb-6"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-card border-2 border-secondary/40 shadow-warm transition-all duration-300 group-hover:border-secondary group-hover:shadow-medium">
                  <value.icon
                    className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>
              <h3 className="mb-3 text-xl md:text-2xl font-serif italic text-foreground">
                {value.title}
              </h3>
              <p className="text-base text-muted-foreground font-sans leading-relaxed px-2">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Our Purpose */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="mb-12 text-3xl font-serif italic md:text-4xl text-center text-foreground">
            Nuestro Propósito
          </h3>

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card p-8 rounded-2xl shadow-card hover:shadow-medium transition-all duration-300"
            >
              <h4 className="text-xl font-serif italic text-primary mb-4">
                Misión
              </h4>
              <p className="text-base text-muted-foreground font-sans leading-relaxed">
                Crear tortas y pasteles artesanales que unen familias,
                celebrando los momentos más dulces de la vida con sabores
                auténticos y calidad inquebrantable.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card p-8 rounded-2xl shadow-card hover:shadow-medium transition-all duration-300"
            >
              <h4 className="text-xl font-serif italic text-primary mb-4">
                Visión
              </h4>
              <p className="text-base text-muted-foreground font-sans leading-relaxed">
                Ser reconocidos como el corazón de las celebraciones de nuestra
                comunidad, donde cada torta cuenta una historia y cada bocado
                evoca recuerdos preciados.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;
