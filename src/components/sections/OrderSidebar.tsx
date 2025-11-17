"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Plus, Minus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface OrderSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product;
  orderType?: "custom" | "event"; // Nuevo: tipo de pedido
}

const products: Product[] = [
  {
    id: "1",
    name: "Torta de Chocolate",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
  },
  {
    id: "2",
    name: "Torta de Vainilla",
    price: 40000,
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
  },
  {
    id: "3",
    name: "Torta Tradicional",
    price: 42000,
    image:
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80",
  },
  {
    id: "4",
    name: "Torta de Zanahoria",
    price: 43000,
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80",
  },
  {
    id: "5",
    name: "Torta Red Velvet",
    price: 48000,
    image:
      "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80",
  },
  {
    id: "6",
    name: "Torta de Limón",
    price: 41000,
    image:
      "https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=800&q=80",
  },
];

const OrderSidebar = ({
  isOpen,
  onClose,
  initialProduct,
  orderType = "custom",
}: OrderSidebarProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");

  const isCustomOrder = !initialProduct;
  const subtotal = initialProduct ? initialProduct.price * quantity : 0;
  const deliveryCost = 5000;
  const total = subtotal + deliveryCost;

  const handleWhatsAppOrder = () => {
    if (!name) {
      toast.error("Por favor completa tu nombre");
      return;
    }

    let message = "";

    if (isCustomOrder) {
      // Pedido personalizado o evento
      if (!description) {
        toast.error(
          orderType === "event"
            ? "Por favor describe tu evento"
            : "Por favor describe tu pedido personalizado",
        );
        return;
      }

      const emoji = orderType === "event" ? "🎉" : "🍰";
      const title =
        orderType === "event"
          ? "Cotización para Evento ZAFTA"
          : "Pedido Personalizado ZAFTA";

      message =
        `${emoji} *${title}*\n\n` +
        `👤 *Nombre:* ${name}\n\n` +
        `📝 *Descripción:*\n${description}\n\n` +
        (address ? `📍 *Dirección:* ${address}\n\n` : "") +
        `¡Espero su cotización! 😊`;
    } else {
      // Pedido de producto específico
      message =
        `🍰 *Cotización ZAFTA*\n\n` +
        `👤 *Nombre:* ${name}\n` +
        `📦 *Producto:* ${initialProduct.name}\n` +
        `🔢 *Cantidad:* ${quantity}\n` +
        `💰 *Subtotal:* $${subtotal.toLocaleString()}\n` +
        (address ? `📍 *Dirección:* ${address}\n` : "") +
        `🚚 *Envío:* $${deliveryCost.toLocaleString()}\n` +
        `💵 *Total:* $${total.toLocaleString()}\n\n` +
        (description ? `💌 *Mensaje:* ${description}\n\n` : "") +
        `¡Espero tu confirmación! 😊`;
    }

    const whatsappUrl = `https://wa.me/573217590897?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast.success("Redirigiendo a WhatsApp...");
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-background shadow-warm z-50 overflow-y-auto texture-overlay"
          >
            {/* Close Button - Absolute positioned at top right corner */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-3 right-3 hover:bg-muted rounded-full transition-all hover:rotate-90 duration-300 z-10"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="border-b border-border/50 pb-4 pr-10">
                <h2 className="text-2xl md:text-3xl text-foreground">
                  {isCustomOrder
                    ? orderType === "event"
                      ? "Cotiza tu Evento"
                      : "Pedido Personalizado"
                    : "Tu Pedido"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 font-sans leading-relaxed">
                  {isCustomOrder
                    ? orderType === "event"
                      ? "Cuéntanos sobre tu evento y te enviaremos una cotización personalizada."
                      : "Cuéntanos tu idea y la haremos realidad."
                    : `${initialProduct?.name} - Completa los detalles de tu pedido.`}
                </p>
              </div>

              {/* Nombre */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium font-sans">
                  Tu nombre
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="¿Cómo te llamas?"
                  className="border-2 focus:border-primary transition-all h-10"
                />
              </div>

              {/* Cantidad - Solo para productos específicos */}
              {!isCustomOrder && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium font-sans">
                    Cantidad
                  </Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      className="h-10 w-10 rounded-full border-2 hover:border-primary active:animate-bump transition-all"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="text-center h-10 w-20 border-2 focus:border-primary transition-all"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      className="h-10 w-10 rounded-full border-2 hover:border-primary active:animate-bump transition-all"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Descripción/Mensaje */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium font-sans">
                  {isCustomOrder
                    ? orderType === "event"
                      ? "Describe tu evento"
                      : "Describe tu pedido personalizado"
                    : "Mensaje especial (opcional)"}
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    isCustomOrder
                      ? orderType === "event"
                        ? "Cuéntanos sobre tu evento: tipo de evento, número de invitados, fecha, tipo de torta o dulces que necesitas, temática..."
                        : "Cuéntanos qué tipo de torta deseas, sabores, colores, decoración, tamaño, fecha de entrega..."
                      : "Agrega una dedicatoria o mensaje especial..."
                  }
                  className="min-h-[80px] border-2 focus:border-primary transition-all resize-none text-sm"
                />
                {isCustomOrder && (
                  <p className="text-xs text-muted-foreground">
                    {orderType === "event"
                      ? "Incluye todos los detalles importantes sobre tu evento para que podamos preparar la mejor propuesta."
                      : "Incluye todos los detalles que consideres importantes para tu torta ideal."}
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium font-sans">
                  Dirección de entrega (opcional)
                </Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Escribe tu dirección completa"
                  className="border-2 focus:border-primary transition-all h-10"
                />
                <p className="text-xs text-muted-foreground">
                  Confirmaremos los detalles de entrega por WhatsApp.
                </p>
              </div>

              {/* Resumen del pedido - Solo para productos específicos */}
              {!isCustomOrder && (
                <div className="space-y-3 p-5 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl border border-primary/40 shadow-warm">
                  <h3 className="text-lg font-sans text-foreground">
                    Resumen del pedido
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-sans">
                        {initialProduct?.name} x{quantity}
                      </span>
                      <span className="font-medium">
                        ${subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-sans">
                        Envío
                      </span>
                      <span className="font-medium">
                        ${deliveryCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-primary/30 pt-2 mt-2">
                      <div className="flex justify-between text-base font-bold">
                        <span className="font-sans">Total</span>
                        <span className="text-primary">
                          ${total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info adicional - Solo para pedidos personalizados */}
              {isCustomOrder && (
                <div className="space-y-3 p-5 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl border border-primary/40 shadow-warm">
                  <h3 className="text-lg font-sans text-foreground">
                    ¿Cómo funciona?
                  </h3>
                  <div className="space-y-2 text-sm text-foreground/80 font-sans leading-relaxed">
                    <p>1️⃣ Envíanos tu solicitud por WhatsApp</p>
                    <p>2️⃣ Te responderemos con una cotización personalizada</p>
                    <p>3️⃣ Ajustamos los detalles según tus preferencias</p>
                    <p>4️⃣ ¡Creamos tu torta perfecta con amor!</p>
                  </div>
                </div>
              )}

              {/* WhatsApp Button */}
              <Button
                variant="whatsapp"
                size="lg"
                onClick={handleWhatsAppOrder}
                className="w-full gap-2 text-sm font-semibold h-12 shadow-warm hover:shadow-medium"
              >
                <Send className="h-4 w-4" />
                {isCustomOrder ? "Enviar solicitud" : "Enviar cotización"} por
                WhatsApp
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderSidebar;
