import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/discount-popup/validate - Validate discount code
export async function POST(request: NextRequest) {
  try {
    const { code, customerEmail } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Código de descuento requerido" },
        { status: 400 },
      );
    }

    const now = new Date();

    // Check if this email has already used this discount code
    if (customerEmail) {
      const existingOrder = await prisma.order.findFirst({
        where: {
          customerEmail: customerEmail,
          discountCode: code.toUpperCase(),
        },
      });

      if (existingOrder) {
        return NextResponse.json(
          { error: "Este código ya fue utilizado en una compra anterior" },
          { status: 400 },
        );
      }
    }

    // Find active discount with matching code
    const popup = await prisma.discountPopup.findFirst({
      where: {
        discountCode: code.toUpperCase(),
        isActive: true,
        OR: [
          // Case 1: Both dates are null (always active)
          {
            AND: [{ startDate: null }, { endDate: null }],
          },
          // Case 2: Only startDate is set (active after start)
          {
            AND: [{ startDate: { lte: now } }, { endDate: null }],
          },
          // Case 3: Only endDate is set (active until end)
          {
            AND: [{ startDate: null }, { endDate: { gte: now } }],
          },
          // Case 4: Both dates are set (active in range)
          {
            AND: [{ startDate: { lte: now } }, { endDate: { gte: now } }],
          },
        ],
      },
      select: {
        id: true,
        discountCode: true,
        discountPercent: true,
        title: true,
      },
    });

    if (!popup) {
      return NextResponse.json(
        { error: "Código de descuento inválido o expirado" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        valid: true,
        discount: {
          code: popup.discountCode,
          percent: popup.discountPercent,
          title: popup.title,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error validating discount code:", error);
    return NextResponse.json(
      { error: "Error al validar el código de descuento" },
      { status: 500 },
    );
  }
}
