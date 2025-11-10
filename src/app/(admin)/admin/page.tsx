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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pedidos Totales",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "Pedidos realizados",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pedidos Pendientes",
      value: stats.pendingOrders,
      icon: ShoppingCart,
      description: "Requieren atención",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Ingresos Totales",
      value: `$${Number(stats.totalRevenue).toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`,
      icon: DollarSign,
      description: "Ventas confirmadas",
      color: "text-primary",
      bgColor: "bg-[hsl(var(--beige-300))]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-serif font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Resumen general de tu tienda ZAFTA
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="border-[hsl(var(--beige-400))]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-sans">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-serif">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
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
        <Card className="border-[hsl(var(--beige-400))]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif">Pedidos Recientes</CardTitle>
            <Link
              href="/admin/pedidos"
              className="text-sm font-sans text-primary hover:underline"
            >
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay pedidos recientes
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/pedidos/${order.id}`}
                    className="block hover:bg-[hsl(var(--beige-200))] p-3 rounded-lg transition-colors"
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
                        <p className="text-sm font-medium font-serif mt-1">
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
        <Card className="border-[hsl(var(--beige-400))]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif">Productos Más Vendidos</CardTitle>
            <Link
              href="/admin/productos"
              className="text-sm font-sans text-primary hover:underline"
            >
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay datos de ventas aún
              </p>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--beige-200))]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-sans font-medium text-sm">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
