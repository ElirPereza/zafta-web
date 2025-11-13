"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Phone, Mail, MapPin, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Order, OrderItem, Product } from "@prisma/client";

interface OrderConfirmationProps {
  order: Order & {
    items: (OrderItem & {
      product: Pick<Product, "name" | "images">;
    })[];
  };
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
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

  return (
    <div className="pt-32 min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-6 py-8 md:py-12 max-w-4xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl mb-4 text-foreground">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-lg text-muted-foreground font-sans mb-2">
            Gracias por tu compra, {order.customerName}
          </p>
          <p className="text-sm text-muted-foreground font-sans">
            Número de pedido:{" "}
            <span className="font-semibold">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Status */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl mb-2">Estado del Pedido</h2>
              <p className="text-sm text-muted-foreground font-sans">
                Pedido realizado el {formatDate(order.createdAt)}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full border font-sans font-medium ${getStatusColor(
                order.status,
              )}`}
            >
              {getStatusLabel(order.status)}
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Información de Contacto
            </h2>
            <div className="space-y-2 font-sans text-sm">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground break-all">
                  {order.customerEmail}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">
                  {order.customerPhone}
                </span>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Dirección de Envío
            </h2>
            <div className="space-y-1 font-sans text-sm text-muted-foreground">
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingCity}, {order.shippingDepartment}
              </p>
              {order.deliveryNotes && (
                <p className="mt-2 text-xs">
                  <span className="font-medium">Notas:</span>{" "}
                  {order.deliveryNotes}
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Productos
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-beige-100">
                  {item.product.images && item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-beige-400" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-sans font-medium text-sm mb-1">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-muted-foreground font-sans">
                    Cantidad: {item.quantity} ×{" "}
                    {formatPrice(Number(item.price))}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="font-sans text-sm font-semibold">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Price Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                {formatPrice(Number(order.subtotal))}
              </span>
            </div>
            <div className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">Envío</span>
              <span className="font-medium">
                {formatPrice(Number(order.shippingCost))}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-sans">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary text-xl">
                {formatPrice(Number(order.total))}
              </span>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 mb-6 bg-primary/30">
          <h3 className="font-sans italic text-lg mb-3">¿Qué sigue?</h3>
          <ul className="space-y-2 font-sans text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>
                Recibirás un correo de confirmación en{" "}
                <strong>{order.customerEmail}</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>
                Te contactaremos por WhatsApp al{" "}
                <strong>{order.customerPhone}</strong> para coordinar la entrega
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>
                Tu pedido será preparado con amor y entregado en la dirección
                indicada
              </span>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/productos">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto font-sans"
            >
              Seguir Comprando
            </Button>
          </Link>
          <Link href="/inicio">
            <Button size="lg" className="w-full sm:w-auto font-sans">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
