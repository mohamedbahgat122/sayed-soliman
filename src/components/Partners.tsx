"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dictionary, Locale } from "../dictionaries/dictionary";
import { Building2, Truck, Globe, Briefcase, Package, MapPin, Network } from "lucide-react";
import styles from "./Partners.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const icons = [Building2, Truck, Globe, Briefcase, Package, MapPin];

export default function Partners() {
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);
  const [paths, setPaths] = useState<string[]>([]);
  
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rootNodeRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Observe language changes to adjust locale
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

  // Calculate dynamic SVG paths relative to the container
  const calculatePaths = () => {
    if (!containerRef.current || !rootNodeRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const rootRect = rootNodeRef.current.getBoundingClientRect();
    
    // Start exactly at the bottom-center of the root node
    const startX = rootRect.left - containerRect.left + rootRect.width / 2;
    const startY = rootRect.bottom - containerRect.top;

    const newPaths = cardRefs.current.map(card => {
      if (!card) return "";
      const cardRect = card.getBoundingClientRect();
      
      // End exactly at the top-center of each card
      const endX = cardRect.left - containerRect.left + cardRect.width / 2;
      const endY = cardRect.top - containerRect.top;
      
      // Control points for a beautiful cascading curved line
      const curvature = 80;
      return `M ${startX} ${startY} C ${startX} ${startY + curvature}, ${endX} ${endY - curvature}, ${endX} ${endY}`;
    });
    
    setPaths(newPaths);
  };

  useEffect(() => {
    if (!mounted) return;
    
    // Initial calculation (slight delay ensures fonts and layout are settled)
    const timer = setTimeout(calculatePaths, 150);
    
    // Recalculate on window resize to ensure lines stay connected perfectly
    window.addEventListener("resize", calculatePaths);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculatePaths);
    };
  }, [mounted, locale]); // re-calc if language flips direction

  useGSAP(() => {
    if (!mounted || paths.length === 0) return;

    const branches = gsap.utils.toArray<SVGPathElement>('.tree-branch');
    const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 65%",
        toggleActions: "restart reset restart reset"
      }
    });

    // Hide initially
    gsap.set(branches, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(cards, { scale: 0, opacity: 0 });

    // 1. Draw all branches outward from the root
    tl.to(branches, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: "power2.inOut",
      stagger: 0.1
    });

    // 2. Pop cards as their branches reach them
    tl.to(cards, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.5)",
      stagger: 0.1
    }, "-=1.0"); // Overlap timeline to synchronize visual pop

  }, { dependencies: [paths, mounted], scope: sectionRef });

  if (!mounted) return null;

  const t = dictionary[locale];

  return (
    <section id="partners" className={styles.section} ref={sectionRef}>
      <h2 className={styles.title}>{t.partners.title}</h2>
      
      <div className={styles.treeContainer} ref={containerRef}>
        
        {/* Absolute SVG Overlay rendering dynamic curved branches */}
        <svg className={styles.svgOverlay} preserveAspectRatio="none">
          <defs>
            <linearGradient id="branchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="1" />
              <stop offset="100%" stopColor="#fde047" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {paths.map((path, idx) => (
            <path
              key={idx}
              className="tree-branch"
              d={path}
              stroke="url(#branchGrad)"
              strokeWidth="3"
              fill="none"
              pathLength="1"
            />
          ))}
        </svg>

        {/* Root Origin Node */}
        <div className={styles.rootNodeWrapper}>
          <div className={styles.rootNode} ref={rootNodeRef}>
            <Network size={45} strokeWidth={1.5} />
          </div>
        </div>

        {/* Responsive Flex/Grid wrap for the Partner Cards */}
        <div className={styles.cardsGrid} dir={locale === "ar" ? "rtl" : "ltr"}>
          {t.partners.items.map((partner, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div 
                key={index} 
                className={styles.card}
                ref={(el) => { cardRefs.current[index] = el; }}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <span className={styles.cardText}>{partner}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
