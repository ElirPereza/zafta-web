"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoaded } = useUser();

  // Get admin email from environment variable
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Get user's primary email
  const userEmail = user?.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId,
  )?.emailAddress;

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--beige-50))] via-[hsl(var(--rose-gold))]/5 to-[hsl(var(--beige-100))]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[hsl(var(--burgundy))] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[hsl(var(--burgundy))] font-sans">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect("/auth/sign-in");
  }

  if (!adminEmail) {
    console.error(
      "NEXT_PUBLIC_ADMIN_EMAIL not configured in environment variables",
    );
    redirect("/acceso-denegado");
  }

  // Only allow access if user's email matches the admin email
  if (!userEmail || userEmail.toLowerCase() !== adminEmail.toLowerCase()) {
    redirect("/acceso-denegado");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--beige-50))] via-[hsl(var(--rose-gold))]/5 to-[hsl(var(--beige-100))]">
      {/* Sidebar - both mobile and desktop */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen lg:ml-64">
        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
