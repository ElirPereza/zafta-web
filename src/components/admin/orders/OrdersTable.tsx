"use client";

import type { Order, OrderStatus, PaymentStatus } from "@prisma/client";
import { Eye } from "lucide-react";
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
        <p className="text-muted-foreground font-sans">Cargando pedidos...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-beige-400 rounded-lg bg-beige-50">
        <h3 className="text-lg font-sans font-semibold text-foreground mb-2">
          No hay pedidos
        </h3>
        <p className="text-sm text-muted-foreground font-sans mb-4">
          Los pedidos aparecerán aquí cuando los clientes realicen compras
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-sans font-medium">
            Filtrar por estado:
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
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
        <div className="text-sm text-muted-foreground font-sans">
          {filteredOrders.length}{" "}
          {filteredOrders.length === 1 ? "pedido" : "pedidos"}
        </div>
      </div>

      {/* Table */}
      <div className="border border-beige-400 rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-beige-100">
              <TableHead className="font-sans font-semibold">Número</TableHead>
              <TableHead className="font-sans font-semibold">Cliente</TableHead>
              <TableHead className="font-sans font-semibold">Fecha</TableHead>
              <TableHead className="font-sans font-semibold">Total</TableHead>
              <TableHead className="font-sans font-semibold">
                Estado del Pedido
              </TableHead>
              <TableHead className="font-sans font-semibold">
                Estado del Pago
              </TableHead>
              <TableHead className="font-sans font-semibold text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-sans font-medium">
                  {order.orderNumber}
                </TableCell>
                <TableCell className="font-sans">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerEmail}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-sans text-sm">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="font-sans font-medium">
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
                    <Button variant="ghost" size="icon">
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
