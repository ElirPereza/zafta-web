"use client";

import { useUser } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Floating admin button that only appears when the admin user is logged in
 * and viewing the public site. Provides quick access back to admin panel.
 */
export function AdminFloatingButton() {
  const { user, isLoaded } = useUser();

  // Don't render until user data is loaded
  if (!isLoaded) return null;

  // Don't render if no user is logged in
  if (!user) return null;

  // Get admin email from environment
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Don't render if ADMIN_EMAIL is not configured
  if (!adminEmail) return null;

  // Get user's primary email
  const userEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  )?.emailAddress;

  // Only render for admin user
  if (!userEmail || userEmail.toLowerCase() !== adminEmail.toLowerCase()) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 left-6 z-40"
      >
        <Link href="/admin">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[hsl(var(--burgundy))] to-[hsl(346_98%_20%)] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-sans font-medium text-sm"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Panel Admin</span>
          </motion.button>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
