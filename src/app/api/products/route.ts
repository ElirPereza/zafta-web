import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET - List all products (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");
    const category = searchParams.get("category");

    const where: {
      featured?: boolean;
      category?: string;
      inStock?: boolean;
    } = {};

    // Filter by featured status
    if (featured === "true") {
      where.featured = true;
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Only show in-stock products
    where.inStock = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
      take: limit ? Number.parseInt(limit) : undefined,
    });

    return NextResponse.json({ products, count: products.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 },
    );
  }
}

// POST - Create a new product (admin only)
export async function POST(request: Request) {
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

    const body = await request.json();

    // Validate required fields (category is now optional)
    if (!body.name || !body.slug || !body.price) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, price" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        price: body.price,
        comparePrice: body.comparePrice || null,
        images: body.images || [],
        category: body.category || null,
        inStock: body.inStock ?? true,
        featured: body.featured ?? false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 },
    );
  }
}
