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
      { status: 500 },
    );
  }
}

// POST - Create a new order (public, will be called from checkout)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Determinar método de entrega (default: DELIVERY para compatibilidad)
    const deliveryMethod = body.deliveryMethod || "DELIVERY";

    console.log("📦 Creating order with data:", {
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      deliveryMethod,
      itemsCount: body.items?.length,
    });

    // Validar campos requeridos
    if (
      !body.customerName ||
      !body.customerEmail ||
      !body.customerPhone ||
      !body.customerDocumentId
    ) {
      console.error("❌ Missing required customer fields");
      return NextResponse.json(
        { error: "Faltan campos requeridos de cliente" },
        { status: 400 },
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customerEmail)) {
      console.error("❌ Invalid email format");
      return NextResponse.json(
        { error: "El formato del correo electrónico no es válido" },
        { status: 400 },
      );
    }

    // Validar formato de cédula colombiana (6-10 dígitos)
    const cedulaRegex = /^\d{6,10}$/;
    if (!cedulaRegex.test(body.customerDocumentId)) {
      console.error("❌ Invalid document ID format");
      return NextResponse.json(
        { error: "La cédula de ciudadanía debe tener entre 6 y 10 dígitos" },
        { status: 400 },
      );
    }

    // Validar formato de teléfono colombiano (10 dígitos, empieza con 3)
    const phoneRegex = /^3\d{9}$/;
    const cleanPhone = body.customerPhone.replace(/\D/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      console.error("❌ Invalid phone format");
      return NextResponse.json(
        { error: "El teléfono debe ser un número celular colombiano válido (10 dígitos)" },
        { status: 400 },
      );
    }

    // Solo validar campos de envío si es DELIVERY
    if (deliveryMethod === "DELIVERY") {
      if (!body.shippingAddress || !body.shippingCity) {
        console.error("❌ Missing required shipping fields");
        return NextResponse.json(
          { error: "Faltan campos requeridos de envío" },
          { status: 400 },
        );
      }
    }

    if (!body.items || body.items.length === 0) {
      console.error("❌ No items in order");
      return NextResponse.json(
        { error: "El pedido debe tener al menos un producto" },
        { status: 400 },
      );
    }

    // Validar que todos los items tengan los campos requeridos
    for (const item of body.items) {
      if (!item.productId || !item.name || !item.price || !item.quantity) {
        console.error("❌ Invalid item data:", JSON.stringify(item, null, 2));
        console.error("❌ Missing fields:", {
          hasProductId: !!item.productId,
          hasName: !!item.name,
          hasPrice: !!item.price,
          hasQuantity: !!item.quantity,
        });
        return NextResponse.json(
          {
            error: "Datos de producto incompletos",
            details: `Producto sin ${!item.productId ? "productId" : !item.name ? "nombre" : !item.price ? "precio" : "cantidad"}`,
          },
          { status: 400 },
        );
      }

      // Validar que precio y cantidad sean números positivos
      if (typeof item.price !== "number" || item.price <= 0) {
        console.error("❌ Invalid item price:", item.price);
        return NextResponse.json(
          { error: "El precio del producto debe ser un número positivo" },
          { status: 400 },
        );
      }
      if (typeof item.quantity !== "number" || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
        console.error("❌ Invalid item quantity:", item.quantity);
        return NextResponse.json(
          { error: "La cantidad debe ser un número entero positivo" },
          { status: 400 },
        );
      }
    }

    // Validar totales numéricos positivos
    if (typeof body.subtotal !== "number" || body.subtotal <= 0) {
      console.error("❌ Invalid subtotal:", body.subtotal);
      return NextResponse.json(
        { error: "El subtotal debe ser un número positivo" },
        { status: 400 },
      );
    }
    if (typeof body.total !== "number" || body.total <= 0) {
      console.error("❌ Invalid total:", body.total);
      return NextResponse.json(
        { error: "El total debe ser un número positivo" },
        { status: 400 },
      );
    }
    if (body.shippingCost !== undefined && (typeof body.shippingCost !== "number" || body.shippingCost < 0)) {
      console.error("❌ Invalid shipping cost:", body.shippingCost);
      return NextResponse.json(
        { error: "El costo de envío debe ser un número no negativo" },
        { status: 400 },
      );
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
        customerDocumentId: body.customerDocumentId,
        deliveryMethod: deliveryMethod as "DELIVERY" | "PICKUP",
        shippingAddress: body.shippingAddress || null,
        shippingCity: body.shippingCity || null,
        shippingDepartment: body.shippingDepartment || null,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
        deliveryNotes: body.deliveryNotes || "",
        paymentMethod: body.paymentMethod || "WOMPI",
        subtotal: body.subtotal,
        shippingCost: deliveryMethod === "PICKUP" ? 0 : body.shippingCost || 0,
        discountCode: body.discountCode || null,
        discountAmount: body.discountAmount || 0,
        total: body.total,
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            sizeName: item.sizeName || null,
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);

    return NextResponse.json(
      {
        error: "Error creating order",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 },
    );
  }
}
