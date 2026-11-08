import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { WompiTransaction } from "@/lib/wompi/events";
import { applyWompiTransaction } from "@/lib/wompi/orders";

export const runtime = "nodejs";

const ORDER_REFERENCE_PREFIX = "ZAFTA-";
const WOMPI_ID_PATTERN = /^[A-Za-z0-9_-]{1,80}$/;

function wompiApiBaseUrl(): string {
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "";
  return publicKey.startsWith("pub_test_")
    ? "https://sandbox.wompi.co/v1"
    : "https://production.wompi.co/v1";
}

// Buscar por referencia exige una llave del comercio (la privada si existe, si no la pública).
function wompiAuthHeaders(): HeadersInit {
  const key =
    process.env.WOMPI_PRIVATE_KEY || process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
  return key ? { Authorization: `Bearer ${key}` } : {};
}

async function fetchTransactionById(
  id: string,
): Promise<WompiTransaction | null> {
  // Consultar una transacción por id no requiere llave.
  const response = await fetch(
    `${wompiApiBaseUrl()}/transactions/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    return null;
  }
  const payload = (await response.json()) as { data?: WompiTransaction };
  return payload.data ?? null;
}

async function fetchTransactionByReference(
  reference: string,
): Promise<WompiTransaction | null> {
  const response = await fetch(
    `${wompiApiBaseUrl()}/transactions?reference=${encodeURIComponent(reference)}`,
    { headers: wompiAuthHeaders(), cache: "no-store" },
  );
  if (!response.ok) {
    return null;
  }
  const payload = (await response.json()) as { data?: WompiTransaction[] };
  const transactions = (payload.data ?? []).filter(
    (transaction) => transaction.reference === reference,
  );
  // Si hubo varios intentos, el aprobado manda; si no, el último.
  return (
    transactions.find((transaction) => transaction.status === "APPROVED") ??
    transactions.at(-1) ??
    null
  );
}

/**
 * POST /api/wompi/verify-transaction
 * Consulta en Wompi el estado real del pago de un pedido y actualiza el pedido.
 * La página de confirmación lo llama mientras el pago figure como pendiente,
 * por si el webhook de Wompi aún no ha llegado.
 *
 * Body: { orderId: string, transactionId?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      orderId?: unknown;
      transactionId?: unknown;
    };

    const orderId = typeof body.orderId === "string" ? body.orderId : "";
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const unchanged = {
      updated: false,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
    };

    if (order.paymentStatus === "PAID" || !order.paymentTransactionId) {
      return NextResponse.json(unchanged);
    }

    const storedId = order.paymentTransactionId;
    const transactionId =
      typeof body.transactionId === "string" &&
      WOMPI_ID_PATTERN.test(body.transactionId)
        ? body.transactionId
        : null;

    let transaction: WompiTransaction | null = null;

    if (transactionId) {
      transaction = await fetchTransactionById(transactionId);
    } else if (storedId.startsWith(ORDER_REFERENCE_PREFIX)) {
      transaction = await fetchTransactionByReference(storedId);
    } else if (WOMPI_ID_PATTERN.test(storedId)) {
      transaction = await fetchTransactionById(storedId);
    }

    if (!transaction) {
      return NextResponse.json(unchanged);
    }

    // La transacción consultada debe ser la de este pedido.
    const belongsToOrder =
      transaction.reference === storedId || transaction.id === storedId;
    if (!belongsToOrder) {
      return NextResponse.json(
        { error: "Transaction does not belong to this order" },
        { status: 400 },
      );
    }

    const result = await applyWompiTransaction(order, transaction);

    return NextResponse.json({
      updated: result.updated,
      paymentStatus: result.paymentStatus,
      orderStatus: result.orderStatus,
      ...(result.amountMismatch && { amountMismatch: true }),
    });
  } catch (error) {
    console.error("Error verifying Wompi transaction:", error);
    return NextResponse.json(
      { error: "Error verifying transaction" },
      { status: 500 },
    );
  }
}
