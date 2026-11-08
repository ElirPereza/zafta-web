import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";

export async function POST(request: Request) {
  try {
    // Solo administradores pueden limpiar la caché de una página
    const admin = await requireAdmin();
    if (!admin.ok) {
      return admin.response;
    }

    const { path } = await request.json();

    if (typeof path !== "string" || !path.startsWith("/")) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    // Revalidate the specified path
    revalidatePath(path);

    return NextResponse.json({ revalidated: true, path });
  } catch (error) {
    console.error("Error revalidating:", error);
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 });
  }
}
