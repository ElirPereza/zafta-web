import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

// PUT /api/gallery/[id] - Update gallery image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) {
      return admin.response;
    }

    const { id } = await params;
    const body = await request.json();
    const { imageUrl, alt, section, displayOrder, isActive } = body;

    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(imageUrl !== undefined && { imageUrl }),
        ...(alt !== undefined && { alt }),
        ...(section !== undefined && { section }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ image }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar la imagen" },
      { status: 500 },
    );
  }
}

// DELETE /api/gallery/[id] - Delete gallery image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) {
      return admin.response;
    }

    const { id } = await params;

    await prisma.galleryImage.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Imagen eliminada correctamente" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar la imagen" },
      { status: 500 },
    );
  }
}
