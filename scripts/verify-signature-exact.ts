/**
 * Verificar firma exacta con los valores del orden
 */

import crypto from "crypto";

const INTEGRITY_SECRET = "test_integrity_V2jYY71Kpakey6fB2hh8SINUjEEyyhaI";

// Valores exactos del orden: total 3012000 COP
const reference = "ZAFTA-1234567890-TEST";
const totalCOP = 3012000;
const amountInCents = totalCOP * 100; // 301200000
const currency = "COP";

console.log("\n🔍 Verificación de Firma con Valores Exactos\n");
console.log("=".repeat(70));
console.log("\n📊 Valores del Pedido:");
console.log("  Total (COP):     ", totalCOP.toLocaleString("es-CO"));
console.log("  Centavos:        ", amountInCents.toLocaleString("es-CO"));
console.log("  Reference:       ", reference);
console.log("  Currency:        ", currency);

// Generar firma
const concatenated = `${reference}${amountInCents}${currency}${INTEGRITY_SECRET}`;
console.log("\n🔗 Cadena Concatenada:");
console.log("  Length:", concatenated.length);
console.log("  Value:", concatenated);

const signature = crypto
  .createHash("sha256")
  .update(concatenated)
  .digest("hex");

console.log("\n✨ Firma SHA256:");
console.log("  ", signature);

console.log("\n📦 Configuración del Widget:");
console.log(
  JSON.stringify(
    {
      currency,
      amountInCents,
      reference,
      publicKey: "pub_test_1uAGlrto4N7I2SmTnW4uKRvIlJdMl8MN",
      signature: {
        integrity: signature,
      },
    },
    null,
    2,
  ),
);

console.log("\n" + "=".repeat(70));
console.log("✅ Verificación completa\n");
