"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export function AdminRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkAdminAndRedirect = async () => {
      if (!isLoaded || !user) {
        console.log("⏳ AdminRedirect: Waiting for user to load...");
        return;
      }

      console.log("✅ AdminRedirect: User loaded, checking role...");
      console.log("👤 User ID:", user.id);
      console.log("📧 User Email:", user.primaryEmailAddress?.emailAddress);

      try {
        // Check if user is admin by fetching their metadata from our database
        const response = await fetch("/api/auth/check-role");
        const data = await response.json();

        console.log("🔍 Role from API:", data.role);

        if (data.role === "ADMIN" || data.role === "SUPER_ADMIN") {
          console.log("🚀 Redirecting to /admin...");
          // Redirect to admin dashboard
          router.push("/admin");
        } else {
          console.log("👤 User is a customer, staying on /inicio");
        }
      } catch (error) {
        console.error("❌ Error checking admin role:", error);
      }
    };

    checkAdminAndRedirect();
  }, [user, isLoaded, router]);

  return null;
}
