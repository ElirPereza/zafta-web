import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

async function checkAdmin() {
  const user = await currentUser();

  if (!user) {
    return { authorized: false, error: "No autorizado" };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const userEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId,
  )?.emailAddress;

  if (
    !adminEmail ||
    !userEmail ||
    userEmail.toLowerCase() !== adminEmail.toLowerCase()
  ) {
    return { authorized: false, error: "No autorizado - Solo administradores" };
  }

  return { authorized: true };
}

// PUT /api/gallery/[id] - Update gallery image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await checkAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
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
    const auth = await checkAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
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
