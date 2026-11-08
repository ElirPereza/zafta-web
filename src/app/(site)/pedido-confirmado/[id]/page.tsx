import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { prisma } from "@/lib/prisma";

interface OrderConfirmationPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ id?: string | string[] }>;
}

export async function generateMetadata({
  params,
}: OrderConfirmationPageProps): Promise<Metadata> {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: { orderNumber: true },
  });

  if (!order) {
    return {
      title: "Pedido No Encontrado",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Pedido Confirmado - ${order.orderNumber} | Zafta`,
    description: `Tu pedido ${order.orderNumber} ha sido confirmado exitosamente. Gracias por tu compra en Zafta.`,
    robots: { index: false, follow: false }, // No indexar páginas de confirmación
  };
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: OrderConfirmationPageProps) {
  const { id } = await params;
  // Wompi redirige a esta página con ?id=<transacción>
  const { id: wompiTransactionId } = await searchParams;
  const transactionId =
    typeof wompiTransactionId === "string" ? wompiTransactionId : null;

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

  return <OrderConfirmation order={order} transactionId={transactionId} />;
}
