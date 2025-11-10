"use client";

import { motion } from "framer-motion";
import { Instagram, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="py-8 md:py-10 px-6 md:px-8 border-t-2 border-secondary/30"
      style={{
        background: `linear-gradient(135deg, hsl(var(--beige-500)) 0%, hsl(var(--beige-400)) 50%, hsl(var(--beige-500)) 100%)`,
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="grid gap-8 md:gap-10 md:grid-cols-3 mb-8"
        >
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center lg:items-start w-full"
          >
            <div className="mb-8 flex items-center justify-center w-full lg:justify-start">
              {/* Logo completo */}
              <Logo
                variant="banner-color-1"
                width={200}
                height={162}
                className="w-32 h-auto"
              />
            </div>
            <p className="text-lg font-sans italic text-primary leading-relaxed text-center lg:text-left w-full">
              Lo delicioso se vuelve tradición
            </p>
            <p className="text-sm font-sans font-light text-muted-foreground mt-4 italic text-center lg:text-left w-full">
              Donde cada porción cuenta una historia dulce.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <h4 className="mb-5 font-sans font-semibold text-lg text-foreground">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3 text-base font-sans">
              <li>
                <Link href="/productos">
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:underline decoration-secondary inline-block cursor-pointer"
                  >
                    Productos
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/nuestra-historia">
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:underline decoration-secondary inline-block cursor-pointer"
                  >
                    Nuestra Historia
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:underline decoration-secondary inline-block cursor-pointer"
                  >
                    Preguntas Frecuentes
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/contacto">
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:underline decoration-secondary inline-block cursor-pointer"
                  >
                    Contacto
                  </motion.span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <h4 className="mb-5 font-sans font-semibold text-lg text-foreground">
              Contacto
            </h4>
            <div className="space-y-4 font-sans">
              <motion.a
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ duration: 0.2 }}
                href="https://wa.me/573117479392"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-base text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Phone className="h-5 w-5 text-secondary group-hover:text-primary transition-colors" />
                <span>WhatsApp: +57 311 747 9392</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ duration: 0.2 }}
                href="https://instagram.com/zafta_reposteria"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-base text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Instagram className="h-5 w-5 text-secondary group-hover:text-primary transition-colors" />
                <span>@zafta_reposteria</span>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="border-t border-secondary/30 pt-6 text-center space-y-2"
        >
          <p className="text-sm text-muted-foreground font-sans">
            © 2025 ZAFTA Repostería & Panadería. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground font-sans">
            Sitio web hecho con ❤️ por{" "}
            <a
              href="https://www.instagram.com/soraia.web/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:text-secondary transition-colors duration-300 hover:underline"
            >
              Sora
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
