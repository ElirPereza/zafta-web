/**
 * Script para verificar la configuración de Wompi
 * Ejecutar con: bun run scripts/verify-wompi.ts
 */

const requiredEnvVars = [
  "NEXT_PUBLIC_WOMPI_PUBLIC_KEY",
  "WOMPI_INTEGRITY_SECRET",
  "WOMPI_EVENTS_SECRET",
  "NEXT_PUBLIC_APP_URL",
];

console.log("🔍 Verificando configuración de Wompi...\n");

let allConfigured = true;

for (const varName of requiredEnvVars) {
  const value = process.env[varName];
  const isConfigured =
    value && !value.includes("your_") && !value.includes("REEMPLAZA");

  if (isConfigured) {
    console.log(`✅ ${varName}: Configurado`);

    // Verificar formato
    if (varName === "NEXT_PUBLIC_WOMPI_PUBLIC_KEY") {
      if (value.startsWith("pub_test_") || value.startsWith("pub_prod_")) {
        console.log(
          `   ✓ Formato válido (${value.startsWith("pub_test_") ? "SANDBOX" : "PRODUCCIÓN"})`,
        );
      } else {
        console.log(
          `   ⚠️  Formato inválido. Debe empezar con pub_test_ o pub_prod_`,
        );
        allConfigured = false;
      }
    }

    if (varName === "WOMPI_INTEGRITY_SECRET") {
      if (value.includes("integrity")) {
        console.log(`   ✓ Formato válido`);
      } else {
        console.log(`   ⚠️  Debe contener 'integrity' en el nombre`);
      }
    }
  } else {
    console.log(`❌ ${varName}: NO configurado`);
    allConfigured = false;
  }
}

console.log("\n" + "=".repeat(50) + "\n");

if (allConfigured) {
  console.log("✅ ¡Configuración de Wompi completa!");
  console.log("\n📋 Próximos pasos:");
  console.log("1. Ejecuta: bun dev");
  console.log("2. Ve a: http://localhost:3000/productos");
  console.log("3. Agrega productos al carrito");
  console.log("4. Procede al checkout");
  console.log("5. Usa tarjeta de prueba: 4242 4242 4242 4242");
  console.log("\n🎉 ¡Listo para probar pagos!");
} else {
  console.log("⚠️  Configuración incompleta\n");
  console.log("📝 Pasos para configurar:");
  console.log("1. Regístrate en: https://comercios.wompi.co");
  console.log("2. Ve a: Settings > API Keys");
  console.log("3. Copia las credenciales de SANDBOX");
  console.log("4. Actualiza tu archivo .env con:");
  console.log("\n   NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_XXXX");
  console.log("   WOMPI_INTEGRITY_SECRET=test_integrity_XXXX");
  console.log("   WOMPI_EVENTS_SECRET=test_events_XXXX");
  console.log("\n5. Ejecuta nuevamente: bun run scripts/verify-wompi.ts");
}

process.exit(allConfigured ? 0 : 1);
