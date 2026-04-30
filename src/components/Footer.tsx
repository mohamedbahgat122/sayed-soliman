"use client";

import { useState, useEffect } from "react";
import { dictionary, Locale } from "../dictionaries/dictionary";
import styles from "./Footer.module.css";

export default function Footer() {
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const htmlElement = document.documentElement;
    const currentLang = htmlElement.lang as Locale;
    if (currentLang === "ar" || currentLang === "en") setLocale(currentLang);
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "lang") {
          const newLang = htmlElement.lang as Locale;
          if (newLang === "ar" || newLang === "en") setLocale(newLang);
        }
      });
    });
    observer.observe(htmlElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  const t = dictionary[locale];

  return (
    <footer className={styles.footer}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p className={styles.text}>{t.footer.copyright}</p>
        <div className={styles.developerCredit} dir="rtl">
          <span>تم التطوير والإنشاء بواسطة المهندس / محمد بهجت</span>
          <span className={styles.separator}>|</span>
          <a href="https://wa.me/201035624486" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
            تواصل معي
          </a>
        </div>
      </div>
    </footer>
  );
}
