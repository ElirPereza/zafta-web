import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/free-shipping/validate - Check if order qualifies for free shipping
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subtotal, city, department } = body;

    console.log("[FREE SHIPPING] Validating:", { subtotal, city, department });

    if (!subtotal || !city || !department) {
      return NextResponse.json(
        { error: "Subtotal, city, and department are required" },
        { status: 400 },
      );
    }

    // Get all active rules ordered by priority
    const rules = await prisma.freeShippingRule.findMany({
      where: { isActive: true },
      orderBy: { priority: "desc" },
    });

    console.log("[FREE SHIPPING] Found rules:", rules.length, rules.map(r => ({ name: r.name, type: r.type })));

    // Check each rule
    for (const rule of rules) {
      console.log("[FREE SHIPPING] Evaluating rule:", {
        id: rule.id,
        name: rule.name,
        type: rule.type,
        isActive: rule.isActive,
        priority: rule.priority
      });

      let qualifies = false;

      switch (rule.type) {
        case "ALWAYS_FREE":
          qualifies = true;
          console.log("[FREE SHIPPING] ALWAYS_FREE rule qualifies:", qualifies);
          break;

        case "MINIMUM_PURCHASE":
          if (
            rule.minimumAmount &&
            parseFloat(subtotal) >= parseFloat(rule.minimumAmount.toString())
          ) {
            qualifies = true;
          }
          console.log("[FREE SHIPPING] MINIMUM_PURCHASE rule qualifies:", qualifies, {
            minimumAmount: rule.minimumAmount,
            subtotal,
          });
          break;

        case "SPECIFIC_LOCATION":
          // Check if location matches
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
          console.log("[FREE SHIPPING] SPECIFIC_LOCATION rule qualifies:", qualifies, {
            cityMatches,
            departmentMatches,
            ruleCities: rule.cities,
            ruleDepartments: rule.departments,
          });
          break;
      }

      // If this rule qualifies, return immediately (highest priority rule wins)
      if (qualifies) {
        console.log("[FREE SHIPPING] Rule QUALIFIED! Returning:", {
          qualifies: true,
          rule: { id: rule.id, name: rule.name, type: rule.type },
        });
        return NextResponse.json({
          qualifies: true,
          rule: {
            id: rule.id,
            name: rule.name,
            type: rule.type,
          },
        });
      }
    }

    console.log("[FREE SHIPPING] No rules matched - returning qualifies: false");

    // No rules matched
    return NextResponse.json({
      qualifies: false,
      rule: null,
    });
  } catch (error) {
    console.error("Error validating free shipping:", error);
    return NextResponse.json(
      { error: "Failed to validate free shipping" },
      { status: 500 },
    );
  }
}
