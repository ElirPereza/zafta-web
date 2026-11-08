import { describe, expect, test } from "bun:test";
import crypto from "node:crypto";
import {
  computeWompiEventChecksum,
  verifyWompiEvent,
  type WompiEvent,
} from "./events";

// Evento de ejemplo de la documentación de Wompi (https://docs.wompi.co/docs/colombia/eventos/).
// El secreto es el de ejemplo de la documentación, no uno real.
const DOCS_SECRET = "prod_events_OcHnIzeBl5socpwByQ4hA52Em3USQ93Z";

// La documentación describe la firma como SHA256 de:
//   transaction.id + transaction.status + transaction.amount_in_cents + timestamp + secreto
// (sin separadores). Este es ese texto para el evento de ejemplo.
const DOCS_CONCATENATION =
  "1234-1610641025-49201APPROVED44900001530291411prod_events_OcHnIzeBl5socpwByQ4hA52Em3USQ93Z";

const EXPECTED_CHECKSUM = crypto
  .createHash("sha256")
  .update(DOCS_CONCATENATION, "utf8")
  .digest("hex");

function docsEvent(checksum: string = EXPECTED_CHECKSUM): WompiEvent {
  return {
    event: "transaction.updated",
    data: {
      transaction: {
        id: "1234-1610641025-49201",
        amount_in_cents: 4490000,
        reference: "MZQ3X2DE2SMX",
        customer_email: "juan.perez@gmail.com",
        currency: "COP",
        payment_method_type: "NEQUI",
        redirect_url: "https://mitienda.com.co/pagos/redireccion",
        status: "APPROVED",
        shipping_address: null,
        payment_link_id: null,
        payment_source_id: null,
      },
    },
    environment: "prod",
    signature: {
      properties: [
        "transaction.id",
        "transaction.status",
        "transaction.amount_in_cents",
      ],
      checksum,
    },
    timestamp: 1530291411,
    sent_at: "2018-07-20T16:45:05.000Z",
  };
}

describe("computeWompiEventChecksum", () => {
  test("concatena id + estado + monto + timestamp + secreto como dice Wompi", () => {
    expect(computeWompiEventChecksum(docsEvent(), DOCS_SECRET)).toBe(
      EXPECTED_CHECKSUM,
    );
  });

  test("respeta el orden de signature.properties", () => {
    const event = docsEvent();
    event.signature = {
      ...event.signature,
      properties: [
        "transaction.amount_in_cents",
        "transaction.status",
        "transaction.id",
      ],
    };
    const expected = crypto
      .createHash("sha256")
      .update(
        `4490000APPROVED1234-1610641025-492011530291411${DOCS_SECRET}`,
        "utf8",
      )
      .digest("hex");
    expect(computeWompiEventChecksum(event, DOCS_SECRET)).toBe(expected);
  });

  test("devuelve null si falta una propiedad firmada", () => {
    const event = docsEvent();
    event.signature = {
      ...event.signature,
      properties: ["transaction.id", "transaction.no_existe"],
    };
    expect(computeWompiEventChecksum(event, DOCS_SECRET)).toBeNull();
  });

  test("devuelve null si no hay timestamp", () => {
    const event = docsEvent();
    event.timestamp = undefined;
    expect(computeWompiEventChecksum(event, DOCS_SECRET)).toBeNull();
  });
});

describe("verifyWompiEvent", () => {
  test("acepta el evento con el checksum correcto en mayúsculas (como lo manda Wompi)", () => {
    expect(
      verifyWompiEvent(docsEvent(EXPECTED_CHECKSUM.toUpperCase()), DOCS_SECRET),
    ).toBe(true);
  });

  test("acepta el checksum en minúsculas", () => {
    expect(verifyWompiEvent(docsEvent(), DOCS_SECRET)).toBe(true);
  });

  test("rechaza si cambia un valor firmado (monto)", () => {
    const event = docsEvent();
    if (event.data.transaction) {
      event.data.transaction.amount_in_cents = 1;
    }
    expect(verifyWompiEvent(event, DOCS_SECRET)).toBe(false);
  });

  test("rechaza si cambia el estado firmado", () => {
    const event = docsEvent();
    if (event.data.transaction) {
      event.data.transaction.status = "DECLINED";
    }
    expect(verifyWompiEvent(event, DOCS_SECRET)).toBe(false);
  });

  test("rechaza si cambia el timestamp", () => {
    const event = docsEvent();
    event.timestamp = 1530291412;
    expect(verifyWompiEvent(event, DOCS_SECRET)).toBe(false);
  });

  test("rechaza con otro secreto", () => {
    expect(verifyWompiEvent(docsEvent(), "otro-secreto")).toBe(false);
  });

  test("rechaza sin secreto configurado", () => {
    expect(verifyWompiEvent(docsEvent(), undefined)).toBe(false);
  });

  test("rechaza un checksum vacío o de otro largo", () => {
    expect(verifyWompiEvent(docsEvent(""), DOCS_SECRET)).toBe(false);
    expect(verifyWompiEvent(docsEvent("00"), DOCS_SECRET)).toBe(false);
  });

  test("rechaza si no viene la firma", () => {
    const event = docsEvent();
    event.signature = undefined;
    expect(verifyWompiEvent(event, DOCS_SECRET)).toBe(false);
  });
});
