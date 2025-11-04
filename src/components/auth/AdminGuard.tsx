"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!isLoaded) return;

      if (!user) {
        // User not authenticated, redirect to sign-in
        router.push("/auth/sign-in");
        return;
      }

      try {
        const response = await fetch("/api/auth/check-role");
        const data = await response.json();

        if (data.role !== "ADMIN" && data.role !== "SUPER_ADMIN") {
          // User is not admin, redirect to home
          console.log("⚠️ Access denied: User is not admin");
          router.push("/inicio");
        } else {
          console.log("✅ Access granted: User is", data.role);
        }
      } catch (error) {
        console.error("❌ Error checking admin access:", error);
        router.push("/inicio");
      }
    };

    checkAdminAccess();
  }, [user, isLoaded, router]);

  // Show loading state while checking
  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
