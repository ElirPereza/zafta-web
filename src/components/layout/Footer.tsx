"use client";

import { motion } from "framer-motion";
import { Instagram, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { FaTiktok, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 bg-transparent"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-3 mb-6 sm:mb-8"
        >
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center md:items-start w-full"
          >
            <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center w-full md:justify-start">
              {/* Logo completo */}
              <Logo
                variant="banner-color-1"
                width={200}
                height={162}
                className="w-24 sm:w-32 h-auto"
              />
            </div>
            <p className="text-base sm:text-lg font-sans text-primary leading-relaxed text-center md:text-left w-full">
              Lo delicioso se vuelve tradición
            </p>
            <p className="text-xs sm:text-sm font-sans font-light text-muted-foreground mt-2 sm:mt-4 text-center md:text-left w-full">
              Donde cada porción cuenta una historia dulce.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="text-center md:text-left"
          >
            <h4 className="mb-3 sm:mb-5 font-gotham font-semibold text-base sm:text-lg text-foreground">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base font-sans">
              <li>
                <Link href="/productos">
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:underline decoration-primary inline-block cursor-pointer"
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
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:underline decoration-primary inline-block cursor-pointer"
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
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:underline decoration-primary inline-block cursor-pointer"
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
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:underline decoration-primary inline-block cursor-pointer"
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
            className="text-center md:text-left"
          >
            <h4 className="mb-3 sm:mb-5 font-gotham font-semibold text-base sm:text-lg text-foreground">
              Contacto
            </h4>
            <div className="space-y-2 sm:space-y-4 font-sans flex flex-col items-center md:items-start">
              <motion.a
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ duration: 0.2 }}
                href="https://wa.me/573217590897"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-primary-dark transition-colors" />
                <span>WhatsApp: +57 321 759 0897</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ duration: 0.2 }}
                href="https://instagram.com/zafta_reposteria"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-primary-dark transition-colors" />
                <span>@zafta_reposteria</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ duration: 0.2 }}
                href="https://www.tiktok.com/@zafta_reposteria"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <FaTiktok className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-primary-dark transition-colors" />
                <span>@zafta_reposteria</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ duration: 0.2 }}
                href="https://www.facebook.com/zaftareposteria"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-primary-dark transition-colors" />
                <span>Zafta Repostería</span>
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
          className="border-t border-primary/20 pt-4 sm:pt-6 text-center space-y-1 sm:space-y-2"
        >
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            © 2025 ZAFTA Repostería & Panadería. Todos los derechos reservados.
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground font-sans">
            Sitio web hecho con ❤️ por{" "}
            <a
              href="https://www.instagram.com/soraia.web/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:text-primary-dark transition-colors duration-300 hover:underline"
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
