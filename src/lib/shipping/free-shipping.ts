import type { FreeShippingRule } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface FreeShippingLocation {
  subtotal: number | string;
  city: string;
  department: string;
}

/**
 * Devuelve la primera regla que aplica, en el orden recibido
 * (se espera ordenado por prioridad descendente). La regla de mayor prioridad gana.
 */
export function findQualifyingRule<
  R extends Pick<
    FreeShippingRule,
    "type" | "minimumAmount" | "cities" | "departments"
  >,
>(rules: R[], { subtotal, city, department }: FreeShippingLocation): R | null {
  for (const rule of rules) {
    let qualifies = false;

    switch (rule.type) {
      case "ALWAYS_FREE":
        qualifies = true;
        break;

      case "MINIMUM_PURCHASE":
        qualifies =
          !!rule.minimumAmount &&
          parseFloat(String(subtotal)) >=
            parseFloat(rule.minimumAmount.toString());
        break;

      case "SPECIFIC_LOCATION": {
        const cityMatches =
          rule.cities.length === 0 ||
          rule.cities.some(
            (c) => c.toLowerCase() === city.toLowerCase().trim(),
          );
        const departmentMatches =
          rule.departments.length === 0 ||
          rule.departments.some(
            (d) => d.toLowerCase() === department.toLowerCase().trim(),
          );
        qualifies = cityMatches && departmentMatches;
        break;
      }
    }

    if (qualifies) return rule;
  }

  return null;
}

/** Busca en la base de datos la regla de envío gratis que aplica, si hay alguna. */
export async function getQualifyingFreeShippingRule(
  location: FreeShippingLocation,
): Promise<FreeShippingRule | null> {
  const rules = await prisma.freeShippingRule.findMany({
    where: { isActive: true },
    orderBy: { priority: "desc" },
  });
  return findQualifyingRule(rules, location);
}
