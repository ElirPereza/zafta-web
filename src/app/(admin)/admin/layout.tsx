import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

// Cache the user role check to avoid multiple DB queries per request
const getUserRole = cache(async (clerkId: string) => {
  return await prisma.userMetadata.findUnique({
    where: { clerkId },
    select: { role: true },
  });
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  // Check user role from database (cached)
  const userMetadata = await getUserRole(userId);

  // If user is not admin, redirect to home
  if (!userMetadata || (userMetadata.role !== "ADMIN" && userMetadata.role !== "SUPER_ADMIN")) {
    redirect("/inicio");
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--beige-100))]">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <AdminHeader />

          {/* Page Content */}
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
