"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Phone, Mail, MapPin, Package, Clock, XCircle, Loader2, Store, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Order, OrderItem, Product, PaymentStatus, OrderStatus } from "@prisma/client";

interface OrderConfirmationProps {
  order: Order & {
    items: (OrderItem & {
      product: Pick<Product, "name" | "images">;
    })[];
  };
}

export function OrderConfirmation({ order: initialOrder }: OrderConfirmationProps) {
  const [order, setOrder] = useState(initialOrder);
  const [verifying, setVerifying] = useState(false);

  // Mark first purchase as completed and verify payment status
  useEffect(() => {
    localStorage.setItem("zafta-first-purchase-completed", "true");

    // Verificar el estado del pago con Wompi si está pendiente
    if (order.paymentStatus === "PENDING" && order.paymentMethod === "Wompi") {
      verifyPayment();
    }
  }, []);

  const verifyPayment = async () => {
    setVerifying(true);
    try {
      const response = await fetch("/api/wompi/verify-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.updated) {
          // Actualizar el estado local
          setOrder((prev) => ({
            ...prev,
            paymentStatus: data.paymentStatus as PaymentStatus,
            status: data.orderStatus as OrderStatus,
          }));
        }
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    } finally {
      setVerifying(false);
    }
  };
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format to avoid "a. m." / "p. m." wrapping
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PREPARING":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "IN_TRANSIT":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Pendiente",
      CONFIRMED: "Confirmado",
      PREPARING: "En Preparación",
      IN_TRANSIT: "En Ruta",
      DELIVERED: "Entregado",
      CANCELLED: "Cancelado",
    };
    return labels[status] || status;
  };

  const getPaymentIcon = () => {
    if (verifying) return <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-3 sm:mb-4 animate-spin" />;
    if (order.paymentStatus === "PAID") return <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 mx-auto mb-3 sm:mb-4" />;
    if (order.paymentStatus === "FAILED") return <XCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-600 mx-auto mb-3 sm:mb-4" />;
    return <Clock className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-600 mx-auto mb-3 sm:mb-4" />;
  };

  const getPaymentTitle = () => {
    if (verifying) return "Verificando Pago...";
    if (order.paymentStatus === "PAID") return "¡Pedido Confirmado!";
    if (order.paymentStatus === "FAILED") return "Pago Fallido";
    return "Pedido Recibido";
  };

  const getPaymentMessage = () => {
    if (verifying) return "Estamos verificando el estado de tu pago...";
    if (order.paymentStatus === "PAID") return `Gracias por tu compra, ${order.customerName}`;
    if (order.paymentStatus === "FAILED") return "Hubo un problema con tu pago. Por favor intenta nuevamente.";
    return `Tu pedido ha sido recibido, ${order.customerName}. Estamos procesando tu pago.`;
  };

  return (
    <div className="pt-20 md:pt-32 min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-12 max-w-4xl">
        {/* Success Message */}
        <div className="text-center mb-6 md:mb-8">
          {getPaymentIcon()}
          <h1 className="text-2xl sm:text-4xl md:text-5xl mb-2 sm:mb-4 text-foreground">
            {getPaymentTitle()}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-sans mb-1 sm:mb-2">
            {getPaymentMessage()}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            Número de pedido:{" "}
            <span className="font-semibold">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Status */}
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-lg sm:text-xl mb-1 sm:mb-2">
                Estado del Pedido
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                Pedido realizado el {formatDate(order.createdAt)}
              </p>
            </div>
            <div
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border font-sans font-medium text-xs sm:text-sm self-start sm:self-auto ${getStatusColor(
                order.status,
              )}`}
            >
              {getStatusLabel(order.status)}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Contact Information */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Información de Contacto
            </h2>
            <div className="space-y-2 font-sans text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground break-all">
                  {order.customerEmail}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  {order.customerPhone}
                </span>
              </div>
            </div>
          </Card>

          {/* Delivery Info */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
              {order.deliveryMethod === "PICKUP" ? (
                <>
                  <Store className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  Recoger en Tienda
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Envío a Domicilio
                </>
              )}
            </h2>
            <div className="space-y-1 font-sans text-xs sm:text-sm text-muted-foreground">
              {order.deliveryMethod === "PICKUP" ? (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-semibold text-green-800 mb-1">
                    Recogida en local
                  </p>
                  <p className="text-green-700 text-[11px] sm:text-xs">
                    Te contactaremos por WhatsApp para coordinar la recogida y darte la ubicación exacta.
                  </p>
                </div>
              ) : (
                <>
                  <p>{order.shippingAddress}</p>
                  <p>
                    {order.shippingCity}, {order.shippingDepartment}
                  </p>
                  {order.deliveryNotes && order.deliveryNotes !== "RECOGIDA EN LOCAL" && (
                    <p className="mt-2 text-[11px] sm:text-xs">
                      <span className="font-medium">Notas:</span>{" "}
                      {order.deliveryNotes}
                    </p>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Productos
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3 sm:gap-4">
                {/* Image */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-beige-100">
                  {item.product.images && item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 sm:h-8 sm:w-8 text-beige-400" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-sans font-medium text-xs sm:text-sm mb-1">
                    {item.product.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                    Cantidad: {item.quantity} ×{" "}
                    {formatPrice(Number(item.price))}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="font-sans text-xs sm:text-sm font-semibold">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-3 sm:my-4" />

          {/* Price Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm font-sans">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                {formatPrice(Number(order.subtotal))}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm font-sans">
              <span className="text-muted-foreground">
                {order.deliveryMethod === "PICKUP" ? "Recogida en tienda" : "Envío"}
              </span>
              <span className={`font-medium ${order.deliveryMethod === "PICKUP" ? "text-green-600" : ""}`}>
                {order.deliveryMethod === "PICKUP" ? "Gratis" : formatPrice(Number(order.shippingCost))}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-base sm:text-lg font-sans">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary text-lg sm:text-xl">
                {formatPrice(Number(order.total))}
              </span>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6 bg-primary/30">
          <h3 className="font-sans text-base sm:text-lg mb-2 sm:mb-3">
            ¿Qué sigue?
          </h3>
          <ul className="space-y-2 font-sans text-xs sm:text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold shrink-0">1.</span>
              <span>
                Recibirás un correo de confirmación en{" "}
                <strong className="break-all">{order.customerEmail}</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold shrink-0">2.</span>
              <span>
                Te contactaremos por WhatsApp al{" "}
                <strong>{order.customerPhone}</strong> para coordinar{" "}
                {order.deliveryMethod === "PICKUP" ? "la recogida" : "la entrega"}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold shrink-0">3.</span>
              <span>
                {order.deliveryMethod === "PICKUP" ? (
                  <>
                    Tu pedido será preparado con amor y te notificaremos cuando esté listo para recoger
                  </>
                ) : (
                  <>
                    Tu pedido será preparado con amor y entregado en la dirección indicada
                  </>
                )}
              </span>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/productos" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full font-sans text-sm sm:text-base"
            >
              Seguir Comprando
            </Button>
          </Link>
          <Link href="/inicio" className="w-full sm:w-auto">
            <Button size="lg" className="w-full font-sans text-sm sm:text-base">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
