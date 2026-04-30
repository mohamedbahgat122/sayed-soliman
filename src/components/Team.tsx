"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { dictionary, Locale } from "../dictionaries/dictionary";
import styles from "./Team.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const teamImages = [
  "/image/6.jpeg",
  "/image/1.jpeg",
  "/image/2.jpeg",
  "/image/3.jpeg",
  "/image/4.jpeg",
  "/image/5.jpeg"
];

// Double the images to create a seamless infinite track
const infiniteImages = [...teamImages, ...teamImages];

export default function Team() {
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

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

  useGSAP(() => {
    if (!mounted || !trackRef.current) return;

    // Animate exactly 50% of the double-width track, seamlessly looping back
    tweenRef.current = gsap.to(trackRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 35, // Adjust for base speed
      repeat: -1,
    });
  }, { dependencies: [mounted] });

  const handleMouseEnter = () => {
    if (tweenRef.current) tweenRef.current.pause();
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) tweenRef.current.play();
  };

  if (!mounted) return null;

  const t = dictionary[locale];

  return (
    <section id="team" className={styles.section}>
      <h2 className={styles.title}>{t.navbar.team}</h2>

      <div
        className={styles.sliderContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        dir="ltr" // Critical to force GSAP xPercent math to work perfectly even in Arabic mode
      >
        <div className={styles.sliderTrack} ref={trackRef}>
          {infiniteImages.map((src, idx) => (
            <div key={idx} className={styles.imageCard}>
              <Image
                src={src}
                alt={`Team member ${idx + 1}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 240px, 280px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
