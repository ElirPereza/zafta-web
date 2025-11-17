"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Images,
  Gift,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Productos",
    href: "/admin/productos",
    icon: Package,
  },
  {
    name: "Pedidos",
    href: "/admin/pedidos",
    icon: ShoppingCart,
  },
  {
    name: "Facturas",
    href: "/admin/facturas",
    icon: FileText,
  },
  {
    name: "Galerías",
    href: "/admin/galerias",
    icon: Images,
  },
  {
    name: "Descuentos",
    href: "/admin/descuentos",
    icon: Gift,
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      {/* Logo & Close Button (Mobile) */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center" onClick={onClose}>
          <Logo
            variant="banner-orange"
            width={120}
            height={97}
            className="h-12 w-auto"
          />
        </Link>
        {/* Close button - only visible on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden text-white/80 hover:text-white transition-colors p-2"
          aria-label="Cerrar menú"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-medium transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-[hsl(var(--rose-gold))]/30 to-[hsl(var(--rose-gold))]/20 text-white shadow-lg backdrop-blur-sm border border-[hsl(var(--rose-gold))]/40"
                  : "text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/70 text-center font-gotham font-medium">
          ZAFTA Admin
        </p>
        <p className="text-xs text-white/50 text-center font-sans mt-1">
          Panel de Administración
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col",
          "bg-gradient-to-br from-[hsl(var(--burgundy))] via-[hsl(346_98%_22%)] to-[hsl(346_98%_18%)]",
          "text-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gradient-to-br from-[hsl(var(--burgundy))] via-[hsl(346_98%_22%)] to-[hsl(346_98%_18%)] text-white shadow-xl z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
