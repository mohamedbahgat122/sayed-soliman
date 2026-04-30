"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { dictionary, Locale } from "../dictionaries/dictionary";
import styles from "./Hero.module.css";

export default function Hero() {
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const htmlElement = document.documentElement;
    
    // Initial check for language
    const currentLang = htmlElement.lang as Locale;
    if (currentLang === "ar" || currentLang === "en") {
      setLocale(currentLang);
    }
    
    // MutationObserver ensures the Hero re-renders automatically when the Navbar changes the language on <html>
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

  const t = dictionary[locale].hero;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section id="home" className={styles.heroContainer}>
      {/* Text Section */}
      <motion.div 
        className={styles.textContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span variants={itemVariants} className={styles.greeting}>
          {t.greeting}
        </motion.span>
        
        <motion.h1 variants={itemVariants} className={styles.name}>
          {t.name}
        </motion.h1>
        
        <motion.h2 variants={itemVariants} className={styles.title}>
          {t.title}
        </motion.h2>
        
        <motion.p variants={itemVariants} className={styles.description}>
          {t.description}
        </motion.p>
        
        <motion.div variants={itemVariants} className={styles.buttonGroup}>
          <motion.a 
            href="tel:+966554221965"
            className={styles.primaryButton}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.primaryButton}
          </motion.a>
          
          <motion.a 
            href="#about"
            className={styles.secondaryButton}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.secondaryButton}
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Image Section */}
      <motion.div 
        className={styles.imageContainer}
        initial={{ opacity: 0, scale: 0.95, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      >
        <div className={styles.glow} />
        
        {/* Continuous Floating Container */}
        <motion.div 
          className={styles.animatedBorderWrapper}
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          {/* Inner Card blocking the gradient center */}
          <div className={styles.innerCard}>
            <Image 
              src="/image/sayed.png" 
              alt={t.name}
              fill
              priority
              className={styles.image}
              sizes="(max-width: 992px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
