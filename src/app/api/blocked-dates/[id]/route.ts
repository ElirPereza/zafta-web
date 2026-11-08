import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

// DELETE /api/blocked-dates/[id] - Delete a blocked date
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) {
      return admin.response;
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
