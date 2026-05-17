"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

const flavors = [
  {
    id: "dark-velvet",
    name: "Dark Velvet",
    description: "Pure 85% cacao, velvety smooth with notes of espresso and dark cherry. An intense journey into chocolate's deepest secrets.",
    colors: {
      primary: "#2d1810",
      secondary: "#d4af37",
      glow: "rgba(212, 175, 55, 0.3)",
      particles: "#8b7355",
    },
    ingredients: ["85% Cacao", "Madagascar Vanilla", "Espresso", "Dark Cherry"],
  },
  {
    id: "berry-frost",
    name: "Berry Frost",
    description: "White chocolate infused with wild Nordic berries and a hint of lavender. A delicate dance of sweetness and floral notes.",
    colors: {
      primary: "#8b4f7a",
      secondary: "#e8b4d8",
      glow: "rgba(232, 180, 216, 0.3)",
      particles: "#c77dab",
    },
    ingredients: ["White Chocolate", "Wild Berries", "Lavender", "Nordic Honey"],
  },
  {
    id: "mint-glacier",
    name: "Mint Glacier",
    description: "Crisp peppermint meets silky dark chocolate, finished with crystallized mint leaves. Refreshingly sophisticated.",
    colors: {
      primary: "#1a4d4d",
      secondary: "#7fdbdb",
      glow: "rgba(127, 219, 219, 0.3)",
      particles: "#4aa3a3",
    },
    ingredients: ["Dark Chocolate", "Fresh Mint", "Crystal Sugar", "Spearmint"],
  },
  {
    id: "caramel-eclipse",
    name: "Caramel Eclipse",
    description: "Burnt caramel swirled through milk chocolate with Himalayan pink salt. A perfect balance of sweet and savory.",
    colors: {
      primary: "#8b4513",
      secondary: "#daa520",
      glow: "rgba(218, 165, 32, 0.3)",
      particles: "#cd853f",
    },
    ingredients: ["Milk Chocolate", "Burnt Caramel", "Pink Salt", "Bourbon Vanilla"],
  },
]

function FlavorSphere({ color, index }: { color: string, index: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime + index) * 0.3
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.3}
          distort={0.4}
          speed={2}
        />
      </Sphere>
    </Float>
  )
}

function FlavorScene({ color }: { color: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 5, 5]} intensity={1} color={color} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#ffffff" />
      
      <FlavorSphere color={color} index={0} />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.2}>
          <Sphere 
            args={[0.1 + Math.random() * 0.1, 16, 16]} 
            position={[
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 3
            ]}
          >
            <meshStandardMaterial color={color} transparent opacity={0.6} />
          </Sphere>
        </Float>
      ))}
      
      <fog attach="fog" args={["#0d0806", 5, 15]} />
    </Canvas>
  )
}

function FlavorCard({ flavor, index, isActive, onClick }: { 
  flavor: typeof flavors[0], 
  index: number,
  isActive: boolean,
  onClick: () => void 
}) {
  return (
    <motion.div
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative cursor-pointer group ${
        isActive ? "col-span-2 row-span-2" : ""
      }`}
      data-cursor="pointer"
    >
      <motion.div
        whileHover={{ scale: isActive ? 1 : 1.02 }}
        className={`relative overflow-hidden rounded-2xl glass transition-all duration-500 ${
          isActive ? "h-[500px]" : "h-[280px]"
        }`}
        style={{
          boxShadow: isActive ? `0 0 60px ${flavor.colors.glow}` : "none",
        }}
      >
        {/* 3D Background */}
        <div className="absolute inset-0 opacity-60">
          <FlavorScene color={flavor.colors.primary} />
        </div>
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"
        />
        
        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <motion.div
            animate={{ 
              height: isActive ? "auto" : "auto",
            }}
          >
            <span 
              className="text-xs uppercase tracking-[0.3em] mb-2 block"
              style={{ color: flavor.colors.secondary }}
            >
              Signature
            </span>
            
            <h3 className="text-2xl md:text-3xl font-light tracking-wide mb-3 text-foreground">
              {flavor.name}
            </h3>
            
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
                  {flavor.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {flavor.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="px-3 py-1 text-xs uppercase tracking-wider rounded-full glass-light"
                      style={{ color: flavor.colors.secondary }}
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Hover line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ backgroundColor: flavor.colors.secondary }}
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export function FlavorWorlds() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section
      ref={sectionRef}
      id="flavors"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Ambient background */}
      <motion.div
        style={{ opacity: backgroundOpacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${flavors[activeIndex].colors.glow} 0%, transparent 50%)`,
          }}
        />
      </motion.div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-gold mb-4 block">
            Signature Collection
          </span>
          <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
            <span className="text-gradient-gold">Flavor</span>{" "}
            <span className="text-foreground">Worlds</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            Each flavor is a universe unto itself. Explore our four signature
            experiences, crafted to transport your senses.
          </p>
        </motion.div>
        
        {/* Flavor grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
          {flavors.map((flavor, index) => (
            <FlavorCard
              key={flavor.id}
              flavor={flavor}
              index={index}
              isActive={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        
        {/* Navigation dots */}
        <div className="flex justify-center gap-3 mt-12">
          {flavors.map((flavor, index) => (
            <button
              key={flavor.id}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === index 
                  ? "w-8 bg-gold" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              data-cursor="pointer"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
