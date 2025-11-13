"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/cart/CartButton";
import { CartDrawer } from "@/components/cart/CartDrawer";

const navItems = [
  { label: "Inicio", href: "/inicio" },
  { label: "Productos", href: "/productos" },
  { label: "Nuestra Historia", href: "/nuestra-historia" },
  { label: "FAQ", href: "/faq" },
  { label: "Contacto", href: "/contacto" },
];

const Navigation = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Check if we're on the home page
  const isHomePage = pathname === "/inicio" || pathname === "/";

  // Check if current user is admin
  const isAdmin =
    isLoaded &&
    user &&
    (() => {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (!adminEmail) return false;

      const userEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId,
      )?.emailAddress;

      return userEmail?.toLowerCase() === adminEmail.toLowerCase();
    })();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      // Show navbar after scrolling down 100px only on home page
      if (isHomePage) {
        setIsVisible(scrollPosition > 100);
      } else {
        // Always visible on other pages
        setIsVisible(true);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const isActive = (href: string) => {
    if (href === "/inicio" && pathname === "/inicio") return true;
    if (href !== "/inicio" && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <motion.nav
      initial={{ y: isHomePage ? -150 : 0, opacity: isHomePage ? 0 : 1 }}
      animate={{
        y: isVisible ? 0 : -150,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-medium" : ""
      }`}
      style={{ backgroundColor: "hsl(var(--beige-100))" }}
    >
      <div className="container mx-auto px-6">
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] items-center h-28 gap-8">
          {/* Left Navigation */}
          <div className="flex items-center justify-end gap-2">
            {navItems.slice(0, 2).map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300 ${
                      active ? "text-white" : "hover:bg-opacity-50"
                    }`}
                    style={{
                      color: active
                        ? "hsl(var(--background))"
                        : "hsl(var(--primary))",
                      backgroundColor: active
                        ? "hsl(var(--primary))"
                        : "transparent",
                    }}
                    whileHover={{
                      backgroundColor: "hsl(var(--primary))",
                      color: "hsl(var(--background))",
                      scale: 1.05,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Center Logo */}
          <Link href="/inicio">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer flex items-center justify-center"
            >
              {/* Círculo de fondo - DESACTIVADO */}
              {/* <div className="absolute -inset-3 rounded-full bg-white shadow-xl border-2 border-secondary/20" /> */}
              {/* Logo ZAFTA text optimizado */}
              <Logo
                variant="zafta-text"
                width={180}
                height={42}
                className="w-44 lg:w-48 h-auto"
              />
            </motion.div>
          </Link>

          {/* Right Navigation */}
          <div className="flex items-center justify-start gap-2">
            {navItems.slice(2).map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300 ${
                      active ? "text-white" : "hover:bg-opacity-50"
                    }`}
                    style={{
                      color: active
                        ? "hsl(var(--background))"
                        : "hsl(var(--primary))",
                      backgroundColor: active
                        ? "hsl(var(--primary))"
                        : "transparent",
                    }}
                    whileHover={{
                      backgroundColor: "hsl(var(--primary))",
                      color: "hsl(var(--background))",
                      scale: 1.05,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}

            {/* Admin Panel Button - Only visible for admin users */}
            {isAdmin && (
              <Link href="/admin">
                <motion.div
                  className="px-4 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300 flex items-center gap-2"
                  style={{
                    color: "hsl(var(--background))",
                    backgroundColor: "hsl(var(--primary))",
                  }}
                  whileHover={{
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Panel Admin
                </motion.div>
              </Link>
            )}

            {/* Cart Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <CartButton onClick={() => setCartOpen(true)} />
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center justify-between h-20">
          {/* Logo */}
          <Link href="/inicio">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer flex items-center"
            >
              <Logo
                variant="zafta-text"
                width={160}
                height={42}
                className="w-36 h-auto"
              />
            </motion.div>
          </Link>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <CartButton onClick={() => setCartOpen(true)} />

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <motion.button
                  className="p-2 rounded-md"
                  style={{ color: "hsl(var(--primary))" }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Menu de navegación"
                >
                  <Menu className="w-6 h-6" />
                </motion.button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="mb-6 flex justify-start">
                  <Logo
                    variant="zafta-text"
                    width={140}
                    height={42}
                    className="w-32 h-auto"
                  />
                </SheetTitle>
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`px-4 py-3 rounded-lg text-base font-sans font-medium transition-all ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-beige-200"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  {/* Admin Panel Button - Mobile */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 rounded-lg text-base font-sans font-medium transition-all bg-primary text-primary-foreground flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Panel Admin
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </motion.nav>
  );
};

export default Navigation;
