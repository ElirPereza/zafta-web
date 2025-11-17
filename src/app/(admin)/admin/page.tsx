import { prisma } from "@/lib/prisma";
import { Package, ShoppingCart, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

async function getStats() {
  const [totalProducts, totalOrders, pendingOrders, totalRevenue] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({
        where: {
          status: {
            in: ["PENDING", "CONFIRMED", "PREPARING"],
          },
        },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: "PAID",
        },
        _sum: {
          total: true,
        },
      }),
    ]);

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total || 0,
  };
}

async function getRecentOrders() {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        take: 1,
      },
    },
  });

  return orders;
}

async function getTopProducts() {
  const products = await prisma.orderItem.groupBy({
    by: ["productId", "name"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  return products;
}

const statusConfig = {
  PENDING: { label: "Pendiente", variant: "secondary" as const },
  CONFIRMED: { label: "Confirmado", variant: "default" as const },
  PREPARING: { label: "Preparando", variant: "default" as const },
  IN_TRANSIT: { label: "En Camino", variant: "default" as const },
  DELIVERED: { label: "Entregado", variant: "default" as const },
  CANCELLED: { label: "Cancelado", variant: "destructive" as const },
};

const paymentStatusConfig = {
  PENDING: { label: "Pendiente", variant: "secondary" as const },
  PAID: { label: "Pagado", variant: "default" as const },
  FAILED: { label: "Fallido", variant: "destructive" as const },
  REFUNDED: { label: "Reembolsado", variant: "outline" as const },
};

export default async function AdminDashboard() {
  const [stats, recentOrders, topProducts] = await Promise.all([
    getStats(),
    getRecentOrders(),
    getTopProducts(),
  ]);

  const cards = [
    {
      title: "Total Productos",
      value: stats.totalProducts,
      icon: Package,
      description: "Productos en catálogo",
      color: "text-[hsl(var(--burgundy))]",
      bgColor:
        "bg-gradient-to-br from-[hsl(var(--rose-gold))]/20 to-[hsl(var(--rose-gold))]/10",
      borderColor: "border-[hsl(var(--rose-gold))]/30",
    },
    {
      title: "Pedidos Totales",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "Pedidos realizados",
      color: "text-[hsl(var(--burgundy))]",
      bgColor:
        "bg-gradient-to-br from-[hsl(var(--beige-200))] to-[hsl(var(--beige-100))]",
      borderColor: "border-[hsl(var(--beige-400))]",
    },
    {
      title: "Pedidos Pendientes",
      value: stats.pendingOrders,
      icon: ShoppingCart,
      description: "Requieren atención",
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
    },
    {
      title: "Ingresos Totales",
      value: `$${Number(stats.totalRevenue).toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`,
      icon: DollarSign,
      description: "Ventas confirmadas",
      color: "text-[hsl(var(--burgundy))]",
      bgColor:
        "bg-gradient-to-br from-[hsl(var(--burgundy))]/10 to-[hsl(var(--burgundy))]/5",
      borderColor: "border-[hsl(var(--burgundy))]/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-gotham font-bold text-[hsl(var(--burgundy))] mb-2">
          Dashboard
        </h1>
        <p className="text-[hsl(var(--burgundy))]/70 font-sans text-lg">
          Resumen general de tu tienda ZAFTA
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className={`${card.borderColor} border-2 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group`}
            >
              <div className={`absolute inset-0 ${card.bgColor} opacity-100`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-gotham font-medium text-[hsl(var(--burgundy))]">
                  {card.title}
                </CardTitle>
                <div className="p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-gotham font-bold text-[hsl(var(--burgundy))]">
                  {card.value}
                </div>
                <p className="text-xs text-[hsl(var(--burgundy))]/60 mt-1 font-sans">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border-[hsl(var(--beige-400))] border-2 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[hsl(var(--beige-100))] to-transparent pb-4">
            <CardTitle className="font-gotham font-semibold text-[hsl(var(--burgundy))]">
              Pedidos Recientes
            </CardTitle>
            <Link
              href="/admin/pedidos"
              className="text-sm font-sans text-[hsl(var(--burgundy))] hover:text-[hsl(var(--rose-gold))] transition-colors font-medium"
            >
              Ver todos →
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-[hsl(var(--burgundy))]/60 text-center py-8 font-sans">
                No hay pedidos recientes
              </p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/pedidos/${order.id}`}
                    className="block hover:bg-gradient-to-r hover:from-[hsl(var(--rose-gold))]/10 hover:to-transparent p-3 rounded-xl transition-all border border-[hsl(var(--beige-300))] hover:border-[hsl(var(--rose-gold))]/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-medium text-sm truncate">
                          Pedido #{order.orderNumber}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(order.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={statusConfig[order.status].variant}>
                          {statusConfig[order.status].label}
                        </Badge>
                        <Badge
                          variant={
                            paymentStatusConfig[order.paymentStatus].variant
                          }
                        >
                          {paymentStatusConfig[order.paymentStatus].label}
                        </Badge>
                        <p className="text-sm font-medium font-sans mt-1">
                          $
                          {Number(order.total).toLocaleString("es-CO", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-[hsl(var(--beige-400))] border-2 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[hsl(var(--beige-100))] to-transparent pb-4">
            <CardTitle className="font-gotham font-semibold text-[hsl(var(--burgundy))]">
              Productos Más Vendidos
            </CardTitle>
            <Link
              href="/admin/productos"
              className="text-sm font-sans text-[hsl(var(--burgundy))] hover:text-[hsl(var(--rose-gold))] transition-colors font-medium"
            >
              Ver todos →
            </Link>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-[hsl(var(--burgundy))]/60 text-center py-8 font-sans">
                No hay datos de ventas aún
              </p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[hsl(var(--beige-200))] to-[hsl(var(--beige-100))] border border-[hsl(var(--beige-300))] hover:border-[hsl(var(--rose-gold))]/40 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--burgundy))] to-[hsl(var(--burgundy))]/80 text-white font-gotham font-bold text-sm shadow-md">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-sans font-semibold text-sm text-[hsl(var(--burgundy))]">
                          {product.name}
                        </p>
                        <p className="text-xs text-[hsl(var(--burgundy))]/60">
                          {product._sum.quantity} unidades vendidas
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
