import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PricingError, priceOrder } from "@/lib/orders/pricing";
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

    if (deliveryMethod !== "DELIVERY" && deliveryMethod !== "PICKUP") {
      return NextResponse.json(
        { error: "Método de entrega inválido" },
        { status: 400 },
      );
    }

    // Solo validar campos de envío si es DELIVERY
    if (deliveryMethod === "DELIVERY") {
      if (
        !body.shippingAddress ||
        !body.shippingCity ||
        !body.shippingDepartment
      ) {
        console.error("❌ Missing required shipping fields");
        return NextResponse.json(
          { error: "Faltan campos requeridos de envío" },
          { status: 400 },
        );
      }
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      console.error("❌ No items in order");
      return NextResponse.json(
        { error: "El pedido debe tener al menos un producto" },
        { status: 400 },
      );
    }

    // Validar que todos los items tengan producto y cantidad.
    // El precio que envía el navegador se ignora: se toma del catálogo.
    for (const item of body.items) {
      if (!item?.productId || typeof item.productId !== "string") {
        console.error("❌ Invalid item data:", JSON.stringify(item, null, 2));
        return NextResponse.json(
          {
            error: "Datos de producto incompletos",
            details: "Producto sin productId",
          },
          { status: 400 },
        );
      }
      if (
        typeof item.quantity !== "number" ||
        item.quantity <= 0 ||
        !Number.isInteger(item.quantity)
      ) {
        console.error("❌ Invalid item quantity:", item.quantity);
        return NextResponse.json(
          { error: "La cantidad debe ser un número entero positivo" },
          { status: 400 },
        );
      }
    }

    // Recalcular precios, envío, descuento y total en el servidor
    let pricing: Awaited<ReturnType<typeof priceOrder>>;
    try {
      pricing = await priceOrder({
        items: body.items.map((item: Record<string, unknown>) => ({
          productId: item.productId as string,
          sizeName: (item.sizeName as string | undefined) || null,
          quantity: item.quantity as number,
          imageUrl: ((item.imageUrl || item.image) as string | undefined) || null,
        })),
        deliveryMethod,
        city: deliveryMethod === "DELIVERY" ? body.shippingCity : null,
        department: deliveryMethod === "DELIVERY" ? body.shippingDepartment : null,
        discountCode: body.discountCode || null,
        customerEmail: body.customerEmail,
      });
    } catch (error) {
      if (error instanceof PricingError) {
        console.error("❌ Pricing error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }

    if (pricing.total <= 0) {
      console.error("❌ Invalid computed total:", pricing.total);
      return NextResponse.json(
        { error: "El total del pedido debe ser mayor a cero" },
        { status: 400 },
      );
    }

    // Si el navegador mostraba otro monto (carrito viejo, precio cambiado o
    // manipulación), se registra y se cobra el valor calculado en el servidor.
    if (typeof body.total === "number" && body.total !== pricing.total) {
      console.warn("⚠️ Client total differs from server total", {
        clientTotal: body.total,
        serverTotal: pricing.total,
        clientShipping: body.shippingCost,
        serverShipping: pricing.shippingCost,
        clientDiscount: body.discountAmount,
        serverDiscount: pricing.discountAmount,
      });
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
        subtotal: pricing.subtotal,
        shippingCost: pricing.shippingCost,
        discountCode: pricing.discountCode,
        discountAmount: pricing.discountAmount,
        total: pricing.total,
        items: {
          create: pricing.lines.map((line) => ({
            productId: line.productId,
            name: line.name,
            sizeName: line.sizeName,
            price: line.price,
            quantity: line.quantity,
            imageUrl: line.imageUrl,
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
