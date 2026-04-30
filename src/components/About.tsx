"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dictionary, Locale } from "../dictionaries/dictionary";
import styles from "./About.module.css";

export default function About() {
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const htmlElement = document.documentElement;
    
    const currentLang = htmlElement.lang as Locale;
    if (currentLang === "ar" || currentLang === "en") {
      setLocale(currentLang);
    }
    
    // Automatically re-render if the language changes in the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "lang") {
          const newLang = htmlElement.lang as Locale;
          if (newLang === "ar" || newLang === "en") {
            setLocale(newLang);
          }
        }
      });
    });
    
    observer.observe(htmlElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  const t = dictionary[locale].about;

  return (
    <section id="about" className={styles.aboutSection}>
      <motion.h2 
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {t.title}
      </motion.h2>

      <div className={styles.glowEffect} />
      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <div className={styles.content}>
          <p>{t.shortContent}</p>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <p style={{ marginTop: "1rem" }}>{t.extendedContent}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button 
            className={styles.readMoreBtn}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? t.readLess : t.readMore}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
