"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ArrowRight, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTABannerSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 md:px-8 relative"
      id="early-access"
      aria-label="Call to Action"
    >
      {/* Background Glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(10, 132, 255, 0.1) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="py-12 md:py-16 px-8 md:px-12 text-center bg-white/[0.04] backdrop-blur-xl border-y border-[var(--glass-border)]"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-1)] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
          >
            Start Optimizing Your Biology.
          </motion.h2>

          <motion.p
            className="text-lg text-[var(--text-2)] mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
          >
            Join the early access waitlist. Free forever for core features. No credit card required.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.3 }}
          >
            {/* Primary CTA */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            >
              <Button
                className="h-12 px-8 rounded-full font-semibold glow-blue"
                style={{ backgroundColor: "var(--blue)" }}
              >
                Join Early Access
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Secondary - Coming Soon */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            >
              <Button
                variant="ghost"
                className="h-12 px-6 rounded-full font-semibold bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-1)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-1)]"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                iOS & Android — Coming Soon
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
