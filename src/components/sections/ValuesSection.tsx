"use client";

import { motion } from "framer-motion";

const values = [
  {
    title: "Tradición",
    description:
      "Recetas transmitidas de generación en generación, preservando los sabores auténticos que nuestras familias aman.",
  },
  {
    title: "Amor",
    description:
      "Cada torta se hace con cuidado, dedicación y la calidez de una receta familiar.",
  },
  {
    title: "Creatividad",
    description:
      "Combinando técnicas tradicionales con sabores modernos para crear experiencias únicas.",
  },
  {
    title: "Memoria",
    description:
      "Cada bocado cuenta una historia — celebrando momentos que se convierten en recuerdos atesorados.",
  },
];

const ValuesSection = () => {
  return (
    <section
      id="values"
      className="py-32 px-6 md:px-8 bg-gradient-to-b from-background via-primary/5 to-background"
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
          <h2 className="mb-6 text-4xl md:text-5xl text-foreground">
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="text-center"
            >
              {/* Título */}
              <h3 className="mb-4 text-2xl md:text-3xl font-sans text-foreground">
                {value.title}
              </h3>

              {/* Descripción */}
              <p className="text-base md:text-lg text-muted-foreground font-sans leading-relaxed">
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
          <h3 className="mb-12 text-3xl font-sans md:text-4xl text-center text-foreground">
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
              <h4 className="text-xl font-sans text-primary mb-4">Misión</h4>
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
              <h4 className="text-xl font-sans text-primary mb-4">Visión</h4>
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
