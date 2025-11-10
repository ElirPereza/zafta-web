"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "1",
    question: "¿Cómo puedo hacer un pedido?",
    answer:
      "Elige tu torta favorita en nuestro catálogo, personalízala y confirma tu cotización por WhatsApp. ¡Nosotros nos encargamos del resto!",
  },
  {
    id: "2",
    question: "¿Con cuánto tiempo de anticipación debo hacer mi pedido?",
    answer:
      "Recomendamos realizarlo con al menos 24 horas de anticipación. Para tortas personalizadas, mínimo 48 horas.",
  },
  {
    id: "3",
    question: "¿Hacen entregas a domicilio?",
    answer:
      "Sí. Entregamos en diferentes zonas de la ciudad. El costo del envío depende de la distancia, la cual puedes calcular fácilmente al hacer tu pedido.",
  },
  {
    id: "4",
    question: "¿Puedo personalizar mi torta?",
    answer:
      "Por supuesto. Podemos incluir mensajes, decoraciones especiales y colores personalizados. ¡Cada torta cuenta una historia única!",
  },
  {
    id: "5",
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Puedes pagar contra entrega o a través de transferencia. Confirmamos todos los detalles por WhatsApp antes de procesar el pedido.",
  },
  {
    id: "6",
    question: "¿Puedo recoger mi pedido en la tienda?",
    answer:
      "Sí. También puedes programar la recogida en nuestra sede, según disponibilidad.",
  },
];

const FAQ = () => {
  const handleWhatsAppContact = () => {
    const message =
      "¡Hola! Tengo algunas dudas sobre sus productos. ¿Me pueden ayudar? 😊";
    const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

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
          <h2 className="mb-4 text-4xl md:text-5xl font-sans italic text-foreground">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans">
            Resolvemos tus dudas para que tu experiencia sea tan dulce como
            nuestras tortas.
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
              {faqs.slice(0, 3).map((faq, index) => (
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
              {faqs.slice(3, 6).map((faq, index) => (
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
            <h3 className="text-2xl md:text-3xl font-sans italic text-foreground mb-3">
              ¿Aún tienes dudas?
            </h3>
            <p className="text-base md:text-lg text-muted-foreground mb-6 font-sans">
              Hablemos por WhatsApp. Estamos aquí para ayudarte a escoger la
              torta perfecta para tu momento especial.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={handleWhatsAppContact}
                size="lg"
                variant="whatsapp"
                className="px-8 py-6 text-lg font-semibold"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Escríbenos por WhatsApp
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
