"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, INSTAGRAM_DM_URL, mailtoUrl } from "@/lib/contact";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  // Sobre Zafta
  {
    id: "1",
    category: "Sobre Zafta",
    question: "¿Cuál es la historia detrás de la marca?",
    answer:
      "Soy Cami, y hoy continúo con un legado familiar que ha endulzado los momentos de muchas familias en Antioquia. Este proyecto nació hace casi 30 años, gracias a Fanny Wagner, la abuela de mi esposo. En una época difícil, Fanny apostó por una de sus recetas más queridas: la torta de chocolate. Así nació lo que muchos conocieron como 'la torta de Judía'. Fanny horneaba desde su casa, siempre acompañada por sus hijos y, más adelante, por su esposo. Cuando ella falleció, hace más de 10 años, muchas personas pensaron que su receta se iría con ella. Pero no fue así. Nena, quien había trabajado junto a Fanny por más de 20 años, siguió con el legado. Y en 2015, decidí unirme para darle un nuevo impulso. Hoy, la torta de la Judía —que ahora llamamos con cariño 'Torta Zafta'— sigue siendo la misma receta, pero con nuevas formas de compartirla.",
  },
  // Pedidos y entregas
  {
    id: "2",
    category: "Pedidos y entregas",
    question: "¿Con cuánto tiempo debo hacer un pedido?",
    answer:
      "Horneamos nuestra Torta Zafta a diario, por lo que casi siempre tenemos disponibilidad inmediata. Sin embargo, te recomendamos hacer tu pedido con 1 o 2 días de anticipación. Para tortas personalizadas y pedidos para eventos, lo ideal es mínimo 10 días de anticipación.",
  },
  {
    id: "3",
    category: "Pedidos y entregas",
    question: "¿Hacen entregas a domicilio? ¿En qué zonas?",
    answer:
      "Sí. Realizamos domicilios en todo el área metropolitana de Medellín y municipios cercanos como Rionegro, Bello, La Estrella, Sabaneta, Itagüí, entre otros. Algunas zonas tienen restricciones por seguridad de los mensajeros, por eso es importante confirmar con anticipación.",
  },
  {
    id: "4",
    category: "Pedidos y entregas",
    question: "¿Cuáles son los horarios de atención y entrega?",
    answer:
      "Lunes a viernes: 8:00 a.m. – 4:30 p.m. Sábados: 7:00 a.m. – 12:00 p.m. Domingos y festivos no tenemos atención.",
  },
  {
    id: "5",
    category: "Pedidos y entregas",
    question: "¿Cómo puedo hacer mi pedido?",
    answer:
      `Puedes realizar tu pedido a través de nuestra tienda en línea, por mensaje directo en Instagram (@zafta_reposteria) o escribiéndonos a ${CONTACT_EMAIL}. Como lo hacía Fanny: con cercanía, atención y todo el amor del mundo ❤️`,
  },
  // Productos
  {
    id: "6",
    category: "Productos",
    question: "¿Puedo pedir solo una porción o hay pedido mínimo?",
    answer: "Vendemos tortas completas desde 3 porciones en adelante.",
  },
  {
    id: "7",
    category: "Productos",
    question: "¿Qué productos ofrecen?",
    answer:
      "Tortas clásicas y personalizadas, postres, y mesas de postres para eventos.",
  },
  {
    id: "8",
    category: "Productos",
    question: "¿Tienen productos sin azúcar, sin gluten o personalizados?",
    answer:
      "Sí, contamos con una línea saludable sin azúcar ni gluten, apta para personas con diabetes.",
  },
  {
    id: "9",
    category: "Productos",
    question: "¿Cuál es su producto más recomendado o especialidad?",
    answer: "Nuestra Torta de Chocolate Zafta.",
  },
  {
    id: "10",
    category: "Productos",
    question: "¿Si meto la torta en la nevera se pone dura?",
    answer:
      "Sí, como toda receta con mantequilla, al refrigerarla se pone más firme. Al dejarla a temperatura ambiente, vuelve a suavizarse perfectamente.",
  },
  {
    id: "11",
    category: "Productos",
    question: "¿Si la compro hoy, se daña mañana?",
    answer:
      "No. Nuestras tortas se preparan bajo pedido y se conservan hasta por 8 días si las guardas en nevera, preferiblemente en recipiente hermético. Si ya está cortada, recomendamos envolverla en papel film o papel chicle para evitar que la miga se seque.",
  },
  {
    id: "12",
    category: "Productos",
    question: "¿Cómo puedo transportarla de forma segura?",
    answer:
      "Colócala en el piso del copiloto con el aire encendido. Maneja con suavidad y asegúrate de que la torta esté refrigerada previamente.",
  },
  {
    id: "13",
    category: "Productos",
    question:
      "¿Qué hago para que mi torta decorada esté perfecta para el evento?",
    answer:
      "La refrigeración es clave. No la dejes a temperatura ambiente si vas a moverla. En Zafta usamos coberturas suaves (no pastillaje), por eso es importante conservarla en frío hasta el momento de servirla.",
  },
  // Eventos y celebraciones
  {
    id: "14",
    category: "Eventos y celebraciones",
    question: "¿Hacen productos para eventos (cumpleaños, bodas, reuniones)?",
    answer:
      "Sí, trabajamos para todo tipo de eventos. También nos adaptamos a requerimientos especiales.",
  },
  {
    id: "15",
    category: "Eventos y celebraciones",
    question:
      "¿Con cuánto tiempo de anticipación debo hacer un encargo para un evento?",
    answer: "Mínimo 10 días de anticipación.",
  },
  {
    id: "16",
    category: "Eventos y celebraciones",
    question:
      "¿Puedo personalizar los productos o la presentación para eventos?",
    answer: "Sí, nos encanta crear propuestas a tu medida.",
  },
  // Pagos y medios
  {
    id: "17",
    category: "Pagos y medios",
    question: "¿Qué formas de pago aceptan?",
    answer: "Transferencia a Bancolombia y pago en efectivo.",
  },
  {
    id: "18",
    category: "Pagos y medios",
    question: "¿Cuándo se realiza el pago?",
    answer:
      "Se debe pagar el 50% para agendar el pedido y el otro 50% antes de la entrega.",
  },
  // Canales de contacto
  {
    id: "19",
    category: "Canales de contacto",
    question: "¿Por dónde puedo hacer mi pedido?",
    answer:
      `Puedes pedir desde la tienda en línea, por mensaje directo en Instagram o escribiéndonos a ${CONTACT_EMAIL}. Coordinamos contigo todo con la misma calidez de siempre ❤️`,
  },
  {
    id: "20",
    category: "Canales de contacto",
    question: "¿Tienen catálogo digital o tienda en línea?",
    answer:
      "Sí ✨ Puedes ver nuestro catálogo y hacer tus pedidos en nuestra tienda online. Queremos que te sientas como en casa desde la primera pantalla.",
  },
  {
    id: "21",
    category: "Canales de contacto",
    question: "¿Dónde puedo ver más fotos de sus productos?",
    answer:
      "📸 Instagram: @zafta_reposteria, 👍 Facebook: @zafta_reposteria, 🎥 TikTok: @zafta_reposteria, 🔍 Google: Búscanos como 'Zafta Repostería'. Te esperamos con tortas, antojos y un poquito de historia en cada post 🧁✨",
  },
  // Reseñas y experiencia
  {
    id: "22",
    category: "Reseñas y experiencia",
    question:
      "¿Dónde puedo dejar una reseña o comentario sobre mi experiencia?",
    answer:
      "Puedes dejar tu reseña en nuestro perfil de Google My Business o escribirnos por Instagram. Cada mensaje es como una receta que guardamos con cariño. Nos ayuda a crecer, a mejorar, y a seguir horneando con propósito.",
  },
];

const FAQ = () => {
  return (
    <section
      id="faq"
      className="py-32 px-6 md:px-8 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden"
    >
      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="absolute bottom-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-20 text-center"
        >
          <h2 className="mb-4 text-4xl md:text-5xl text-foreground">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-sans">
            Aquí encontrarás respuestas a las preguntas más comunes sobre
            nuestras tortas, pedidos, entregas y más. Si tienes alguna otra
            duda, no dudes en contactarnos.
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-4"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.slice(0, 11).map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-card border border-border rounded-2xl shadow-warm overflow-hidden transition-all duration-300 hover:shadow-medium data-[state=open]:bg-primary/30 data-[state=open]:border-primary/50"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <AccordionTrigger className="px-6 py-5 text-left hover:no-underline group">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/60 flex items-center justify-center group-data-[state=open]:bg-primary transition-colors">
                        <ChevronDown className="h-4 w-4 text-primary transition-transform duration-300 group-data-[state=open]:rotate-180" />
                      </div>
                      <span className="text-base md:text-lg font-semibold text-foreground pr-4 font-sans">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pl-18">
                    <p className="text-base text-muted-foreground leading-relaxed font-sans">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-4"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.slice(11, 22).map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-card border border-border rounded-2xl shadow-warm overflow-hidden transition-all duration-300 hover:shadow-medium data-[state=open]:bg-primary/30 data-[state=open]:border-primary/50"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <AccordionTrigger className="px-6 py-5 text-left hover:no-underline group">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/60 flex items-center justify-center group-data-[state=open]:bg-primary transition-colors">
                        <ChevronDown className="h-4 w-4 text-primary transition-transform duration-300 group-data-[state=open]:rotate-180" />
                      </div>
                      <span className="text-base md:text-lg font-semibold text-foreground pr-4 font-sans">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pl-18">
                    <p className="text-base text-muted-foreground leading-relaxed font-sans">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center space-y-6"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-gotham font-bold text-foreground mb-3">
              ¿Aún tienes dudas?
            </h3>
            <p className="text-base md:text-lg text-muted-foreground mb-6 font-sans">
              Escríbenos por Instagram o por correo. Estamos aquí para ayudarte
              a escoger la torta perfecta para tu momento especial.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold w-full"
                >
                  <a
                    href={INSTAGRAM_DM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-5 w-5 mr-2" />
                    Escríbenos por Instagram
                  </a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold w-full border-2"
                >
                  <a
                    href={mailtoUrl(
                      "Dudas sobre sus productos",
                      "¡Hola! Tengo algunas dudas sobre sus productos. ¿Me pueden ayudar? 😊",
                    )}
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Escríbenos por correo
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
