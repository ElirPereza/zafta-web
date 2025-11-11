import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    // Update all products in a transaction
    try {
      await prisma.$transaction(
        updates.map((update: { id: string; displayOrder: number }) =>
          prisma.product.update({
            where: { id: update.id },
            // @ts-ignore - displayOrder might not exist in local Prisma client
            data: { displayOrder: update.displayOrder },
          })
        )
      );

      // Revalidate the homepage to show updated order immediately
      revalidatePath("/inicio");
      revalidatePath("/");

      return NextResponse.json({ success: true });
    } catch (updateError: any) {
      console.error("Error updating products:", updateError);

      // Check if error is due to missing displayOrder field
      if (updateError?.message?.includes("displayOrder") ||
          updateError?.message?.includes("Unknown field")) {
        return NextResponse.json(
          {
            error: "El campo displayOrder no existe. Ejecuta el SQL en Supabase primero.",
            details: updateError.message
          },
          { status: 500 }
        );
      }

      throw updateError;
    }
  } catch (error: any) {
    console.error("Error reordering products:", error);
    return NextResponse.json(
      {
        error: "Failed to reorder products",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
