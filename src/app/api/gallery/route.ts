import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// GET /api/gallery - Get all gallery images or filter by section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    const images = await prisma.galleryImage.findMany({
      where: {
        isActive: true,
        ...(section && { section: section as "PERSONALIZADAS" | "EVENTOS" }),
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener las imágenes" },
      { status: 500 },
    );
  }
}

// POST /api/gallery - Create a new gallery image (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Check if user is admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId,
    )?.emailAddress;

    if (
      !adminEmail ||
      !userEmail ||
      userEmail.toLowerCase() !== adminEmail.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "No autorizado - Solo administradores" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { imageUrl, alt, section, displayOrder } = body;

    if (!imageUrl || !alt || !section) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    const image = await prisma.galleryImage.create({
      data: {
        imageUrl,
        alt,
        section,
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear la imagen" },
      { status: 500 },
    );
  }
}
