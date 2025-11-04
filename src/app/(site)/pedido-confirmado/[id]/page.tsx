import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

interface OrderConfirmationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { id } = await params;

  // Fetch order from database
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
    notFound();
  }

  return <OrderConfirmation order={order} />;
}
