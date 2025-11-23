import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Get a single product (public)
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        sizes: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 },
    );
  }
}

// PUT - Update a product (admin only)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userMetadata = await prisma.userMetadata.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (
      !userMetadata ||
      (userMetadata.role !== "ADMIN" && userMetadata.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    // Update product and handle sizes in a transaction
    const product = await prisma.$transaction(async (tx) => {
      // Delete existing sizes
      await tx.productSize.deleteMany({
        where: { productId: id },
      });

      // Update product and create new sizes
      return tx.product.update({
        where: { id },
        data: {
          name: body.name,
          slug: body.slug,
          description: body.description || null,
          price: body.price,
          comparePrice: body.comparePrice || null,
          images: body.images || [],
          category: body.category,
          inStock: body.inStock ?? true,
          featured: body.featured ?? false,
          sizes: body.sizes?.length
            ? {
                create: body.sizes.map(
                  (size: {
                    name: string;
                    price: number;
                    displayOrder: number;
                  }) => ({
                    name: size.name,
                    price: size.price,
                    displayOrder: size.displayOrder,
                  }),
                ),
              }
            : undefined,
        },
        include: {
          sizes: {
            orderBy: { displayOrder: "asc" },
          },
        },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a product (admin only)
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userMetadata = await prisma.userMetadata.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (
      !userMetadata ||
      (userMetadata.role !== "ADMIN" && userMetadata.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 },
    );
  }
}
