"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { dictionary, Locale } from "../../dictionaries/dictionary";
import styles from "./LanguageToggle.module.css";

export default function LanguageToggle() {
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatches
  useEffect(() => {
    setMounted(true);
    // Initialize language from HTML lang attribute or default to English
    const currentLang = document.documentElement.lang as Locale;
    if (currentLang === "ar" || currentLang === "en") {
      setLocale(currentLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    setLocale(newLocale);
    
    // Update the DOM to reflect the change
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
  };

  if (!mounted) {
    return null; // or a skeleton placeholder
  }

  const t = dictionary[locale].languageToggle;

  return (
    <div className={styles.toggleContainer}>
      <motion.button
        className={styles.toggleButton}
        onClick={toggleLanguage}
        aria-label={t.ariaLabel}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: locale === "ar" ? 180 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Globe className={styles.icon} />
        </motion.div>
        <span className={styles.text}>{t.switchTo}</span>
      </motion.button>
    </div>
  );
}
