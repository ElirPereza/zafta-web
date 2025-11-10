import crypto from "crypto";

/**
 * Genera la firma de integridad para transacciones de Wompi
 * La firma se calcula concatenando: reference + amount + currency + integritySecret
 * y aplicando SHA256
 */
export function generateWompiSignature(
  reference: string,
  amountInCents: number,
  currency: string = "COP",
): string {
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

  if (!integritySecret) {
    throw new Error(
      "WOMPI_INTEGRITY_SECRET no está configurado en las variables de entorno",
    );
  }

  // Asegurar que amountInCents es un entero sin decimales
  const amountInteger = Math.floor(amountInCents);

  // Concatenar según la especificación de Wompi
  // IMPORTANTE: No agregar espacios ni separadores entre los valores
  const concatenatedText = `${reference}${amountInteger}${currency}${integritySecret}`;

  // Generar hash SHA256
  const signature = crypto
    .createHash("sha256")
    .update(concatenatedText)
    .digest("hex");

  return signature;
}

/**
 * Genera un reference único para la transacción
 * Formato: ZAFTA-{TIMESTAMP}-{RANDOM}
 */
export function generateTransactionReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ZAFTA-${timestamp}-${random}`;
}
