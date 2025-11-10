import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateTransactionReference,
  generateWompiSignature,
} from "@/lib/wompi/signature";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    // Obtener orden de la base de datos
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verificar que el pago no esté ya procesado
    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 },
      );
    }

    // Generar reference único para Wompi
    const wompiReference = generateTransactionReference();

    // Calcular amount en centavos
    const amountInCents = Math.round(Number(order.total) * 100);

    // Generar firma de integridad
    const signature = generateWompiSignature(wompiReference, amountInCents);

    // Actualizar orden con el wompi reference
    await prisma.order.update({
      where: { id: orderId },
      data: {
        // Guardar el reference de Wompi para poder identificar el pago después
        paymentTransactionId: wompiReference,
      },
    });

    // Procesar teléfono para Wompi (separar prefijo y número)
    // Remover espacios, guiones y el símbolo +
    let phoneNumber = order.customerPhone.replace(/[\s\-+]/g, "");
    let phonePrefix = "+57"; // Colombia por defecto

    // Si el número empieza con 57, extraerlo
    if (phoneNumber.startsWith("57")) {
      phoneNumber = phoneNumber.substring(2);
    }

    // Retornar datos para el widget de Wompi
    return NextResponse.json({
      publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
      currency: "COP",
      amountInCents,
      reference: wompiReference,
      signature,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pedido-confirmado/${orderId}`,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      customerPhone: phoneNumber,
      phoneNumberPrefix: phonePrefix,
    });
  } catch (error) {
    console.error("Error initializing Wompi transaction:", error);
    return NextResponse.json(
      { error: "Failed to initialize transaction" },
      { status: 500 },
    );
  }
}
