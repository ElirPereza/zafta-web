"use client";

import type { Order, OrderStatus, PaymentStatus } from "@prisma/client";
import { Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type OrderWithDetails = Order;

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
  PENDING:
    "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-300 shadow-sm",
  CONFIRMED:
    "bg-gradient-to-r from-[hsl(var(--rose-gold))]/20 to-[hsl(var(--rose-gold))]/10 text-[hsl(var(--rose-gold))] border-[hsl(var(--rose-gold))]/40 shadow-sm",
  PREPARING:
    "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-300 shadow-sm",
  IN_TRANSIT:
    "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-300 shadow-sm",
  DELIVERED:
    "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-300 shadow-sm",
  CANCELLED:
    "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-300 shadow-sm",
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  PENDING:
    "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-300 shadow-sm",
  PAID: "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-300 shadow-sm",
  FAILED:
    "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-300 shadow-sm",
  REFUNDED:
    "bg-gradient-to-r from-[hsl(var(--beige-200))] to-[hsl(var(--beige-100))] text-[hsl(var(--rose-gold))]/70 border-[hsl(var(--beige-400))] shadow-sm",
};

export function OrdersTable() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[hsl(var(--rose-gold))]/30 border-t-[hsl(var(--rose-gold))] rounded-full animate-spin" />
          <p className="text-[hsl(var(--rose-gold))]/70 font-sans">
            Cargando pedidos...
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="relative overflow-hidden text-center py-12 border-2 border-dashed border-[hsl(var(--beige-400))] rounded-xl bg-gradient-to-br from-[hsl(var(--beige-50))] to-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--rose-gold))]/5 to-transparent" />
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--rose-gold))]/20 to-[hsl(var(--rose-gold))]/10 mb-4">
            <ShoppingCart className="h-8 w-8 text-[hsl(var(--rose-gold))]" />
          </div>
          <h3 className="text-lg font-gotham font-semibold text-[hsl(var(--rose-gold))] mb-2">
            No hay pedidos
          </h3>
          <p className="text-sm text-[hsl(var(--rose-gold))]/60 font-sans">
            Los pedidos aparecerán aquí cuando los clientes realicen compras
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-gradient-to-br from-[hsl(var(--beige-50))] to-white border border-[hsl(var(--beige-400))]/50 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-sm font-gotham font-medium text-[hsl(var(--rose-gold))]">
            Filtrar por estado:
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px] border-[hsl(var(--beige-400))] focus:ring-[hsl(var(--rose-gold))]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="PENDING">Pendientes</SelectItem>
              <SelectItem value="CONFIRMED">Confirmados</SelectItem>
              <SelectItem value="PREPARING">En Preparación</SelectItem>
              <SelectItem value="IN_TRANSIT">En Ruta</SelectItem>
              <SelectItem value="DELIVERED">Entregados</SelectItem>
              <SelectItem value="CANCELLED">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-[hsl(var(--rose-gold))]/70 font-sans">
          <span className="font-semibold text-[hsl(var(--rose-gold))]">
            {filteredOrders.length}
          </span>{" "}
          {filteredOrders.length === 1 ? "pedido" : "pedidos"}
        </div>
      </div>

      {/* Table */}
      <div className="border-2 border-[hsl(var(--beige-400))] rounded-xl overflow-hidden bg-white shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[hsl(var(--beige-100))] to-[hsl(var(--beige-50))] hover:from-[hsl(var(--beige-200))] hover:to-[hsl(var(--beige-100))]">
              <TableHead className="font-gotham font-semibold text-[hsl(var(--rose-gold))]">
                Número
              </TableHead>
              <TableHead className="font-gotham font-semibold text-[hsl(var(--rose-gold))]">
                Cliente
              </TableHead>
              <TableHead className="font-gotham font-semibold text-[hsl(var(--rose-gold))]">
                Fecha
              </TableHead>
              <TableHead className="font-gotham font-semibold text-[hsl(var(--rose-gold))]">
                Total
              </TableHead>
              <TableHead className="font-gotham font-semibold text-[hsl(var(--rose-gold))]">
                Estado del Pedido
              </TableHead>
              <TableHead className="font-gotham font-semibold text-[hsl(var(--rose-gold))]">
                Estado del Pago
              </TableHead>
              <TableHead className="font-gotham font-semibold text-[hsl(var(--rose-gold))] text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-gradient-to-r hover:from-[hsl(var(--rose-gold))]/5 hover:to-transparent transition-colors border-b border-[hsl(var(--beige-300))]/50"
              >
                <TableCell className="font-sans font-semibold text-[hsl(var(--rose-gold))]">
                  #{order.orderNumber}
                </TableCell>
                <TableCell className="font-sans">
                  <div>
                    <p className="font-medium text-[hsl(var(--rose-gold))]">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-[hsl(var(--rose-gold))]/60">
                      {order.customerEmail}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-sans text-sm text-[hsl(var(--rose-gold))]/70">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="font-sans font-semibold text-[hsl(var(--rose-gold))]">
                  {formatPrice(Number(order.total))}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`font-sans ${ORDER_STATUS_COLORS[order.status]}`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`font-sans ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}
                  >
                    {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/pedidos/${order.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-[hsl(var(--rose-gold))]/20 hover:text-[hsl(var(--rose-gold))] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
