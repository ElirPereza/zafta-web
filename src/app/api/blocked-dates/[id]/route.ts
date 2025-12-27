import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// DELETE /api/blocked-dates/[id] - Delete a blocked date
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if blocked date exists
    const existingDate = await prisma.blockedDate.findUnique({
      where: { id },
    });

    if (!existingDate) {
      return NextResponse.json(
        { error: "Blocked date not found" },
        { status: 404 },
      );
    }

    await prisma.blockedDate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blocked date:", error);
    return NextResponse.json(
      { error: "Failed to delete blocked date" },
      { status: 500 },
    );
  }
}
