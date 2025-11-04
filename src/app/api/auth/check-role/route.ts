import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();

    console.log("🔐 API check-role: Checking role for userId:", userId);

    if (!userId) {
      console.log("⚠️ API check-role: No userId found, returning CUSTOMER");
      return NextResponse.json({ role: "CUSTOMER" });
    }

    const userMetadata = await prisma.userMetadata.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    console.log("📊 API check-role: Database result:", userMetadata);

    const role = userMetadata?.role || "CUSTOMER";
    console.log("✅ API check-role: Returning role:", role);

    return NextResponse.json({ role });
  } catch (error) {
    console.error("❌ API check-role: Error checking role:", error);
    return NextResponse.json({ role: "CUSTOMER" });
  }
}
