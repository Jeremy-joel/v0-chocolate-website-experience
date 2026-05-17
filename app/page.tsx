"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { HeroSection } from "@/components/sections/hero-section"
import { FlavorWorlds } from "@/components/sections/flavor-worlds"
import { CraftsmanshipSection } from "@/components/sections/craftsmanship-section"
import { ProductShowcase } from "@/components/sections/product-showcase"
import { StorySection } from "@/components/sections/story-section"
import { PurchaseLounge } from "@/components/sections/purchase-lounge"
import { Navigation } from "@/components/navigation"
import { CustomCursor } from "@/components/custom-cursor"
import { LoadingScreen } from "@/components/loading-screen"
import { ParticleBackground } from "@/components/particle-background"

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    lenis.on("scroll", ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => {
      lenis.destroy()
      clearTimeout(timer)
    }
  }, [])

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.1], [0.3, 0.1])

  return (
    <>
      <CustomCursor />
      <LoadingScreen isLoading={isLoading} />
      
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative min-h-screen"
      >
        <motion.div 
          style={{ opacity: backgroundOpacity }}
          className="fixed inset-0 pointer-events-none z-0"
        >
          <ParticleBackground />
        </motion.div>

        <Navigation />
        
        <main className="relative z-10">
          <HeroSection />
          <FlavorWorlds />
          <CraftsmanshipSection />
          <ProductShowcase />
          <StorySection />
          <PurchaseLounge />
        </main>
      </motion.div>
    </>
  )
}
