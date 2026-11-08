import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWompiEvent, type WompiEvent } from "@/lib/wompi/events";
import { applyWompiTransaction } from "@/lib/wompi/orders";

export const runtime = "nodejs";

/**
 * Webhook de eventos de Wompi.
 * Wompi firma cada evento con el "Secreto para Eventos" (signature.checksum);
 * ver https://docs.wompi.co/docs/colombia/eventos/
 */
export async function POST(request: NextRequest) {
  try {
    let event: WompiEvent;
    try {
      event = (await request.json()) as WompiEvent;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!verifyWompiEvent(event, process.env.WOMPI_EVENTS_SECRET)) {
      console.error("Invalid Wompi event signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Solo procesar eventos de transacciones
    if (event.event !== "transaction.updated" || !event.data?.transaction) {
      return NextResponse.json({ received: true });
    }

    const { transaction } = event.data;

    console.log(
      `Processing Wompi webhook: ${transaction.status} for reference: ${transaction.reference}, transaction_id: ${transaction.id}`,
    );

    // El pedido guarda la referencia de Wompi hasta que se confirma; después guarda el id de la transacción.
    const order =
      (await prisma.order.findFirst({
        where: { paymentTransactionId: transaction.reference },
      })) ??
      (await prisma.order.findFirst({
        where: { paymentTransactionId: transaction.id },
      }));

    if (!order) {
      console.error(
        `Order not found for reference: ${transaction.reference} or transaction_id: ${transaction.id}`,
      );
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const result = await applyWompiTransaction(order, transaction);

    return NextResponse.json({
      received: true,
      ...(result.amountMismatch && { amountMismatch: true }),
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
