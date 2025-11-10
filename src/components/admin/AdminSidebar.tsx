"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
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
    name: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
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
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-[hsl(var(--beige-400))]">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 px-6 border-b border-[hsl(var(--beige-400))]">
        <Link href="/admin" className="flex items-center">
          <Logo
            variant="banner-color-1"
            width={120}
            height={97}
            className="h-12 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
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
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-[hsl(var(--beige-200))] hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[hsl(var(--beige-400))]">
        <p className="text-xs text-muted-foreground text-center">
          ZAFTA Admin Panel
        </p>
      </div>
    </aside>
  );
}
