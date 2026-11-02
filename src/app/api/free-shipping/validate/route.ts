import { NextResponse } from "next/server";
import { getQualifyingFreeShippingRule } from "@/lib/shipping/free-shipping";

// POST /api/free-shipping/validate - Check if order qualifies for free shipping
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subtotal, city, department } = body;

    if (!subtotal || !city || !department) {
      return NextResponse.json(
        { error: "Subtotal, city, and department are required" },
        { status: 400 },
      );
    }

    // La regla activa de mayor prioridad que aplique gana
    const rule = await getQualifyingFreeShippingRule({
      subtotal,
      city,
      department,
    });

    if (rule) {
      return NextResponse.json({
        qualifies: true,
        rule: {
          id: rule.id,
          name: rule.name,
          type: rule.type,
        },
      });
    }

    return NextResponse.json({
      qualifies: false,
      rule: null,
    });
  } catch (error) {
    console.error("Error validating free shipping:", error);
    return NextResponse.json(
      { error: "Failed to validate free shipping" },
      { status: 500 },
    );
  }
}
