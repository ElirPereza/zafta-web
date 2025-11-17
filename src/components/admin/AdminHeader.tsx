"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-gradient-to-r from-white/95 via-[hsl(var(--beige-50))]/80 to-white/95 backdrop-blur-md border-b border-[hsl(var(--rose-gold))]/20 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden hover:bg-[hsl(var(--rose-gold))]/10"
        >
          <Menu className="h-6 w-6 text-[hsl(var(--rose-gold))]" />
        </Button>

        {/* Page title */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-gotham font-medium text-[hsl(var(--rose-gold))]">
            Panel de Administración
          </h1>
        </div>

        {/* Mobile logo/title */}
        <div className="lg:hidden">
          <h1 className="text-lg font-gotham font-medium text-[hsl(var(--rose-gold))]">
            ZAFTA Admin
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-[hsl(var(--rose-gold))]/10 transition-colors"
          >
            <Bell className="h-5 w-5 text-[hsl(var(--rose-gold))]" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[hsl(var(--rose-gold))] rounded-full ring-2 ring-white animate-pulse" />
          </Button>

          {/* User menu */}
          <UserButton
            afterSignOutUrl="/auth/sign-in"
            appearance={{
              elements: {
                avatarBox:
                  "h-9 w-9 ring-2 ring-[hsl(var(--rose-gold))] hover:ring-[hsl(var(--rose-gold))]/70 transition-all",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
