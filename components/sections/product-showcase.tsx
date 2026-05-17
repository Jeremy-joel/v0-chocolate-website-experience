"use client"

import { useRef, useState, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { 
  Environment, 
  ContactShadows, 
  Float,
  Text3D,
  Center,
  useMatcapTexture,
  OrbitControls
} from "@react-three/drei"
import * as THREE from "three"

const products = [
  {
    id: 1,
    name: "Dark Velvet Collection",
    price: 89,
    pieces: 24,
    description: "Our signature dark chocolate collection, featuring 24 handcrafted pieces of pure indulgence.",
  },
  {
    id: 2,
    name: "Seasonal Selection",
    price: 129,
    pieces: 36,
    description: "A curated journey through all four flavor worlds, perfect for the discerning palate.",
  },
  {
    id: 3,
    name: "Grand Tasting Box",
    price: 249,
    pieces: 64,
    description: "The ultimate Cold Glaze experience. Our complete collection in a luxurious presentation box.",
  },
]

function ChocolateBox({ isHovered }: { isHovered: boolean }) {
  const boxRef = useRef<THREE.Group>(null)
  const lidRef = useRef<THREE.Mesh>(null)
  const [matcap] = useMatcapTexture("422509_C89536_824512_0A0604", 256)
  
  useFrame((state) => {
    if (boxRef.current) {
      boxRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (lidRef.current) {
      lidRef.current.rotation.x = isHovered 
        ? THREE.MathUtils.lerp(lidRef.current.rotation.x, -Math.PI * 0.4, 0.1)
        : THREE.MathUtils.lerp(lidRef.current.rotation.x, 0, 0.1)
      lidRef.current.position.y = isHovered
        ? THREE.MathUtils.lerp(lidRef.current.position.y, 0.8, 0.1)
        : THREE.MathUtils.lerp(lidRef.current.position.y, 0.5, 0.1)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={boxRef}>
        {/* Box base */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.8, 2.5]} />
          <meshMatcapMaterial matcap={matcap} color="#2d1810" />
        </mesh>
        
        {/* Inner chocolates */}
        {isHovered && (
          <>
            {[...Array(9)].map((_, i) => (
              <mesh
                key={i}
                position={[
                  ((i % 3) - 1) * 0.7,
                  0.45,
                  (Math.floor(i / 3) - 1) * 0.7
                ]}
              >
                <boxGeometry args={[0.5, 0.2, 0.5]} />
                <meshStandardMaterial
                  color="#3d2318"
                  roughness={0.2}
                  metalness={0.1}
                />
              </mesh>
            ))}
          </>
        )}
        
        {/* Gold trim */}
        <mesh position={[0, 0.41, 0]}>
          <boxGeometry args={[2.52, 0.02, 2.52]} />
          <meshStandardMaterial
            color="#d4af37"
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        
        {/* Lid */}
        <mesh ref={lidRef} position={[0, 0.5, -1.25]}>
          <boxGeometry args={[2.5, 0.15, 2.5]} />
          <meshMatcapMaterial matcap={matcap} color="#2d1810" />
        </mesh>
      </group>
    </Float>
  )
}

function ProductScene({ isHovered }: { isHovered: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <spotLight
        position={[5, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#d4af37"
        castShadow
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#fff8e7" />
      
      <Suspense fallback={null}>
        <ChocolateBox isHovered={isHovered} />
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
          color="#1a0f0a"
        />
        <Environment preset="studio" />
      </Suspense>
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}

function ProductCard({ product, isActive, onClick }: { 
  product: typeof products[0], 
  isActive: boolean,
  onClick: () => void 
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      layout
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer ${isActive ? "lg:col-span-2" : ""}`}
      data-cursor="pointer"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden rounded-2xl glass transition-all duration-500 ${
          isActive ? "h-[500px]" : "h-[400px]"
        }`}
      >
        {/* 3D Product View */}
        <div className="absolute inset-0">
          <ProductScene isHovered={isHovered || isActive} />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <motion.div layout>
            <span className="text-gold text-sm uppercase tracking-[0.3em] mb-2 block">
              {product.pieces} Pieces
            </span>
            
            <h3 className="text-2xl md:text-3xl font-light tracking-wide mb-3 text-foreground">
              {product.name}
            </h3>
            
            <AnimatePresence>
              {isActive && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-muted-foreground text-sm leading-relaxed mb-6"
                >
                  {product.description}
                </motion.p>
              )}
            </AnimatePresence>
            
            <div className="flex items-center justify-between">
              <span className="text-3xl font-light text-gold">
                ${product.price}
              </span>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 glass-light text-xs uppercase tracking-[0.2em] text-gold rounded-full hover:bg-gold/10 transition-colors"
              >
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: isHovered || isActive
              ? "inset 0 0 60px rgba(212, 175, 55, 0.1)"
              : "inset 0 0 0px rgba(212, 175, 55, 0)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  )
}

export function ProductShowcase() {
  const [activeProduct, setActiveProduct] = useState(1)

  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/5 blur-3xl" />
      </div>
      
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
            Premium Selection
          </span>
          <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
            <span className="text-foreground">Luxury</span>{" "}
            <span className="text-gradient-gold">Showcase</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            Explore our curated collections, each presented in handcrafted 
            packaging worthy of the treasures within.
          </p>
        </motion.div>
        
        {/* Product grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isActive={activeProduct === product.id}
              onClick={() => setActiveProduct(product.id)}
            />
          ))}
        </div>
        
        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {[
            { label: "Free Shipping", value: "Worldwide" },
            { label: "Temperature Control", value: "Guaranteed" },
            { label: "Gift Wrapping", value: "Complimentary" },
            { label: "Satisfaction", value: "100%" },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <span className="text-2xl md:text-3xl font-light text-gold block mb-2">
                {item.value}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
