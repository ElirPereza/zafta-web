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

    console.log("📦 Creating order with data:", {
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      itemsCount: body.items?.length,
    });

    // Validar campos requeridos
    if (!body.customerName || !body.customerEmail || !body.customerPhone) {
      console.error("❌ Missing required customer fields");
      return NextResponse.json(
        { error: "Faltan campos requeridos de cliente" },
        { status: 400 }
      );
    }

    if (!body.shippingAddress || !body.shippingCity) {
      console.error("❌ Missing required shipping fields");
      return NextResponse.json(
        { error: "Faltan campos requeridos de envío" },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      console.error("❌ No items in order");
      return NextResponse.json(
        { error: "El pedido debe tener al menos un producto" },
        { status: 400 }
      );
    }

    // Validar que todos los items tengan los campos requeridos
    for (const item of body.items) {
      if (!item.productId || !item.name || !item.price || !item.quantity) {
        console.error("❌ Invalid item data:", item);
        return NextResponse.json(
          { error: "Datos de producto incompletos" },
          { status: 400 }
        );
      }
    }

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `ZAFTA-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, "0")}`;

    console.log("🔢 Generated order number:", orderNumber);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: body.userId || null,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        shippingAddress: body.shippingAddress,
        shippingCity: body.shippingCity,
        shippingDepartment: body.shippingDepartment || "Cundinamarca",
        deliveryNotes: body.deliveryNotes || "",
        paymentMethod: body.paymentMethod || "WOMPI",
        subtotal: body.subtotal,
        shippingCost: body.shippingCost || 0,
        total: body.total,
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl || item.image || "",
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log("✅ Order created successfully:", order.id);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating order:", error);

    // Proporcionar más detalle del error
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);

    return NextResponse.json(
      {
        error: "Error creating order",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
