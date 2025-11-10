import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // Get admin email from environment variable
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error("ADMIN_EMAIL not configured in environment variables");
    redirect("/acceso-denegado");
  }

  // Get user's primary email
  const userEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  )?.emailAddress;

  // Only allow access if user's email matches the admin email
  if (!userEmail || userEmail.toLowerCase() !== adminEmail.toLowerCase()) {
    redirect("/acceso-denegado");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--beige-50))] via-[hsl(var(--rose-gold))]/5 to-[hsl(var(--beige-100))]">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <AdminHeader />

          {/* Page Content */}
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
