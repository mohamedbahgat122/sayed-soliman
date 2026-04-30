import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Qualifications from "@/components/Qualifications";
import Partners from "@/components/Partners";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden">
      <Hero />
      <About />
      <Experience />
      <Qualifications />
      <Partners />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}