"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const tiktokVideos = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=600&fit=crop",
    alt: "Video de decoración de torta",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=600&fit=crop",
    alt: "Proceso de preparación de dulces",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=600&fit=crop",
    alt: "Técnicas de repostería",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=600&fit=crop",
    alt: "Recetas rápidas de postres",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=600&fit=crop",
    alt: "Behind the scenes de Zafta",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=600&fit=crop",
    alt: "Tutoriales de decoración",
  },
];

const TikTokSection = () => {
  return (
    <section
      id="tiktok"
      className="py-16 md:py-20 px-6 md:px-8 bg-beige-100"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12 md:mb-14"
        >
          <h2 className="mb-4 text-4xl font-sans font-bold md:text-5xl text-foreground">
            Síguenos en TikTok
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Tutoriales, recetas y el día a día de nuestra repostería artesanal.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {tiktokVideos.map((video, index) => (
            <motion.a
              key={video.id}
              href="https://www.tiktok.com/@zafta_reposteria"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="group relative aspect-[9/16] overflow-hidden rounded-2xl shadow-card hover:shadow-medium transition-all duration-300"
            >
              <Image
                src={video.image}
                alt={video.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/40 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                <Music className="w-10 h-10 text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-background font-sans font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Ver en TikTok
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="text-center"
        >
          <Button
            variant="secondary"
            size="lg"
            asChild
            className="shadow-warm hover:shadow-medium transition-all duration-300"
          >
            <Link href="https://www.tiktok.com/@zafta_reposteria" target="_blank" rel="noopener noreferrer">
              Síguenos en TikTok
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TikTokSection;
