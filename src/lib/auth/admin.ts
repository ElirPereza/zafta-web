import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export type AdminCheck =
  | { ok: true; userId: string; role: AdminRole }
  | { ok: false; response: NextResponse };

/**
 * Verifica que la petición venga de un administrador.
 *
 * Es administrador quien tenga rol ADMIN o SUPER_ADMIN en la base de datos,
 * o cuyo correo principal sea el ADMIN_EMAIL configurado (la misma regla con la
 * que el webhook de Clerk asigna el rol SUPER_ADMIN).
 *
 * Uso en una ruta de API:
 *   const admin = await requireAdmin();
 *   if (!admin.ok) return admin.response;
 */
export async function requireAdmin(): Promise<AdminCheck> {
  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const metadata = await prisma.userMetadata.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (metadata?.role === "ADMIN" || metadata?.role === "SUPER_ADMIN") {
    return { ok: true, userId, role: metadata.role };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail) {
    const user = await currentUser();
    const primaryEmail = user?.emailAddresses
      .find((email) => email.id === user.primaryEmailAddressId)
      ?.emailAddress?.toLowerCase();

    if (primaryEmail && primaryEmail === adminEmail) {
      return { ok: true, userId, role: "SUPER_ADMIN" };
    }
  }

  return {
    ok: false,
    response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
  };
}
