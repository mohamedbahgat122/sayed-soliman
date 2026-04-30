"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dictionary, Locale } from "../dictionaries/dictionary";
import styles from "./Qualifications.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function Qualifications() {
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trunkRef = useRef<HTMLDivElement>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

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
    if (!mounted || !trunkRef.current || !containerRef.current) return;

    // 1. Draw top SVG decorative arrow
    if (pathRef.current && svgRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 80%",
          toggleActions: "restart reset restart reset",
        },
      });
    }

    // 2. Animate central trunk drawing from top to bottom
    gsap.fromTo(trunkRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "restart reset restart reset"
        }
      }
    );

    // 3. Animate each timeline row (cards and branches)
    const rows = gsap.utils.toArray<HTMLElement>(`.${styles.timelineRow}`);
    const isMobile = window.innerWidth <= 768;
    
    rows.forEach((row, index) => {
      const card = row.querySelector(`.${styles.cardWrapper}`);
      const dot = row.querySelector(`.${styles.nodeDot}`);
      const branch = row.querySelector(`.${styles.branchLine}`);
      
      const isLeft = index % 2 === 0;
      
      // X-offset logic for sliding animations (applies seamlessly to both desktop and miniature mobile tree)
      const xOffset = isLeft ? -50 : 50;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 80%", // Animates slightly before reaching the middle
          toggleActions: "restart reset restart reset"
        }
      });

      // Pop in the gold dot
      if (dot) {
        tl.fromTo(dot, 
          { scale: 0, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }
        );
      }
      
      // Expand the horizontal branch from the trunk to the card
      if (branch) {
        tl.fromTo(branch,
          { scaleX: 0, transformOrigin: isLeft && !isMobile ? "right center" : "left center" },
          { scaleX: 1, duration: 0.3, ease: "power2.out" },
          "-=0.2"
        );
      }

      // Slide and fade in the card
      if (card) {
        tl.fromTo(card,
          { x: xOffset, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.1"
        );
      }
    });

  }, { dependencies: [mounted], scope: sectionRef });

  if (!mounted) return null;

  const t = dictionary[locale];

  return (
    <section id="qualifications" className={styles.section} ref={sectionRef}>
      
      {/* Decorative Arrow connecting from previous section */}
      <div className={styles.arrowWrapper}>
        <svg ref={svgRef} width="150" height="250" viewBox="0 0 150 250" className={styles.arrowSvg}>
          <path
            ref={pathRef}
            d="M75,10 C10,100 140,150 75,240 M50,215 L75,240 L100,215"
            stroke="#d4af37"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className={styles.title}>{t.qualifications.title}</h2>
      
      {/* Structural layout forced to ltr to maintain timeline logic */}
      <div className={styles.timelineContainer} ref={containerRef} dir="ltr">
        
        {/* Animated Vertical Trunk Line */}
        <div className={styles.trunkLine} ref={trunkRef}></div>

        {t.qualifications.items.map((item, index) => {
          const isLeft = index % 2 === 0;
          const rowClass = isLeft ? styles.rowLeft : styles.rowRight;
          
          return (
            <div key={index} className={`${styles.timelineRow} ${rowClass}`}>
              
              {/* Connecting Dot and Branch */}
              <div className={styles.nodeDot}></div>
              <div className={styles.branchLine}></div>
              
              {/* Card Container */}
              <div className={styles.cardWrapper}>
                {/* Reset direction to match locale for proper text layout */}
                <div className={styles.card} dir={locale === "ar" ? "rtl" : "ltr"}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
