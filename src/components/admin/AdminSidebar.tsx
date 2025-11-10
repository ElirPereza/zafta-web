"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Settings,
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
    name: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gradient-to-b from-[hsl(var(--burgundy))] to-[hsl(346_98%_20%)] text-white shadow-xl">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 px-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center">
          <Logo
            variant="banner-light-1"
            width={120}
            height={97}
            className="h-12 w-auto brightness-0 invert"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          // For Dashboard, only match exact path. For others, match path + subpaths
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans font-medium transition-all duration-200",
                isActive
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
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
        <p className="text-xs text-white/60 text-center font-sans">
          ZAFTA Admin Panel
        </p>
        <p className="text-xs text-white/40 text-center font-sans mt-1">
          v1.0
        </p>
      </div>
    </aside>
  );
}
