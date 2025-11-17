"use client";

import { useState, useEffect } from "react";
import { X, Gift, Copy, Check, Percent, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface DiscountPopupProps {
  onClose?: () => void;
}

interface PopupData {
  id: string;
  title: string;
  description: string;
  discountCode: string;
  discountPercent: number;
  imageUrl: string | null;
}

export function DiscountPopup({ onClose }: DiscountPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullPopup, setShowFullPopup] = useState(false);
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [copied, setCopied] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Check if popup has already been shown in this session
    const shown = sessionStorage.getItem("discount-popup-shown");
    if (shown) {
      setHasBeenShown(true);
      return;
    }

    // Fetch active popup
    const fetchPopup = async () => {
      try {
        const response = await fetch("/api/discount-popup");
        const data = await response.json();

        if (process.env.NODE_ENV === "development") {
          console.log("Discount popup fetch response:", { response, data });
        }

        if (response.ok && data.popup) {
          if (process.env.NODE_ENV === "development") {
            console.log("Setting popup data:", data.popup);
          }
          setPopup(data.popup);
          // Show floating button after 2 seconds delay
          setTimeout(() => {
            if (process.env.NODE_ENV === "development") {
              console.log("Showing floating discount button");
            }
            setIsOpen(true);
            sessionStorage.setItem("discount-popup-shown", "true");
          }, 2000);
        } else {
          if (process.env.NODE_ENV === "development") {
            console.log("No active popup found");
          }
        }
      } catch (error) {
        console.error("Error fetching discount popup:", error);
      }
    };

    fetchPopup();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setShowFullPopup(false);
    onClose?.();
  };

  const handleTogglePopup = () => {
    setShowFullPopup(!showFullPopup);
  };

  const handleCopyCode = () => {
    if (popup) {
      navigator.clipboard.writeText(popup.discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!popup || hasBeenShown) return null;

  return (
    <>
      {/* Floating Button - Similar to WhatsApp */}
      <AnimatePresence>
        {isOpen && !showFullPopup && (
          <motion.button
            onClick={handleTogglePopup}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-[hsl(var(--rose-gold))] to-[hsl(var(--burgundy))]"
            aria-label="Ver descuento especial"
          >
            <Gift className="h-7 w-7 md:h-8 md:w-8 text-white" />

            {/* Pulse animation ring */}
            <motion.span
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(var(--rose-gold))] to-[hsl(var(--burgundy))]"
              animate={{
                scale: [1, 1.4],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />

            {/* Discount badge */}
            <motion.div
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-md"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              -{popup.discountPercent}%
            </motion.div>

            {/* Sparkle effect */}
            <motion.div
              className="absolute -top-1 -left-1"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Full Popup Modal */}
      <AnimatePresence>
        {showFullPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md mx-4"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[hsl(var(--rose-gold))]/40">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5 text-[hsl(var(--burgundy))]" />
                </button>

                {/* Image (if provided) */}
                {popup.imageUrl && (
                  <div className="relative w-full h-48">
                    <Image
                      src={popup.imageUrl}
                      alt={popup.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Icon and Title */}
                  <div className="text-center space-y-2">
                    {!popup.imageUrl && (
                      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--rose-gold))]/20 to-[hsl(var(--burgundy))]/10 flex items-center justify-center mb-4">
                        <Gift className="h-8 w-8 text-[hsl(var(--burgundy))]" />
                      </div>
                    )}
                    <h2 className="text-2xl md:text-3xl font-gotham font-bold text-[hsl(var(--burgundy))]">
                      {popup.title}
                    </h2>
                    <p className="text-base md:text-lg text-[hsl(var(--burgundy))]/70 font-sans">
                      {popup.description}
                    </p>
                  </div>

                  {/* Discount Code */}
                  <div className="bg-gradient-to-br from-[hsl(var(--beige-100))] to-white rounded-lg p-4 border-2 border-[hsl(var(--rose-gold))]/30 border-dashed">
                    <p className="text-xs text-[hsl(var(--burgundy))]/60 font-sans mb-2 text-center">
                      Usa este código al finalizar tu compra:
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <code className="text-xl md:text-2xl font-bold text-[hsl(var(--burgundy))] tracking-wider">
                        {popup.discountCode}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopyCode}
                        className="h-8 w-8 p-0 hover:bg-[hsl(var(--rose-gold))]/20"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-[hsl(var(--burgundy))]" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Percent className="h-5 w-5 text-[hsl(var(--burgundy))]" />
                      <p className="text-lg font-semibold text-[hsl(var(--burgundy))]">
                        {popup.discountPercent}% de descuento
                      </p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={handleClose}
                      className="w-full text-base md:text-lg py-5 md:py-6 bg-[hsl(var(--burgundy))] hover:bg-[hsl(var(--burgundy))]/90 text-white shadow-lg font-gotham"
                      size="lg"
                    >
                      Empezar a comprar
                    </Button>
                    <button
                      onClick={() => setShowFullPopup(false)}
                      className="w-full text-sm text-[hsl(var(--burgundy))]/60 hover:text-[hsl(var(--burgundy))] transition-colors font-sans"
                    >
                      Ver después
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
