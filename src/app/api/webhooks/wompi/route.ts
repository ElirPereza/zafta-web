import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

interface WompiEvent {
  event: string;
  data: {
    transaction: {
      id: string;
      amount_in_cents: number;
      reference: string;
      customer_email: string;
      currency: string;
      payment_method_type: string;
      redirect_url: string;
      status: string; // APPROVED, DECLINED, ERROR, VOIDED
      shipping_address: string | null;
      payment_link_id: string | null;
      payment_source_id: number | null;
    };
  };
  sent_at: string;
}

/**
 * Verifica la firma del webhook de Wompi
 */
function verifyWompiSignature(payload: string, signature: string): boolean {
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET;

  if (!eventsSecret) {
    console.error("WOMPI_EVENTS_SECRET not configured");
    return false;
  }

  // Wompi usa SHA256 con el events secret
  const expectedSignature = crypto
    .createHash("sha256")
    .update(`${payload}${eventsSecret}`)
    .digest("hex");

  return signature === expectedSignature;
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-wompi-signature");
    const rawBody = await request.text();

    // Verificar firma del webhook
    if (!signature || !verifyWompiSignature(rawBody, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event: WompiEvent = JSON.parse(rawBody);

    // Solo procesar eventos de transacciones
    if (event.event !== "transaction.updated") {
      return NextResponse.json({ received: true });
    }

    const { transaction } = event.data;

    console.log(`Processing Wompi webhook: ${transaction.status} for reference: ${transaction.reference}, transaction_id: ${transaction.id}`);

    // Buscar la orden por el reference de Wompi (puede estar guardado como reference o como transaction.id)
    let order = await prisma.order.findFirst({
      where: {
        paymentTransactionId: transaction.reference,
      },
    });

    // Si no se encuentra por reference, buscar por transaction.id (por si ya se actualizó)
    if (!order) {
      order = await prisma.order.findFirst({
        where: {
          paymentTransactionId: transaction.id,
        },
      });
    }

    if (!order) {
      console.error(`Order not found for reference: ${transaction.reference} or transaction_id: ${transaction.id}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Actualizar estado del pago según el status de Wompi
    let paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED" = "PENDING";
    let orderStatus:
      | "PENDING"
      | "CONFIRMED"
      | "PREPARING"
      | "IN_TRANSIT"
      | "DELIVERED"
      | "CANCELLED" = order.status;

    switch (transaction.status) {
      case "APPROVED":
        paymentStatus = "PAID";
        orderStatus = "CONFIRMED"; // Cambiar orden a confirmada cuando el pago es exitoso
        break;
      case "DECLINED":
      case "ERROR":
        paymentStatus = "FAILED";
        break;
      case "VOIDED":
        paymentStatus = "REFUNDED";
        orderStatus = "CANCELLED";
        break;
      default:
        paymentStatus = "PENDING";
    }

    // Actualizar orden en la base de datos
    // NOTA: Mantenemos el reference original para poder recibir múltiples webhooks
    // Si ya tenemos el transaction.id guardado, no lo cambiamos
    const shouldUpdateTransactionId = order.paymentTransactionId === transaction.reference;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        status: orderStatus,
        // Solo actualizar el transaction ID si aún tenemos el reference guardado
        ...(shouldUpdateTransactionId && { paymentTransactionId: transaction.id }),
      },
    });

    console.log(`Order ${order.orderNumber} updated: paymentStatus=${paymentStatus}, orderStatus=${orderStatus}`);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
