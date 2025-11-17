import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// GET /api/discount-popup - Get active discount popup
export async function GET(request: NextRequest) {
  try {
    const now = new Date();

    const popup = await prisma.discountPopup.findFirst({
      where: {
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
    });

    return NextResponse.json({ popup }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener el popup de descuento" },
      { status: 500 },
    );
  }
}

// POST /api/discount-popup - Create new discount popup (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    // Check if user is authenticated and has admin role
    const userMetadata = await prisma.userMetadata.findUnique({
      where: { clerkId: user?.id },
    });

    if (
      !user ||
      !userMetadata ||
      (userMetadata.role !== "SUPER_ADMIN" && userMetadata.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const {
      title,
      description,
      discountCode,
      discountPercent,
      imageUrl,
      isActive,
      startDate,
      endDate,
    } = await request.json();

    // Validate required fields
    if (!title || !description || !discountCode || !discountPercent) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    // If setting this popup as active, deactivate all others
    if (isActive) {
      await prisma.discountPopup.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const popup = await prisma.discountPopup.create({
      data: {
        title,
        description,
        discountCode,
        discountPercent,
        imageUrl,
        isActive: isActive || false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json({ popup }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el popup de descuento" },
      { status: 500 },
    );
  }
}
