import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// GET /api/discount-popup/all - Get all discount popups (Admin only)
export async function GET(request: NextRequest) {
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

    const popups = await prisma.discountPopup.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ popups }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los popups" },
      { status: 500 },
    );
  }
}
