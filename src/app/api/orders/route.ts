import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET - Get all orders (admin only)
export async function GET() {
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

    // Get all orders, sorted by most recent first
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}

// POST - Create a new order (public, will be called from checkout)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `ZAFTA-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, "0")}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: body.userId,
        userName: body.userName,
        userEmail: body.userEmail,
        userPhone: body.userPhone,
        shippingAddress: body.shippingAddress,
        paymentMethod: body.paymentMethod,
        subtotal: body.subtotal,
        shippingCost: body.shippingCost || 0,
        total: body.total,
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}
