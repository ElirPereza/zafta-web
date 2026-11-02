import { prisma } from "@/lib/prisma";

export type DiscountLookup =
  | {
      valid: true;
      discount: { code: string; percent: number; title: string };
    }
  | { valid: false; reason: "ALREADY_USED" | "NOT_FOUND"; message: string };

/**
 * Valida un código de descuento: debe estar activo, dentro de sus fechas
 * y no haber sido usado antes por el mismo correo.
 *
 * `onlyPaidOrdersCountAsUsed`: al crear el pedido, un intento anterior sin
 * pagar (pago fallido que el cliente reintenta) no cuenta como uso.
 */
export async function lookupDiscount(
  code: string,
  customerEmail?: string | null,
  { onlyPaidOrdersCountAsUsed = false } = {},
): Promise<DiscountLookup> {
  const normalizedCode = code.toUpperCase();
  const now = new Date();

  if (customerEmail) {
    const existingOrder = await prisma.order.findFirst({
      where: {
        customerEmail,
        discountCode: normalizedCode,
        ...(onlyPaidOrdersCountAsUsed && { paymentStatus: "PAID" as const }),
      },
      select: { id: true },
    });

    if (existingOrder) {
      return {
        valid: false,
        reason: "ALREADY_USED",
        message: "Este código ya fue utilizado en una compra anterior",
      };
    }
  }

  const popup = await prisma.discountPopup.findFirst({
    where: {
      discountCode: normalizedCode,
      isActive: true,
      OR: [
        // Sin fechas: siempre activo
        { AND: [{ startDate: null }, { endDate: null }] },
        // Solo fecha de inicio
        { AND: [{ startDate: { lte: now } }, { endDate: null }] },
        // Solo fecha de fin
        { AND: [{ startDate: null }, { endDate: { gte: now } }] },
        // Ambas fechas
        { AND: [{ startDate: { lte: now } }, { endDate: { gte: now } }] },
      ],
    },
    select: { discountCode: true, discountPercent: true, title: true },
  });

  if (!popup) {
    return {
      valid: false,
      reason: "NOT_FOUND",
      message: "Código de descuento inválido o expirado",
    };
  }

  return {
    valid: true,
    discount: {
      code: popup.discountCode,
      percent: popup.discountPercent,
      title: popup.title,
    },
  };
}
