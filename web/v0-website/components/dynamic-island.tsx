"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#compare", label: "Compare" },
  { href: "#pricing", label: "Pricing" },
]

function HexagonLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Hexagon */}
      <path
        d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Pulse line inside */}
      <path
        d="M8 16H12L14 12L16 20L18 14L20 16H24"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function DynamicIsland() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      setIsExpanded(window.scrollY > 80)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 400, damping: 30 }

  return (
    <>
      {/* Desktop Dynamic Island Navbar */}
      {/* Using left-1/2 -translate-x-1/2 as static CSS, only width is animated */}
      <motion.nav
        className="fixed top-6 left-1/2 z-50 hidden md:flex items-center px-6 py-3 navbar-island"
        style={{ x: "-50%" }}
        initial={false}
        animate={{ width: isExpanded ? 680 : 320 }}
        transition={springTransition}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Specular highlight - explicit div instead of pseudo-element for animation compatibility */}
        <div 
          className="absolute top-0 left-[10%] right-[10%] h-px rounded-full pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)" }}
        />

        {/* Content container with proper layout switching */}
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 shrink-0"
            aria-label="HealthByte Home"
          >
            <HexagonLogo className="w-7 h-7" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  className="font-semibold text-[var(--text-1)] overflow-hidden whitespace-nowrap"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={springTransition}
                >
                  HealthByte
                </motion.span>
              )}
            </AnimatePresence>
          </a>

          {/* Compact state: Menu icon only */}
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.button
                key="menu-icon"
                className="text-[var(--text-2)] hover:text-[var(--text-1)] p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                aria-label="Expand menu"
                onClick={() => setIsExpanded(true)}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.div
                key="expanded-content"
                className="flex items-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors whitespace-nowrap"
                  >
                    {link.label}
                  </a>
                ))}

                {/* CTA Button */}
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                >
                  <Button
                    className="rounded-full text-sm font-semibold px-5 whitespace-nowrap"
                    style={{ backgroundColor: "var(--blue)" }}
                  >
                    Get Early Access
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Mobile Bottom Pill Navbar */}
      <nav
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden flex items-center justify-between px-4 py-3 navbar-island w-[calc(100%-32px)] max-w-[400px]"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {/* Specular highlight */}
        <div 
          className="absolute top-0 left-[10%] right-[10%] h-px rounded-full pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)" }}
        />

        {/* Logo */}
        <a href="#" aria-label="HealthByte Home">
          <HexagonLogo className="w-6 h-6" />
        </a>

        {/* Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* CTA */}
        <motion.div
          whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
        >
          <Button
            size="sm"
            className="rounded-full text-sm font-semibold"
            style={{ backgroundColor: "var(--blue)" }}
          >
            Early Access
          </Button>
        </motion.div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden flex items-center justify-center bg-black/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="glass-card p-8 w-[calc(100%-48px)] max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={springTransition}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="text-lg text-[var(--text-1)] py-3 border-b border-[var(--glass-border)]"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, ...springTransition }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, ...springTransition }}
                >
                  <Button
                    className="w-full mt-4 rounded-full font-semibold"
                    style={{ backgroundColor: "var(--blue)" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Early Access
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
