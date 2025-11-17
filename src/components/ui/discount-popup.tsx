"use client";

import { useState, useEffect } from "react";
import { X, Gift, Copy, Check } from "lucide-react";
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
          // Show popup after 2 seconds delay
          setTimeout(() => {
            if (process.env.NODE_ENV === "development") {
              console.log("Opening popup");
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
    onClose?.();
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
    <AnimatePresence>
      {isOpen && (
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
            <div className="relative bg-card rounded-2xl shadow-2xl overflow-hidden border-2 border-primary/40">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
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
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Gift className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <h2 className="text-2xl md:text-3xl text-foreground">
                    {popup.title}
                  </h2>
                  <p className="text-lg text-muted-foreground font-sans">
                    {popup.description}
                  </p>
                </div>

                {/* Discount Code */}
                <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/20 border-dashed">
                  <p className="text-xs text-muted-foreground font-sans mb-2 text-center">
                    Usa este código:
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-2xl font-bold text-primary tracking-wider">
                      {popup.discountCode}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyCode}
                      className="h-8 w-8 p-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-lg font-semibold text-center mt-2 text-primary">
                    {popup.discountPercent}% de descuento
                  </p>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleClose}
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  Empezar a comprar
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
