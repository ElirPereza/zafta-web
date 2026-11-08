import type { Order, OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { WompiTransaction } from "./events";

export interface ApplyWompiResult {
  /** true si el pedido cambió en la base de datos */
  updated: boolean;
  /** true si Wompi cobró un monto distinto al total del pedido */
  amountMismatch: boolean;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
}

/** Monto en centavos que se le pide a Wompi (misma fórmula que /api/wompi/init-transaction). */
export function expectedAmountInCents(total: Order["total"]): number {
  return Math.floor(Number(total) * 100);
}

/** Traduce el estado de una transacción de Wompi al estado del pedido. */
export function mapWompiStatus(
  transactionStatus: string,
  currentOrderStatus: OrderStatus,
): { paymentStatus: PaymentStatus; orderStatus: OrderStatus } {
  switch (transactionStatus) {
    case "APPROVED":
      return { paymentStatus: "PAID", orderStatus: "CONFIRMED" };
    case "DECLINED":
    case "ERROR":
      return { paymentStatus: "FAILED", orderStatus: currentOrderStatus };
    case "VOIDED":
      return { paymentStatus: "REFUNDED", orderStatus: "CANCELLED" };
    default:
      return { paymentStatus: "PENDING", orderStatus: currentOrderStatus };
  }
}

/**
 * Aplica al pedido el resultado de una transacción de Wompi ya verificada
 * (por firma del webhook o consultada directamente en la API de Wompi).
 *
 * - Un pago APROBADO solo confirma el pedido si el monto y la moneda coinciden.
 * - Un pedido ya pagado no vuelve a pendiente/fallido por un evento viejo o repetido.
 */
export async function applyWompiTransaction(
  order: Order,
  transaction: WompiTransaction,
): Promise<ApplyWompiResult> {
  const unchanged: ApplyWompiResult = {
    updated: false,
    amountMismatch: false,
    paymentStatus: order.paymentStatus,
    orderStatus: order.status,
  };

  if (transaction.status === "APPROVED") {
    const expected = expectedAmountInCents(order.total);
    if (
      transaction.amount_in_cents !== expected ||
      transaction.currency !== "COP"
    ) {
      console.error(
        `🚨 Amount mismatch for order ${order.orderNumber}: paid ${transaction.amount_in_cents} ${transaction.currency}, expected ${expected} COP. Order NOT marked as paid.`,
      );
      return { ...unchanged, amountMismatch: true };
    }
  }

  const { paymentStatus, orderStatus } = mapWompiStatus(
    transaction.status,
    order.status,
  );

  if (order.paymentStatus === "PAID" && paymentStatus !== "REFUNDED") {
    return unchanged;
  }

  if (
    paymentStatus === order.paymentStatus &&
    orderStatus === order.status &&
    order.paymentTransactionId !== transaction.reference
  ) {
    return unchanged;
  }

  // Mientras el pedido guarde la referencia, la reemplazamos por el id de la transacción.
  const shouldUpdateTransactionId =
    order.paymentTransactionId === transaction.reference;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus,
      status: orderStatus,
      ...(shouldUpdateTransactionId && {
        paymentTransactionId: transaction.id,
      }),
    },
  });

  console.log(
    `Order ${order.orderNumber} updated: paymentStatus=${paymentStatus}, orderStatus=${orderStatus}`,
  );

  return { updated: true, amountMismatch: false, paymentStatus, orderStatus };
}
