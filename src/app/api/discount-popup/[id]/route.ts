import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// PUT /api/discount-popup/[id] - Update discount popup
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
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

    // If setting this popup as active, deactivate all others
    if (isActive) {
      await prisma.discountPopup.updateMany({
        where: { isActive: true, NOT: { id } },
        data: { isActive: false },
      });
    }

    const popup = await prisma.discountPopup.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(discountCode !== undefined && { discountCode }),
        ...(discountPercent !== undefined && { discountPercent }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(startDate !== undefined && {
          startDate: startDate ? new Date(startDate) : null,
        }),
        ...(endDate !== undefined && {
          endDate: endDate ? new Date(endDate) : null,
        }),
      },
    });

    return NextResponse.json({ popup }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el popup" },
      { status: 500 },
    );
  }
}

// DELETE /api/discount-popup/[id] - Delete discount popup
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    await prisma.discountPopup.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Popup eliminado correctamente" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el popup" },
      { status: 500 },
    );
  }
}
