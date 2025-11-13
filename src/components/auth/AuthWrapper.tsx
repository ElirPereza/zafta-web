"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AuthCarousel } from "./AuthCarousel";

interface AuthWrapperProps {
  readonly children: React.ReactNode;
  readonly title?: string;
  readonly subtitle: string;
}

export function AuthWrapper({ children, title, subtitle }: AuthWrapperProps) {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Image Carousel (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <AuthCarousel />
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-linear-to-br from-beige-100 via-beige-200 to-beige-300 overflow-y-auto">
        <div className="w-full max-w-md py-8 px-6 sm:px-8">
          {/* Logo Section */}
          <Link href="/inicio" className="block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center items-center mb-8 cursor-pointer"
            >
              <Image
                src="/SVG/logo-banner_color-1.svg"
                alt="ZAFTA"
                width={200}
                height={162}
                priority
                className="w-48 h-auto"
              />
            </motion.div>
          </Link>

          {/* Title and Subtitle */}
          <div className="text-center mb-8 space-y-2">
            {title && (
              <h1 className="text-xl font-semibold text-foreground leading-relaxed">
                {title}
              </h1>
            )}
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Clerk Component Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {children}
          </motion.div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground font-sans">
              © {new Date().getFullYear()} ZAFTA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
