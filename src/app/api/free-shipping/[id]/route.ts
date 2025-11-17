import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET /api/free-shipping/[id] - Get single rule
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const rule = await prisma.freeShippingRule.findUnique({
      where: { id },
    });

    if (!rule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    return NextResponse.json({ rule });
  } catch (error) {
    console.error("Error fetching free shipping rule:", error);
    return NextResponse.json(
      { error: "Failed to fetch free shipping rule" },
      { status: 500 },
    );
  }
}

// PUT /api/free-shipping/[id] - Update rule
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    const rule = await prisma.freeShippingRule.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(minimumAmount !== undefined && {
          minimumAmount: minimumAmount ? parseFloat(minimumAmount) : null,
        }),
        ...(cities !== undefined && { cities }),
        ...(departments !== undefined && { departments }),
        ...(isActive !== undefined && { isActive }),
        ...(priority !== undefined && { priority }),
      },
    });

    return NextResponse.json({ rule });
  } catch (error) {
    console.error("Error updating free shipping rule:", error);
    return NextResponse.json(
      { error: "Failed to update free shipping rule" },
      { status: 500 },
    );
  }
}

// DELETE /api/free-shipping/[id] - Delete rule
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.freeShippingRule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting free shipping rule:", error);
    return NextResponse.json(
      { error: "Failed to delete free shipping rule" },
      { status: 500 },
    );
  }
}
