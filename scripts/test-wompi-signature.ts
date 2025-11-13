/**
 * Script de prueba para verificar la generación de firma de Wompi
 * Ejecutar con: bun run scripts/test-wompi-signature.ts
 */

import crypto from "crypto";

// Cargar variables de entorno
const INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET;

console.log("\n🔐 TEST: Generación de Firma Wompi\n");
console.log("=".repeat(60));

if (!INTEGRITY_SECRET) {
  console.error("❌ ERROR: WOMPI_INTEGRITY_SECRET no está configurado");
  process.exit(1);
}

console.log("✅ Integrity Secret encontrado:", INTEGRITY_SECRET);

// Ejemplo con los datos que mencionaste
const testReference = "ZAFTA-TEST-12345";
const testAmountInCents = 301200000; // 3,012,000 COP = 301,200,000 centavos
const testCurrency = "COP";

console.log("\n📋 Datos de Prueba:");
console.log("  Reference:", testReference);
console.log("  Amount (COP):", 3012000);
console.log("  Amount (cents):", testAmountInCents);
console.log("  Currency:", testCurrency);

// Generar firma
const concatenated = `${testReference}${testAmountInCents}${testCurrency}${INTEGRITY_SECRET}`;
console.log("\n🔗 Cadena Concatenada:");
console.log("  ", concatenated);

const signature = crypto
  .createHash("sha256")
  .update(concatenated)
  .digest("hex");

console.log("\n✨ Firma Generada:");
console.log("  ", signature);

console.log("\n" + "=".repeat(60));

// Probar también con el formato del widget
console.log("\n📦 Formato para Widget de Wompi:");
console.log(
  JSON.stringify(
    {
      currency: testCurrency,
      amountInCents: testAmountInCents,
      reference: testReference,
      signature: {
        integrity: signature,
      },
    },
    null,
    2,
  ),
);

console.log("\n✅ Test completado\n");
