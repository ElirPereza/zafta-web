"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 h-16 bg-white/80 backdrop-blur-md border-b border-[hsl(var(--rose-gold))]/20 lg:ml-64 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>

        {/* Page title - Will be dynamic based on route */}
        <div className="hidden lg:block">
          <h1 className="text-xl italic text-[hsl(var(--burgundy))]">
            Panel de Administración
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-[hsl(var(--rose-gold))]/10"
          >
            <Bell className="h-5 w-5 text-[hsl(var(--burgundy))]" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-[hsl(var(--burgundy))] rounded-full ring-2 ring-white" />
          </Button>

          {/* User menu */}
          <UserButton
            afterSignOutUrl="/auth/sign-in"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9 ring-2 ring-[hsl(var(--rose-gold))]",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
