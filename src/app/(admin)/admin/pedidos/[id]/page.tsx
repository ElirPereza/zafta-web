import { OrderDetail } from "@/components/admin/orders/OrderDetail";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect("/auth/sign-in");
  }

  // Check if user is admin
  const userMetadata = await prisma.userMetadata.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (
    !userMetadata ||
    (userMetadata.role !== "ADMIN" && userMetadata.role !== "SUPER_ADMIN")
  ) {
    redirect("/inicio");
  }

  // Get order with items
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    redirect("/admin/pedidos");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-semibold text-foreground">
          Pedido {order.orderNumber}
        </h1>
        <p className="text-sm text-muted-foreground font-sans mt-1">
          Detalle completo del pedido
        </p>
      </div>

      {/* Order Detail */}
      <OrderDetail order={order} />
    </div>
  );
}
