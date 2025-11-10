"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const handleClick = () => {
    const message = encodeURIComponent(
      "¡Hola! Me gustaría hacer un pedido de tortas Zafta 🍰",
    );
    window.open(`https://wa.me/573117479392?text=${message}`, "_blank");
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: 1,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-shadow"
      style={{ backgroundColor: "#25D366" }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white" />

      {/* Pulse animation ring */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: "#25D366" }}
        animate={{
          scale: [1, 1.3],
          opacity: [0.7, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </motion.button>
  );
}
