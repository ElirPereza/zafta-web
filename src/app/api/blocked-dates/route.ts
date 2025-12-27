import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET /api/blocked-dates - Get all blocked dates
// Public endpoint for the calendar to fetch blocked dates
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    // Build date filter
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (fromDate) {
      dateFilter.gte = new Date(fromDate);
    }
    if (toDate) {
      dateFilter.lte = new Date(toDate);
    }

    const blockedDates = await prisma.blockedDate.findMany({
      where: Object.keys(dateFilter).length > 0 ? { date: dateFilter } : undefined,
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ blockedDates });
  } catch (error) {
    console.error("Error fetching blocked dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocked dates" },
      { status: 500 },
    );
  }
}

// POST /api/blocked-dates - Create blocked date(s)
// Admin only endpoint
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { dates, reason } = body;

    // Validate required fields
    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return NextResponse.json(
        { error: "At least one date is required" },
        { status: 400 },
      );
    }

    // Create blocked dates (skip duplicates)
    const createdDates = [];
    const skippedDates = [];

    for (const dateStr of dates) {
      try {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);

        const blockedDate = await prisma.blockedDate.create({
          data: {
            date,
            reason: reason || null,
          },
        });
        createdDates.push(blockedDate);
      } catch (err: unknown) {
        // If date already exists (unique constraint), skip it
        if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
          skippedDates.push(dateStr);
        } else {
          throw err;
        }
      }
    }

    return NextResponse.json(
      {
        created: createdDates,
        skipped: skippedDates,
        message: `Created ${createdDates.length} blocked date(s)${skippedDates.length > 0 ? `, ${skippedDates.length} already existed` : ""}`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating blocked dates:", error);
    return NextResponse.json(
      { error: "Failed to create blocked dates" },
      { status: 500 },
    );
  }
}
