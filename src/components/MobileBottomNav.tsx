"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { dictionary, Locale } from "../dictionaries/dictionary";
import { Home, User, GraduationCap, Handshake, Phone } from "lucide-react";
import styles from "./MobileBottomNav.module.css";

export default function MobileBottomNav() {
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

  const t = dictionary[locale].navbar;

  const navItems = [
    { key: "home", label: t.home, href: "#home", icon: Home },
    { key: "about", label: t.about, href: "#about", icon: User },
    { key: "qualifications", label: t.education, href: "#qualifications", icon: GraduationCap },
    { key: "partners", label: t.partners, href: "#partners", icon: Handshake },
    { key: "contact", label: t.contact, href: "#contact", icon: Phone },
  ];

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.key} href={item.href} className={styles.navItem}>
            <Icon />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
