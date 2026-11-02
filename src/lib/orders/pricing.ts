// Cálculo del precio de un pedido en el servidor.
//
// El navegador envía qué compró el cliente (producto, tamaño, cantidad, dónde
// entregar y código de descuento), pero NUNCA se confía en los montos que envía.
// Todo se recalcula aquí con la misma lógica que muestra el checkout:
//   subtotal  = precio del tamaño (o precio base si no hay tamaño) x cantidad
//   envío     = tarifa de la zona (src/lib/shipping/zones.ts), 0 si es recogida
//               en tienda o si aplica una regla de envío gratis
//   descuento = round(subtotal x porcentaje / 100)
//   total     = subtotal + envío - descuento

import { lookupDiscount } from "@/lib/discounts";
import { prisma } from "@/lib/prisma";
import { getQualifyingFreeShippingRule } from "@/lib/shipping/free-shipping";
import { calculateShippingCost } from "@/lib/shipping/zones";

/** Error que se le puede mostrar al cliente (respuesta 400). */
export class PricingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PricingError";
  }
}

export interface OrderItemInput {
  productId: string;
  sizeName?: string | null;
  quantity: number;
  imageUrl?: string | null;
}

export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  images: string[];
  sizes: { name: string; price: number }[];
}

export interface PricedLine {
  productId: string;
  name: string;
  sizeName: string | null;
  price: number;
  quantity: number;
  imageUrl: string;
}

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

/** Precio de cada línea según el catálogo. Lanza PricingError si algo no cuadra. */
export function priceItems(
  items: OrderItemInput[],
  catalog: Map<string, CatalogProduct>,
): { lines: PricedLine[]; subtotal: number } {
  const lines = items.map((item) => {
    const product = catalog.get(item.productId);
    if (!product) {
      throw new PricingError(
        "Uno de los productos de tu carrito ya no está disponible. Por favor actualiza tu carrito.",
      );
    }
    if (!product.inStock) {
      throw new PricingError(
        `"${product.name}" está agotado en este momento. Retíralo del carrito para continuar.`,
      );
    }

    let price = product.price;
    let sizeName: string | null = null;

    if (item.sizeName) {
      const size =
        product.sizes.find((s) => s.name === item.sizeName) ??
        product.sizes.find(
          (s) => normalize(s.name) === normalize(item.sizeName as string),
        );
      if (!size) {
        throw new PricingError(
          `El tamaño elegido de "${product.name}" ya no está disponible. Por favor actualiza tu carrito.`,
        );
      }
      price = size.price;
      sizeName = size.name;
    }

    return {
      productId: product.id,
      name: product.name,
      sizeName,
      price,
      quantity: item.quantity,
      imageUrl: item.imageUrl || product.images[0] || "",
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  return { lines, subtotal };
}

export interface TotalsInput {
  subtotal: number;
  deliveryMethod: "DELIVERY" | "PICKUP";
  city?: string | null;
  department?: string | null;
  freeShipping: boolean;
  discountPercent: number | null;
}

/** Envío, descuento y total a partir del subtotal ya calculado. */
export function computeTotals(input: TotalsInput) {
  let shippingCost = 0;
  if (input.deliveryMethod === "DELIVERY" && !input.freeShipping) {
    shippingCost = calculateShippingCost(
      input.department ?? "",
      input.city ?? "",
    ).cost;
  }

  const discountAmount = input.discountPercent
    ? Math.round((input.subtotal * input.discountPercent) / 100)
    : 0;

  const total = input.subtotal + shippingCost - discountAmount;
  return { shippingCost, discountAmount, total };
}

export interface PriceOrderInput {
  items: OrderItemInput[];
  deliveryMethod: "DELIVERY" | "PICKUP";
  city?: string | null;
  department?: string | null;
  discountCode?: string | null;
  customerEmail: string;
}

/** Calcula el pedido completo leyendo precios, reglas y descuentos de la base de datos. */
export async function priceOrder(input: PriceOrderInput) {
  const productIds = [...new Set(input.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { sizes: true },
  });

  const catalog = new Map<string, CatalogProduct>(
    products.map((p) => [
      p.id,
      {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        inStock: p.inStock,
        images: p.images,
        sizes: p.sizes.map((s) => ({ name: s.name, price: Number(s.price) })),
      },
    ]),
  );

  const { lines, subtotal } = priceItems(input.items, catalog);

  let freeShipping = false;
  if (input.deliveryMethod === "DELIVERY" && input.city && input.department) {
    const rule = await getQualifyingFreeShippingRule({
      subtotal,
      city: input.city,
      department: input.department,
    });
    freeShipping = rule !== null;
  }

  let discountCode: string | null = null;
  let discountPercent: number | null = null;
  if (input.discountCode) {
    const result = await lookupDiscount(
      input.discountCode,
      input.customerEmail,
      { onlyPaidOrdersCountAsUsed: true },
    );
    if (!result.valid) {
      throw new PricingError(result.message);
    }
    discountCode = result.discount.code;
    discountPercent = result.discount.percent;
  }

  const totals = computeTotals({
    subtotal,
    deliveryMethod: input.deliveryMethod,
    city: input.city,
    department: input.department,
    freeShipping,
    discountPercent,
  });

  return { lines, subtotal, discountCode, ...totals };
}
