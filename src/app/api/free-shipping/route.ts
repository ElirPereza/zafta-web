import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET /api/free-shipping - Get all free shipping rules or active rules
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const rules = await prisma.freeShippingRule.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { priority: "desc" },
    });

    return NextResponse.json({ rules });
  } catch (error) {
    console.error("Error fetching free shipping rules:", error);
    return NextResponse.json(
      { error: "Failed to fetch free shipping rules" },
      { status: 500 },
    );
  }
}

// POST /api/free-shipping - Create new free shipping rule
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      type,
      minimumAmount,
      cities,
      departments,
      isActive,
      priority,
    } = body;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 },
      );
    }

    // Validate minimum amount for MINIMUM_PURCHASE type
    if (type === "MINIMUM_PURCHASE" && !minimumAmount) {
      return NextResponse.json(
        { error: "Minimum amount is required for MINIMUM_PURCHASE type" },
        { status: 400 },
      );
    }

    const rule = await prisma.freeShippingRule.create({
      data: {
        name,
        type,
        minimumAmount: minimumAmount ? parseFloat(minimumAmount) : null,
        cities: cities || [],
        departments: departments || [],
        isActive: isActive ?? true,
        priority: priority ?? 0,
      },
    });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    console.error("Error creating free shipping rule:", error);
    return NextResponse.json(
      { error: "Failed to create free shipping rule" },
      { status: 500 },
    );
  }
}
