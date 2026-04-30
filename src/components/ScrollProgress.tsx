"use client";

import { motion, useScroll } from "framer-motion";
import styles from "./ScrollProgress.module.css";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 6 nodes representing sections (Home, About, Experience, Qualifications, Partners, Contact)
  const nodes = [0, 20, 40, 60, 80, 100];

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.progressBar}
        style={{ scaleY: scrollYProgress }}
      />
      {nodes.map((pos, index) => (
        <div 
          key={index} 
          className={styles.node} 
          style={{ top: `${pos}%` }} 
        />
      ))}
    </div>
  );
}
