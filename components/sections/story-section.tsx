"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const timelineEvents = [
  {
    year: "1923",
    title: "The Beginning",
    description: "Master chocolatier Henri Beaumont opens a small atelier in the Swiss Alps, dedicated to creating the world's finest chocolate.",
  },
  {
    year: "1957",
    title: "The Discovery",
    description: "Henri's grandson discovers the cold-tempering technique that would become our signature, creating chocolate with an unparalleled snap and shine.",
  },
  {
    year: "1989",
    title: "Global Recognition",
    description: "Cold Glaze wins the prestigious Golden Bean award, establishing our reputation among the world's elite chocolatiers.",
  },
  {
    year: "2024",
    title: "The Future",
    description: "Now in our fourth generation, we continue to push the boundaries of chocolate artistry while honoring our heritage.",
  },
]

export function StorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline progress animation
      gsap.to(".timeline-progress", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
      })
      
      // Event reveal animation
      gsap.utils.toArray(".timeline-event").forEach((event: any, index) => {
        gsap.fromTo(
          event,
          { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
              trigger: event,
              start: "top 80%",
              end: "top 50%",
              scrub: 1,
            },
          }
        )
      })
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Background */}
      <motion.div
        style={{ y: parallaxY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-chocolate-dark/30 to-transparent" />
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full bg-chocolate-rich/20 blur-3xl" />
      </motion.div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="max-w-3xl mb-24"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-gold mb-4 block">
            Our Heritage
          </span>
          <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-8">
            <span className="text-foreground">A Century of</span>
            <br />
            <span className="text-gradient-gold">Excellence</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            For over 100 years, the Beaumont family has dedicated their lives 
            to perfecting the art of chocolate. Our story is one of passion, 
            innovation, and an unwavering commitment to quality.
          </p>
        </motion.div>
        
        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-muted -translate-x-1/2 hidden lg:block">
            <div className="timeline-progress absolute top-0 left-0 w-full h-0 bg-gold" />
          </div>
          
          {/* Timeline events */}
          <div className="space-y-24 lg:space-y-32">
            {timelineEvents.map((event, index) => (
              <div
                key={event.year}
                className={`timeline-event relative lg:flex lg:items-center ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`lg:w-1/2 ${index % 2 === 0 ? "lg:pr-16 lg:text-right" : "lg:pl-16"}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="glass p-8 rounded-2xl"
                  >
                    <span className="text-5xl md:text-6xl font-light text-gold/40 block mb-4">
                      {event.year}
                    </span>
                    <h3 className="text-2xl font-light text-foreground mb-4 tracking-wide">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </motion.div>
                </div>
                
                {/* Center dot */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gold z-10">
                  <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-20" />
                </div>
                
                {/* Spacer for other side */}
                <div className="hidden lg:block lg:w-1/2" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-32 text-center max-w-3xl mx-auto"
        >
          <blockquote>
            <p className="text-2xl md:text-4xl font-light text-foreground leading-relaxed mb-8 italic">
              &ldquo;Chocolate is not just food. It is an art form, a meditation, 
              a way of connecting with the deepest pleasures of life.&rdquo;
            </p>
            <footer className="text-muted-foreground">
              <span className="text-gold">— Henri Beaumont</span>, Founder
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  )
}
