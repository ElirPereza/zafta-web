import { prisma } from "@/lib/prisma";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getStats() {
  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    totalRevenue,
  ] = await Promise.all([
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

export default async function AdminDashboard() {
  const stats = await getStats();

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
                <div className="text-2xl font-bold font-serif">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Section - Placeholder */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[hsl(var(--beige-400))]">
          <CardHeader>
            <CardTitle className="font-serif">Pedidos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Los pedidos recientes aparecerán aquí
            </p>
          </CardContent>
        </Card>

        <Card className="border-[hsl(var(--beige-400))]">
          <CardHeader>
            <CardTitle className="font-serif">Productos Destacados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Los productos más vendidos aparecerán aquí
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
