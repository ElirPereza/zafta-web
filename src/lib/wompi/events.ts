import crypto from "node:crypto";

/** Transacción tal como la envía Wompi en sus eventos y en su API. */
export interface WompiTransaction {
  id: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string | null;
  currency: string;
  payment_method_type: string | null;
  redirect_url: string | null;
  status: string; // APPROVED, DECLINED, ERROR, VOIDED, PENDING
  shipping_address: unknown;
  payment_link_id: string | null;
  payment_source_id: number | null;
}

/**
 * Evento (webhook) de Wompi.
 * Ver https://docs.wompi.co/docs/colombia/eventos/
 */
export interface WompiEvent {
  event: string;
  data: { transaction?: WompiTransaction } & Record<string, unknown>;
  environment?: string;
  signature?: { properties?: unknown; checksum?: unknown };
  timestamp?: unknown;
  sent_at?: string;
}

function readPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object") {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

/**
 * Calcula el checksum de un evento como lo define Wompi:
 * SHA256( valores de signature.properties en orden + timestamp + secreto de eventos ),
 * sin separadores, en hexadecimal.
 *
 * Devuelve null si el evento no trae lo necesario para calcularlo.
 */
export function computeWompiEventChecksum(
  event: WompiEvent,
  eventsSecret: string,
): string | null {
  const properties = event.signature?.properties;
  const timestamp = event.timestamp;

  if (
    !Array.isArray(properties) ||
    properties.some((property) => typeof property !== "string")
  ) {
    return null;
  }

  if (typeof timestamp !== "number" && typeof timestamp !== "string") {
    return null;
  }

  let text = "";
  for (const property of properties as string[]) {
    const value = readPath(event.data, property);
    if (value === undefined || value === null) {
      return null;
    }
    text += String(value);
  }
  text += `${timestamp}${eventsSecret}`;

  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

/**
 * Verifica que un evento realmente venga de Wompi comparando su checksum
 * (signature.checksum) con el calculado a partir del secreto de eventos.
 * La comparación ignora mayúsculas y es de tiempo constante.
 */
export function verifyWompiEvent(
  event: WompiEvent,
  eventsSecret: string | undefined,
): boolean {
  if (!eventsSecret) {
    return false;
  }

  const checksum = event.signature?.checksum;
  if (typeof checksum !== "string" || checksum.length === 0) {
    return false;
  }

  const expected = computeWompiEventChecksum(event, eventsSecret);
  if (!expected) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(checksum.toLowerCase(), "utf8");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}
