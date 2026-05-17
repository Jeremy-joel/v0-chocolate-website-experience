"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const products = [
  {
    id: 1,
    name: "Dark Velvet Collection",
    price: 89,
    image: "dark",
  },
  {
    id: 2,
    name: "Berry Frost Selection",
    price: 95,
    image: "berry",
  },
  {
    id: 3,
    name: "Mint Glacier Box",
    price: 85,
    image: "mint",
  },
  {
    id: 4,
    name: "Caramel Eclipse Set",
    price: 92,
    image: "caramel",
  },
]

function ProductTile({ product, isSelected, onSelect }: {
  product: typeof products[0],
  isSelected: boolean,
  onSelect: () => void
}) {
  const colorMap: Record<string, string> = {
    dark: "#2d1810",
    berry: "#8b4f7a",
    mint: "#1a4d4d",
    caramel: "#8b4513",
  }
  
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-6 rounded-xl transition-all duration-300 text-left ${
        isSelected ? "glass glow-gold" : "glass-light hover:glass"
      }`}
      data-cursor="pointer"
    >
      {/* Color indicator */}
      <div 
        className="w-12 h-12 rounded-lg mb-4"
        style={{ backgroundColor: colorMap[product.image] }}
      />
      
      <h4 className="text-foreground font-light mb-1">{product.name}</h4>
      <span className="text-gold text-lg">${product.price}</span>
      
      {isSelected && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gold"
        />
      )}
    </motion.button>
  )
}

export function PurchaseLounge() {
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [quantity, setQuantity] = useState(1)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <section
      id="purchase"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-chocolate-dark/20 to-background" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-gold mb-4 block">
            Premium Purchase
          </span>
          <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
            <span className="text-foreground">The</span>{" "}
            <span className="text-gradient-gold">Lounge</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            Select your preferred collection and experience the luxury of Cold Glaze 
            delivered directly to your door.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Product Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-light text-foreground mb-6 tracking-wide">
              Select Collection
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {products.map((product) => (
                <ProductTile
                  key={product.id}
                  product={product}
                  isSelected={selectedProduct.id === product.id}
                  onSelect={() => setSelectedProduct(product)}
                />
              ))}
            </div>
            
            {/* Quantity selector */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-foreground">Quantity</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full glass-light flex items-center justify-center text-foreground hover:bg-gold/10 transition-colors"
                    data-cursor="pointer"
                  >
                    −
                  </button>
                  <span className="text-xl font-light text-gold w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full glass-light flex items-center justify-center text-foreground hover:bg-gold/10 transition-colors"
                    data-cursor="pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="text-3xl font-light text-gold">
                  ${selectedProduct.price * quantity}
                </span>
              </div>
            </div>
          </motion.div>
          
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass p-8 md:p-12 rounded-2xl"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-light text-foreground mb-8 tracking-wide">
                    Reserve Your Collection
                  </h3>
                  
                  <div>
                    <label className="block text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Shipping Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter your full shipping address"
                      className="w-full px-4 py-3 bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gold text-primary-foreground text-sm uppercase tracking-[0.2em] font-medium rounded-lg glow-gold transition-all duration-300 disabled:opacity-50"
                    data-cursor="pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                        Processing...
                      </span>
                    ) : (
                      `Complete Order • $${selectedProduct.price * quantity}`
                    )}
                  </motion.button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Secure checkout powered by Stripe. Your payment information is encrypted.
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <svg
                      className="w-10 h-10 text-gold"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                  
                  <h3 className="text-2xl font-light text-foreground mb-4">
                    Thank You
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Your order has been received. We&apos;ll send you a confirmation
                    email with tracking details shortly.
                  </p>
                  
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setEmail("")
                      setQuantity(1)
                    }}
                    className="px-8 py-3 glass-light text-sm uppercase tracking-[0.2em] text-gold rounded-full hover:bg-gold/10 transition-colors"
                    data-cursor="pointer"
                  >
                    Place Another Order
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-32 pt-12 border-t border-border"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-2xl font-light tracking-[0.3em] text-gradient-gold">
              COLD GLAZE
            </div>
            
            <div className="flex items-center gap-8">
              {["Instagram", "Twitter", "Pinterest"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                  data-cursor="pointer"
                >
                  {social}
                </a>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 Cold Glaze Chocolate. All rights reserved.
            </p>
          </div>
        </motion.footer>
      </div>
    </section>
  )
}
