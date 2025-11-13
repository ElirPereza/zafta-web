"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";

const bannerImages = [
  {
    src: "/zafta_assets/banner1.webp",
    alt: "Banner 1 - Colección de tortas artesanales ZAFTA",
  },
  {
    src: "/zafta_assets/_MG_9939.webp",
    alt: "Banner 2 - Deliciosas creaciones de repostería ZAFTA",
  },
  {
    src: "/zafta_assets/banner3.jpg",
    alt: "Banner 3 - Tortas personalizadas hechas con amor",
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGradient, setShowGradient] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 3000);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowGradient(true);
      } else {
        setShowGradient(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-beige-100"
    >
      {/* Background Image Carousel with Crossfade */}
      <div className="absolute inset-0">
        {bannerImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentIndex === index ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              className="object-cover"
              quality={90}
            />
          </motion.div>
        ))}
      </div>

      {/* Carousel Indicators */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group relative"
            aria-label={`Ir a imagen ${index + 1}`}
          >
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-12 bg-primary"
                  : "w-8 bg-white/50 group-hover:bg-white/70"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-32">
        <div className="max-w-4xl text-center -mt-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="flex justify-center relative"
          >
            {/* Enhanced shadow backdrop with salmon/rose gold glow */}
            <div className="absolute inset-0 -m-8 bg-gradient-radial from-[#FFB4A2]/50 via-[#E5B097]/30 to-transparent blur-3xl" />
            <Logo
              variant="banner"
              width={700}
              height={566}
              className="w-96 md:w-[34rem] lg:w-[44rem] h-auto drop-shadow-[0_10px_40px_rgba(244,168,159,0.7)] relative z-10"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Simple white design */}
      <div className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="h-12 w-6 rounded-full border-2 border-white bg-white/20 shadow-lg backdrop-blur-sm">
          <div className="mx-auto mt-2 h-2 w-1 rounded-full bg-white shadow-md" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
