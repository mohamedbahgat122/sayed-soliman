"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { dictionary, Locale } from "../dictionaries/dictionary";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [locale, setLocale] = useState<Locale>("en");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize locale from HTML attribute
    const currentLang = document.documentElement.lang as Locale;
    if (currentLang === "ar" || currentLang === "en") {
      setLocale(currentLang);
    }
    
    // Next-themes automatically manages the HTML class, so we don't need to manually check it here.
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    setLocale(newLocale);
    
    // Update DOM language & direction
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  // Don't render until client mounts to prevent hydration mismatches
  if (!mounted) return null;

  const t = dictionary[locale].navbar;

  const navItems = [
    { key: "home", label: t.home },
    { key: "about", label: t.about },
    { key: "experience", label: t.experience },
    { key: "qualifications", label: t.education },
    { key: "partners", label: t.partners },
    { key: "team", label: t.team },
    { key: "contact", label: t.contact },
  ];

  return (
    <motion.nav
      className={styles.navbarContainer}
      initial={{ y: -100, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Spring-like smooth entrance
    >
      {/* Brand Logo */}
      <motion.div 
        className={styles.brand}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <a href="#home" style={{ textDecoration: 'none', color: 'inherit' }}>
          {t.brand}
        </a>
      </motion.div>

      {/* Navigation Links */}
      <ul className={styles.navLinks}>
        {navItems.map((item) => (
          <motion.li 
            key={item.key} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <a href={`#${item.key}`} className={styles.navLink}>
              {item.label}
            </a>
          </motion.li>
        ))}
      </ul>

      {/* Action Toggles */}
      <div className={styles.actions}>
        <motion.button
          onClick={toggleTheme}
          className={styles.iconButton}
          aria-label={t.themeToggleAria}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>
        
        <motion.button
          onClick={toggleLanguage}
          className={styles.langTextBtn}
          aria-label={dictionary[locale].languageToggle.ariaLabel}
          title={dictionary[locale].languageToggle.switchTo}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {locale === "en" ? "AR" : "EN"}
        </motion.button>
      </div>
    </motion.nav>
  );
}
