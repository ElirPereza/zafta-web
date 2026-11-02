import { NextRequest, NextResponse } from "next/server";
import { lookupDiscount } from "@/lib/discounts";

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

    const result = await lookupDiscount(code, customerEmail);

    if (!result.valid) {
      return NextResponse.json(
        { error: result.message },
        { status: result.reason === "ALREADY_USED" ? 400 : 404 },
      );
    }

    return NextResponse.json(
      {
        valid: true,
        discount: result.discount,
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
