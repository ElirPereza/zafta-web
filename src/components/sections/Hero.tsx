"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

const bannerImages = [
  {
    src: "/zafta_assets/banner1.webp",
    alt: "Banner 1 - Colección de tortas artesanales ZAFTA",
  },
  {
    src: "/zafta_assets/banner2.jpg",
    alt: "Banner 2 - Deliciosas creaciones de repostería ZAFTA",
  },
  {
    src: "/zafta_assets/banner3.jpg",
    alt: "Banner 3 - Tortas personalizadas hechas con amor",
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={bannerImages[currentIndex].src}
            alt={bannerImages[currentIndex].alt}
            fill
            priority={currentIndex === 0}
            className="object-cover"
            quality={90}
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom Gradient Overlay - Subtle transition to background color */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[hsl(var(--background))] via-[hsl(var(--background))]/40 to-transparent z-[5]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-16">
        <div className="max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="flex justify-center mb-8"
          >
            <Logo
              variant="banner-orange"
              width={700}
              height={566}
              className="w-96 md:w-[34rem] lg:w-[44rem] h-auto drop-shadow-2xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="mb-10"
          >
            <p className="text-2xl md:text-3xl lg:text-4xl text-[hsl(224,55%,15%)] font-sans font-bold max-w-3xl mx-auto tracking-wide drop-shadow-[0_4px_12px_rgba(255,255,255,0.9)]">
              Nuestra Historia en cada bocado
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex justify-center"
          >
            <Link href="/productos">
              <Button
                variant="hero"
                size="lg"
                className="text-lg md:text-xl font-sans font-medium shadow-warm hover:shadow-medium"
              >
                Haz tu pedido
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="h-12 w-6 rounded-full border-2 border-background/40 opacity-75">
          <div className="mx-auto mt-2 h-2 w-1 rounded-full bg-background/60" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
