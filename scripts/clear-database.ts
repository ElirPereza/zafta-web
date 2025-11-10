/**
 * Script para limpiar completamente la base de datos
 * ADVERTENCIA: Este script eliminará TODOS los datos de:
 * - Productos
 * - Pedidos (Orders)
 * - Items de pedidos (OrderItems)
 * - Facturas (Invoices)
 *
 * NO eliminará: UserMetadata (usuarios de Clerk)
 *
 * Ejecutar con: bun run scripts/clear-database.ts
 */

import { prisma } from "../src/lib/prisma";

async function clearDatabase() {
  console.log("\n🗑️  LIMPIEZA DE BASE DE DATOS\n");
  console.log("=" .repeat(60));
  console.log("\n⚠️  ADVERTENCIA: Esto eliminará TODOS los datos de:");
  console.log("   - Productos");
  console.log("   - Pedidos y sus items");
  console.log("   - Facturas");
  console.log("\n");

  try {
    // 1. Eliminar Facturas (Invoices)
    console.log("🗑️  Eliminando facturas...");
    const invoicesDeleted = await prisma.invoice.deleteMany({});
    console.log(`   ✅ ${invoicesDeleted.count} facturas eliminadas`);

    // 2. Eliminar Items de Pedidos (OrderItems)
    // Esto se hace automáticamente por el onDelete: Cascade en el schema
    console.log("\n🗑️  Eliminando items de pedidos...");
    const orderItemsDeleted = await prisma.orderItem.deleteMany({});
    console.log(`   ✅ ${orderItemsDeleted.count} items de pedidos eliminados`);

    // 3. Eliminar Pedidos (Orders)
    console.log("\n🗑️  Eliminando pedidos...");
    const ordersDeleted = await prisma.order.deleteMany({});
    console.log(`   ✅ ${ordersDeleted.count} pedidos eliminados`);

    // 4. Eliminar Productos (Products)
    console.log("\n🗑️  Eliminando productos...");
    const productsDeleted = await prisma.product.deleteMany({});
    console.log(`   ✅ ${productsDeleted.count} productos eliminados`);

    console.log("\n" + "=".repeat(60));
    console.log("\n✅ Base de datos limpiada exitosamente!\n");
    console.log("📊 Resumen:");
    console.log(`   - Facturas eliminadas:        ${invoicesDeleted.count}`);
    console.log(`   - Items eliminados:           ${orderItemsDeleted.count}`);
    console.log(`   - Pedidos eliminados:         ${ordersDeleted.count}`);
    console.log(`   - Productos eliminados:       ${productsDeleted.count}`);
    console.log("\n");

  } catch (error) {
    console.error("\n❌ Error al limpiar la base de datos:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
clearDatabase()
  .then(() => {
    console.log("✅ Proceso completado\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
