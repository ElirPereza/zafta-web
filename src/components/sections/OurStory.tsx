"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Sparkles, Clock, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";

const timeline = [
  {
    year: "1985",
    image: "/timeline/1985.jpg",
    title: "Los inicios de Fanny",
    event:
      "Fanny Wagner comenzó a hornear su famosa torta de chocolate, que se convertiría en el legado que hoy conocemos como ZAFTA.",
  },
  {
    year: "1990",
    image: "/timeline/1990.jpg",
    title: "Un negocio familiar",
    event:
      "La 'torta de la judía' se volvió popular en Antioquia, con Fanny trabajando desde casa junto a sus hijos y esposo.",
  },
  {
    year: "2010",
    image: "/timeline/2010.jpg",
    title: "Continuando el legado",
    event:
      "Tras la partida de Fanny, Nena mantuvo viva la receta y la tradición familiar.",
  },
  {
    year: "2015",
    image: "/timeline/2015.jpg",
    title: "Renovación e innovación",
    event:
      "María Camila revitaliza la marca con un enfoque creativo y presencia en redes sociales.",
  },
  {
    year: "2024",
    image: "/timeline/2024.jpg",
    title: "ZAFTA toma forma",
    event:
      "La 'torta de la judía' evoluciona oficialmente a 'Torta ZAFTA', conservando su esencia pero con una nueva imagen.",
  },
];

const values = [
  {
    icon: Clock,
    title: "Tradición",
    description: "Recetas transmitidas de generación en generación",
  },
  {
    icon: Heart,
    title: "Amor",
    description: "Horneado con cariño en cada bocado",
  },
  {
    icon: Sparkles,
    title: "Creatividad",
    description: "Innovación que respeta los sabores clásicos",
  },
  {
    icon: Palette,
    title: "Memoria",
    description: "Preservando momentos dulces para siempre",
  },
];

const OurStory = () => {
  return (
    <section
      id="our-story"
      className="py-16 md:py-20 px-6 md:px-8 bg-gradient-to-br from-secondary/20 via-background to-secondary/10"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-12 md:mb-16 text-center"
        >
          <h2 className="mb-6 text-4xl font-sans italic md:text-5xl text-foreground">
            Nuestra Historia – Tradición, Sabor y Amor
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-sans leading-relaxed">
            Una historia de tradición, sabor y amor que comenzó en la cocina de
            Fanny Wagner.
          </p>
        </motion.div>

        {/* Intro Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="mb-24 text-center max-w-4xl mx-auto"
        >
          <p className="text-base md:text-lg leading-relaxed text-foreground/80 font-sans">
            Hace casi 30 años, Fanny Wagner creó una receta de torta de
            chocolate que se convertiría en símbolo de amor y unión familiar. Lo
            que nació en su cocina como una celebración, se transformó en
            legado. Hoy, en ZAFTA, seguimos su receta con el mismo cariño,
            nuevos colores y el mismo sabor que enamora.
          </p>
        </motion.div>

        {/* Timeline - Árbol del Legado */}
        <div className="mb-32">
          <div className="relative">
            {/* Timeline line with draw animation */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block origin-top"
            />

            <div className="space-y-16">
              {timeline.map((item, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 40,
                    }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.15,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="relative flex flex-col md:flex-row gap-8 items-center"
                  >
                    {/* Left side - Image on even, Text on odd */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.15 + 0.1,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="flex-1 w-full"
                    >
                      {isLeft ? (
                        // Image on left
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-4 border-secondary/40 shadow-warm hover:shadow-medium transition-all duration-300 group">
                          <Image
                            src={item.image}
                            alt={`${item.year} - ${item.title}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            quality={85}
                          />
                          {/* Year badge overlay */}
                          <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full">
                            <span className="text-lg md:text-xl font-sans italic text-background font-bold">
                              {item.year}
                            </span>
                          </div>
                        </div>
                      ) : (
                        // Text on left
                        <div className="md:text-right text-center space-y-3 md:pr-4">
                          <div className="text-3xl md:text-4xl font-sans italic text-primary mb-2">
                            {item.year}
                          </div>
                          <h4 className="text-xl md:text-2xl font-sans italic text-foreground">
                            {item.title}
                          </h4>
                          <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans">
                            {item.event}
                          </p>
                        </div>
                      )}
                    </motion.div>

                    {/* Center dot with pulse animation */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.15 + 0.2,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="relative z-10 flex-shrink-0"
                    >
                      {/* Pulse ring animation */}
                      <motion.span
                        className="absolute inset-0 rounded-full bg-primary"
                        animate={{
                          scale: [1, 1.8],
                          opacity: [0.6, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: index * 0.3,
                        }}
                      />
                      <div className="relative w-4 h-4 rounded-full bg-primary border-4 border-secondary shadow-soft" />
                    </motion.div>

                    {/* Right side - Text on even, Image on odd */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.15 + 0.1,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="flex-1 w-full"
                    >
                      {isLeft ? (
                        // Text on right
                        <div className="md:text-left text-center space-y-3 md:pl-4">
                          <div className="text-3xl md:text-4xl font-sans italic text-primary mb-2">
                            {item.year}
                          </div>
                          <h4 className="text-xl md:text-2xl font-sans italic text-foreground">
                            {item.title}
                          </h4>
                          <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans">
                            {item.event}
                          </p>
                        </div>
                      ) : (
                        // Image on right
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-4 border-secondary/40 shadow-warm hover:shadow-medium transition-all duration-300 group">
                          <Image
                            src={item.image}
                            alt={`${item.year} - ${item.title}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            quality={85}
                          />
                          {/* Year badge overlay */}
                          <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full">
                            <span className="text-lg md:text-xl font-sans italic text-background font-bold">
                              {item.year}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-16"
        >
          <h2 className="mb-6 text-4xl font-sans italic md:text-5xl text-foreground">
            Nuestros Valores
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Los pilares que guían cada creación desde nuestra cocina hasta tu
            mesa.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-20">
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
              <h3 className="mb-3 text-xl md:text-2xl font-sans italic text-foreground">
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
          <h3 className="mb-6 text-3xl font-sans italic md:text-4xl text-center text-foreground">
            Nuestro Propósito
          </h3>
          <p className="text-lg md:text-xl text-center text-muted-foreground font-sans leading-relaxed mb-12 max-w-3xl mx-auto">
            Más que una empresa, somos guardianes de tradiciones dulces que unen
            familias.
          </p>

          <div className="grid gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative pl-6 border-l-4 border-primary"
            >
              <h4 className="text-xl md:text-2xl font-sans italic text-primary mb-4">
                Misión
              </h4>
              <p className="text-base md:text-lg text-foreground font-sans leading-relaxed">
                Horneamos como si cada producto fuera para nuestra familia, así
                como lo hacía Fanny, creando recuerdos llenos de dulzura.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative pl-6 border-l-4 border-secondary"
            >
              <h4 className="text-xl md:text-2xl font-sans italic text-primary mb-4">
                Visión
              </h4>
              <p className="text-base md:text-lg text-foreground font-sans leading-relaxed">
                Acompañar momentos inolvidables con sabores hechos con amor en
                casa.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurStory;
