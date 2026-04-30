"use client";

import { useEffect, useState } from "react";
import styles from "./PageLoader.module.css";
import { Locale } from "../dictionaries/dictionary";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [locale, setLocale] = useState<Locale>("ar"); // Default to AR directly as it's the primary language

  useEffect(() => {
    // Initial locale check
    const currentLang = document.documentElement.lang as Locale;
    if (currentLang === "ar" || currentLang === "en") setLocale(currentLang);
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "lang") {
          const newLang = document.documentElement.lang as Locale;
          if (newLang === "ar" || newLang === "en") setLocale(newLang);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Duration of progress simulation
    const duration = 1800; // 1.8 seconds
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const hideLoader = () => {
      setIsFadingOut(true);
      setTimeout(() => setIsUnmounted(true), 800); // 800ms matches CSS transition
    };

    const interval = setInterval(() => {
      currentStep++;
      // Easing function for smoother counter (starts fast, slows down at end)
      const easeOutQuad = (t: number) => t * (2 - t);
      const easeProgress = easeOutQuad(currentStep / totalSteps);
      
      const currentProgress = Math.min(Math.round(easeProgress * 100), 100);
      setProgress(currentProgress);

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        
        if (document.readyState === "complete") {
          hideLoader();
        } else {
          window.addEventListener("load", hideLoader);
        }
      }
    }, intervalTime);

    // Ultimate fallback if things take too long
    const fallbackTimeout = setTimeout(() => {
      hideLoader();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimeout);
      window.removeEventListener("load", hideLoader);
      observer.disconnect();
    };
  }, []);

  if (isUnmounted) return null;

  return (
    <div className={`${styles.overlay} ${isFadingOut ? styles.hidden : ""}`} dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className={styles.counterWrapper}>
        <div className={styles.counterText}>{progress}%</div>
        <div className={styles.subText}>
          {locale === "ar" 
            ? "جاري الحساب ودقة البيانات..." 
            : "Calculating and ensuring data precision..."}
        </div>
      </div>
    </div>
  );
}
