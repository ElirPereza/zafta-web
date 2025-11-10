"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 h-16 bg-white border-b border-[hsl(var(--beige-400))] lg:ml-64">
      <div className="flex items-center justify-between h-full px-6">
        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>

        {/* Page title - Will be dynamic based on route */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-serif font-semibold text-foreground">
            Panel de Administración
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
          </Button>

          {/* User menu */}
          <UserButton
            afterSignOutUrl="/auth/sign-in"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
