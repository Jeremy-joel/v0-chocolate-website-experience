"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Environment, Sphere } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function ChocolateBar({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Group>(null)
  const wrapperRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 + scrollProgress * Math.PI
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
    
    if (wrapperRef.current) {
      const unwrapAmount = Math.min(scrollProgress * 2, 1)
      wrapperRef.current.scale.x = 1 - unwrapAmount * 0.5
      wrapperRef.current.position.x = unwrapAmount * 2
      wrapperRef.current.rotation.z = unwrapAmount * Math.PI * 0.5
      const material = wrapperRef.current.material as THREE.MeshStandardMaterial
      material.opacity = 1 - unwrapAmount * 0.8
    }
  })

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Main chocolate bar */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 0.4, 2]} />
        <meshStandardMaterial
          color="#2d1810"
          roughness={0.2}
          metalness={0.1}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Chocolate segments */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[((i % 3) - 1) * 0.9, 0.22, i < 3 ? -0.45 : 0.45]}>
          <boxGeometry args={[0.85, 0.05, 0.85]} />
          <meshStandardMaterial
            color="#3d2318"
            roughness={0.15}
            metalness={0.1}
          />
        </mesh>
      ))}
      
      {/* Gold foil wrapper */}
      <mesh ref={wrapperRef} position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.5, 2.2]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function GlowingSphere({ position, color, size = 0.1 }: { position: [number, number, number], color: string, size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          distort={0.3}
          speed={2}
        />
      </Sphere>
    </Float>
  )
}

function Scene3D({ scrollProgress }: { scrollProgress: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#d4af37"
        castShadow
      />
      <spotLight
        position={[-10, -5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#5c4033"
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#fff8e7" />
      
      <ChocolateBar scrollProgress={scrollProgress} />
      
      {/* Floating chocolate pieces */}
      <GlowingSphere position={[-3, 2, -2]} color="#3d2318" size={0.15} />
      <GlowingSphere position={[3, -1, -3]} color="#5c4033" size={0.12} />
      <GlowingSphere position={[2, 2.5, -1]} color="#d4af37" size={0.08} />
      <GlowingSphere position={[-2, -2, -2]} color="#8b7355" size={0.1} />
      
      <Environment preset="studio" />
      <fog attach="fog" args={["#0d0806", 8, 25]} />
    </Canvas>
  )
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)
  
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setScrollProgress(v)
    })
    
    return () => unsubscribe()
  }, [scrollYProgress])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      mouseX.set((clientX - innerWidth / 2) / 50)
      mouseY.set((clientY - innerHeight / 2) / 50)
    }
    
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-title-word",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
          delay: 2.8,
        }
      )
      
      gsap.fromTo(
        ".hero-subtitle",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 3.5,
        }
      )
      
      gsap.fromTo(
        ".hero-cta",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 3.8,
        }
      )
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="relative min-h-[200vh] overflow-hidden"
    >
      {/* 3D Background */}
      <motion.div 
        style={{ scale }}
        className="fixed inset-0 z-0"
      >
        <Scene3D scrollProgress={scrollProgress} />
      </motion.div>
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/50 via-transparent to-background pointer-events-none z-10" />
      <div className="fixed inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30 pointer-events-none z-10" />
      
      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <motion.div
          style={{ x, y }}
          className="text-center px-6 max-w-6xl mx-auto"
        >
          {/* Main Title */}
          <motion.h1
            style={{ y: titleY, opacity: titleOpacity }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-light tracking-tight leading-[0.9] mb-8"
          >
            <span className="hero-title-word inline-block overflow-hidden">
              <span className="inline-block text-gradient-gold">Cold</span>
            </span>
            <br />
            <span className="hero-title-word inline-block overflow-hidden">
              <span className="inline-block text-foreground">Glaze</span>
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            style={{ opacity: titleOpacity }}
            className="hero-subtitle text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-12 tracking-wide leading-relaxed"
          >
            The pinnacle of chocolate artistry. Each piece is a masterwork of flavor,
            crafted for those who demand perfection.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            style={{ opacity: titleOpacity }}
            className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.a
              href="#flavors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gold text-primary-foreground text-sm uppercase tracking-[0.2em] font-medium rounded-full glow-gold transition-all duration-300"
              data-cursor="pointer"
            >
              Explore Collection
            </motion.a>
            
            <motion.a
              href="#story"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 glass-light text-foreground text-sm uppercase tracking-[0.2em] font-medium rounded-full hover:bg-gold/10 transition-all duration-300"
              data-cursor="pointer"
            >
              Our Story
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
        style={{ opacity: titleOpacity }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  )
}
