import { NextResponse } from "next/server";
import {
  calculateShippingCost,
  getDepartments,
  getCitiesForDepartment,
} from "@/lib/shipping/zones";

export const runtime = "nodejs";

// POST - Calculate shipping cost
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { department, city } = body;

    if (!department || !city) {
      return NextResponse.json(
        { error: "Department and city are required" },
        { status: 400 },
      );
    }

    const calculation = calculateShippingCost(department, city);

    return NextResponse.json({
      department: calculation.department,
      city: calculation.city,
      cost: calculation.cost,
      formattedCost: new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(calculation.cost),
    });
  } catch (error) {
    console.error("Error calculating shipping cost:", error);
    return NextResponse.json(
      { error: "Error calculating shipping cost" },
      { status: 500 },
    );
  }
}

// GET - Get departments and cities
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");

    if (department) {
      // Return cities for specific department
      const cities = getCitiesForDepartment(department);
      return NextResponse.json({ cities });
    }

    // Return all departments
    const departments = getDepartments();
    return NextResponse.json({ departments });
  } catch (error) {
    console.error("Error fetching shipping data:", error);
    return NextResponse.json(
      { error: "Error fetching shipping data" },
      { status: 500 },
    );
  }
}
