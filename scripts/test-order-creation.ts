/**
 * Test script para verificar creación de órdenes
 * Ejecutar con: bun run scripts/test-order-creation.ts
 */

import { prisma } from "../src/lib/prisma";

async function testOrderCreation() {
  console.log("🧪 Testing order creation...\n");

  try {
    // 1. Verificar conexión a base de datos
    console.log("1️⃣ Checking database connection...");
    await prisma.$connect();
    console.log("✅ Database connected\n");

    // 2. Verificar que existe al menos un producto
    console.log("2️⃣ Checking for products...");
    const product = await prisma.product.findFirst();

    if (!product) {
      console.error("❌ No products found in database");
      console.log("\n💡 Please create a product first in the admin panel:");
      console.log("   http://localhost:3000/admin/productos/nuevo");
      process.exit(1);
    }

    console.log(`✅ Found product: ${product.name} (${product.id})\n`);

    // 3. Crear orden de prueba
    console.log("3️⃣ Creating test order...");

    const orderCount = await prisma.order.count();
    const orderNumber = `ZAFTA-TEST-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, "0")}`;

    const testOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+57 300 123 4567",
        shippingAddress: "Calle 123 #45-67",
        shippingCity: "Bogotá",
        shippingDepartment: "Cundinamarca",
        deliveryNotes: "Test order - please ignore",
        paymentMethod: "WOMPI",
        subtotal: Number(product.price),
        shippingCost: 8000,
        total: Number(product.price) + 8000,
        items: {
          create: [
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              imageUrl: product.images[0] || "",
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    console.log(`✅ Order created successfully!`);
    console.log(`   Order Number: ${testOrder.orderNumber}`);
    console.log(`   Order ID: ${testOrder.id}`);
    console.log(`   Items: ${testOrder.items.length}`);
    console.log(`   Total: $${Number(testOrder.total).toLocaleString()}\n`);

    // 4. Verificar que se guardó correctamente
    console.log("4️⃣ Verifying order in database...");
    const savedOrder = await prisma.order.findUnique({
      where: { id: testOrder.id },
      include: { items: true },
    });

    if (!savedOrder) {
      console.error("❌ Order not found after creation");
      process.exit(1);
    }

    console.log(`✅ Order verified in database\n`);

    // 5. Cleanup (eliminar orden de prueba)
    console.log("5️⃣ Cleaning up test order...");
    await prisma.order.delete({
      where: { id: testOrder.id },
    });
    console.log("✅ Test order deleted\n");

    console.log("🎉 All tests passed! Order creation is working correctly.\n");
    console.log("📊 Summary:");
    console.log(`   - Database: Connected ✅`);
    console.log(`   - Products: Available ✅`);
    console.log(`   - Order Creation: Working ✅`);
    console.log(`   - Order Items: Working ✅`);
  } catch (error) {
    console.error("\n❌ Test failed!");
    console.error("\nError details:");
    console.error(error);

    if (error instanceof Error) {
      console.error("\nError message:", error.message);
      console.error("\nStack trace:", error.stack);
    }

    console.log("\n🔍 Common issues:");
    console.log("   1. DATABASE_URL not set in .env");
    console.log("   2. Database not accessible");
    console.log("   3. Prisma schema out of sync (run: bunx prisma generate)");
    console.log("   4. Missing required fields in schema");

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar test
testOrderCreation();
