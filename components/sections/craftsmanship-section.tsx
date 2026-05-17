"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const craftSteps = [
  {
    number: "01",
    title: "Selection",
    description: "We source only the finest cacao beans from single-origin plantations in Ecuador, Ghana, and Madagascar.",
    detail: "Each bean is hand-selected for its unique flavor profile and quality.",
  },
  {
    number: "02",
    title: "Roasting",
    description: "Our master chocolatiers roast each batch at precise temperatures to develop complex flavor notes.",
    detail: "Temperature and timing are calibrated to each bean's origin.",
  },
  {
    number: "03",
    title: "Conching",
    description: "The chocolate is refined for 72 hours, creating an impossibly smooth, velvety texture.",
    detail: "This extended process removes acidity and enhances depth.",
  },
  {
    number: "04",
    title: "Tempering",
    description: "Precise temperature control creates the signature snap and lustrous finish of Cold Glaze.",
    detail: "Our cold-tempering technique gives us our name.",
  },
]

function CraftStep({ step, index }: { step: typeof craftSteps[0], index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative group"
    >
      <div className="flex gap-8 items-start">
        {/* Number */}
        <div className="relative">
          <span className="text-6xl md:text-8xl font-light text-gold/20 group-hover:text-gold/40 transition-colors duration-500">
            {step.number}
          </span>
          <motion.div
            className="absolute -bottom-2 left-0 w-full h-[1px] bg-gold origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
            viewport={{ once: true }}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 pt-4">
          <h3 className="text-2xl md:text-3xl font-light tracking-wide mb-4 text-foreground group-hover:text-gold transition-colors duration-300">
            {step.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {step.description}
          </p>
          <p className="text-sm text-muted-foreground/60 italic">
            {step.detail}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function CraftsmanshipSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax for decorative elements
      gsap.to(".craft-decoration", {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="craft-decoration absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-chocolate-rich/10 blur-3xl" />
        <div className="craft-decoration absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Video/Visual */}
          <motion.div
            ref={videoRef}
            style={{ y, scale }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden"
          >
            {/* Placeholder for video - using animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-chocolate-dark via-chocolate-rich to-chocolate-milk">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  backgroundSize: "30px 30px",
                }}
              />
            </div>
            
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="glass w-24 h-24 rounded-full flex items-center justify-center cursor-pointer glow-gold"
                data-cursor="pointer"
              >
                <svg
                  className="w-8 h-8 text-gold ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </div>
            
            {/* Border frame */}
            <div className="absolute inset-4 border border-gold/20 rounded-xl pointer-events-none" />
            
            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold/40" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/40" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold/40" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold/40" />
          </motion.div>
          
          {/* Right: Content */}
          <motion.div style={{ opacity }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <span className="text-xs uppercase tracking-[0.4em] text-gold mb-4 block">
                The Art of Chocolate
              </span>
              <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
                <span className="text-foreground">Master</span>
                <br />
                <span className="text-gradient-gold">Craftsmanship</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Every piece of Cold Glaze chocolate is the result of generations 
                of expertise, combined with relentless innovation. Our process 
                honors tradition while pushing the boundaries of what chocolate can be.
              </p>
            </motion.div>
            
            {/* Steps */}
            <div className="space-y-12">
              {craftSteps.map((step, index) => (
                <CraftStep key={step.number} step={step} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
