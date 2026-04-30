"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dictionary, Locale } from "../dictionaries/dictionary";
import styles from "./Experience.module.css";

// Register the hook to avoid console warnings
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function Experience() {
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  
  // Track the visual order of cards by their ID [0, 1, 2]
  const [order, setOrder] = useState([0, 1, 2]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  // Animate the arrow drawing itself when scrolled into view
  useGSAP(() => {
    if (!pathRef.current || !svgRef.current) return;

    const pathLength = pathRef.current.getTotalLength();
    
    gsap.set(pathRef.current, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: svgRef.current,
        start: "top 80%",
        end: "top 40%",
        scrub: true,
      },
    });
  }, []);

  // Handle the 3D Stack positioning automatically whenever the `order` state changes
  useGSAP(() => {
    if (!mounted) return;
    
    const cardElements = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);
    
    cardElements.forEach((card) => {
      const cardId = Number(card.dataset.id);
      const positionIndex = order.indexOf(cardId);
      
      // Calculate scaling and positioning logic based on user request
      const scale = 1 - positionIndex * 0.1; // 1, 0.9, 0.8
      const yOffset = positionIndex * -20;   // 0, -20, -40
      const zIndex = 3 - positionIndex;      // 3, 2, 1
      
      // Animate smoothly to the new position
      gsap.to(card, {
        scale: scale,
        y: yOffset,
        zIndex: zIndex,
        opacity: 1, // Reset opacity in case it was animated out
        duration: 0.6,
        ease: "power3.out"
      });
    });
  }, { dependencies: [order, mounted], scope: containerRef });

  const handleCardClick = (clickedId: number) => {
    // Prevent clicking if an animation is already playing or if it's not the front card
    if (isAnimating || order.indexOf(clickedId) !== 0) return;

    setIsAnimating(true);
    const frontCard = document.querySelector(`[data-id="${clickedId}"]`);
    if (!frontCard) return;

    // Swipe direction adapts to layout (Right for LTR, Left for RTL)
    const isRtl = locale === "ar";
    const xOffset = isRtl ? -200 : 200;

    const tl = gsap.timeline({
      onComplete: () => {
        // Shift the array: take the first item and push it to the back
        setOrder(prev => {
          const newOrder = [...prev];
          const first = newOrder.shift();
          if (first !== undefined) newOrder.push(first);
          return newOrder;
        });

        // Instantly reset the thrown card's position behind the scenes 
        // so it can animate back into the stack properly
        gsap.set(frontCard, { x: 0, rotation: 0 });
        setIsAnimating(false);
      }
    });
    
    // Throw card away
    tl.to(frontCard, {
      x: xOffset,
      opacity: 0,
      rotation: isRtl ? -10 : 10,
      duration: 0.4,
      ease: "power2.in"
    });
  };

  // Auto-play functionality
  useEffect(() => {
    if (!mounted || isHovered || isAnimating) return;

    const intervalId = setInterval(() => {
      handleCardClick(order[0]);
    }, 3500);

    return () => clearInterval(intervalId);
  }, [mounted, isHovered, isAnimating, order, locale]);

  if (!mounted) return null;

  const t = dictionary[locale];

  // Map dictionary experiences to include stable IDs
  const experiences = t.experience.map((exp, index) => ({
    id: index,
    ...exp
  }));

  return (
    <section id="experience" className={styles.experienceSection}>
      <div className={styles.arrowWrapper}>
        <svg 
          ref={svgRef}
          width="80" 
          height="100" 
          viewBox="0 0 80 100"
          className={styles.arrowSvg}
        >
          <path
            ref={pathRef}
            d="M40,10 C60,20 80,40 60,60 C40,80 20,60 20,40 C20,20 60,20 60,40 C60,60 40,80 40,90 M28,78 L40,90 L52,78"
            stroke="#d4af37"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className={styles.title}>{t.navbar.experience}</h2>
      
      <div 
        className={styles.stackContainer} 
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {experiences.map((exp) => (
          <div 
            key={exp.id}
            data-id={exp.id}
            className={styles.card}
            onClick={() => handleCardClick(exp.id)}
          >
            <h3 className={styles.jobTitle}>{exp.title}</h3>
            <h4 className={styles.company}>{exp.company}</h4>
            <p className={styles.cardDescription}>{exp.description}</p>
            <span className={styles.date}>{exp.date}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
