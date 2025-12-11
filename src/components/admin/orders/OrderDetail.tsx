"use client";

import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  Product,
} from "@prisma/client";
import { ArrowLeft, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Pick<Product, "name" | "images">;
  })[];
};

interface OrderDetailProps {
  order: OrderWithItems;
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PREPARING: "En Preparación",
  IN_TRANSIT: "En Ruta",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado",
};

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-300",
  PREPARING: "bg-purple-100 text-purple-800 border-purple-300",
  IN_TRANSIT: "bg-indigo-100 text-indigo-800 border-indigo-300",
  DELIVERED: "bg-green-100 text-green-800 border-green-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-300",
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  PAID: "bg-green-100 text-green-800 border-green-300",
  FAILED: "bg-red-100 text-red-800 border-red-300",
  REFUNDED: "bg-gray-100 text-gray-800 border-gray-300",
};

export function OrderDetail({ order: initialOrder }: OrderDetailProps) {
  const [order, setOrder] = useState(initialOrder);
  const [updating, setUpdating] = useState(false);

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    // Formato simple sin espacio entre $ y número
    return `$${new Intl.NumberFormat("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice)}`;
  };

  const formatDate = (date: Date | string) => {
    const formatted = new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    // Replace "p. m." and "a. m." with non-breaking versions
    return formatted
      .replace(/p\.\s+m\./g, "p.m.")
      .replace(/a\.\s+m\./g, "a.m.");
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Error updating order status");
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error al actualizar el estado del pedido");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/admin/pedidos">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a pedidos
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Estado del Pedido</CardTitle>
              <CardDescription className="font-sans">
                Actualiza el estado para notificar al cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      handleStatusChange(value as OrderStatus)
                    }
                    disabled={updating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pendiente</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                      <SelectItem value="PREPARING">En Preparación</SelectItem>
                      <SelectItem value="IN_TRANSIT">En Ruta</SelectItem>
                      <SelectItem value="DELIVERED">Entregado</SelectItem>
                      <SelectItem value="CANCELLED">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Badge
                  variant="outline"
                  className={`font-sans ${ORDER_STATUS_COLORS[order.status]}`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>
              {updating && (
                <p className="text-sm text-muted-foreground font-sans">
                  Actualizando estado...
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Productos</CardTitle>
              <CardDescription className="font-sans">
                {order.items.length}{" "}
                {order.items.length === 1 ? "producto" : "productos"} en este
                pedido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 border border-beige-400 rounded-lg"
                  >
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-beige-100 shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : item.product.images &&
                        item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-sans font-medium text-sm sm:text-base">
                        {item.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <p className="font-sans font-medium text-sm">
                        {formatPrice(Number(item.price))}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                        Subtotal:{" "}
                        {formatPrice(Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground font-sans">
                  Nombre
                </p>
                <p className="font-sans font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-sans">Email</p>
                <p className="font-sans">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-sans">
                  Teléfono
                </p>
                <p className="font-sans">{order.customerPhone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Dirección de Envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-sans">
                {order.shippingAddress || "No especificada"}
              </p>
              {order.shippingCity && (
                <p className="text-sm font-sans">
                  {order.shippingCity}, {order.shippingDepartment}
                </p>
              )}
              {order.deliveryNotes && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-muted-foreground font-sans">
                    Notas:
                  </p>
                  <p className="text-sm font-sans">{order.deliveryNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-sans">
                  Método
                </p>
                <p className="font-sans font-medium">{order.paymentMethod}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-sans">
                  Estado
                </p>
                <Badge
                  variant="outline"
                  className={`font-sans ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}
                >
                  {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                </Badge>
              </div>
              {order.paymentTransactionId && (
                <div>
                  <p className="text-sm text-muted-foreground font-sans">
                    ID Transacción
                  </p>
                  <p className="text-sm font-sans font-mono">
                    {order.paymentTransactionId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-2 font-sans">
                <span className="text-muted-foreground text-sm">Subtotal</span>
                <span className="font-medium text-sm whitespace-nowrap">
                  {formatPrice(Number(order.subtotal))}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 font-sans">
                <span className="text-muted-foreground text-sm">Envío</span>
                <span className="font-medium text-sm whitespace-nowrap">
                  {formatPrice(Number(order.shippingCost))}
                </span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between gap-2 font-sans font-semibold">
                  <span className="text-sm">Total</span>
                  <span className="text-sm whitespace-nowrap">
                    {formatPrice(Number(order.total))}
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground font-sans pt-3 border-t mt-3 space-y-2">
                <div>
                  <p className="font-medium">Creado:</p>
                  <p className="text-foreground/80">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Actualizado:</p>
                  <p className="text-foreground/80">
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
