"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ScanLine, Wifi, BarChart3 } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Snap",
    description: "Photograph your meal. YOLO + ViT identifies dish, ingredients, and density automatically.",
    icon: ScanLine,
    color: "var(--blue)",
  },
  {
    number: "02",
    title: "Fuse",
    description: "Connect Oura Ring or Apple Watch. HRV, sleep stages, and activity stream in continuously.",
    icon: Wifi,
    color: "var(--purple)",
  },
  {
    number: "03",
    title: "Score",
    description: "Every week, your Behavioral Impact Score reveals exactly what's helping and what's hurting — ranked by predicted effect.",
    icon: BarChart3,
    color: "var(--yellow)",
  },
]

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-24 px-4 md:px-8"
      aria-label="How It Works"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-1)] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6 }}
          >
            Three Inputs. One Score.
          </motion.h2>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Dashed Connector Line - uses percentage-based positioning */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 hidden md:block pointer-events-none px-[16.67%]">
            <motion.div
              className="h-0.5 w-full"
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 8px, transparent 8px, transparent 16px)",
              }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 1.5, delay: 0.5, ease: "easeOut" }
              }
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  className="glass-card p-8 text-center relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.5, delay: 0.2 + index * 0.15 }
                  }
                  whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
                >
                  {/* Spotlight */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-50"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${step.color}15 0%, transparent 50%)`,
                    }}
                  />

                  <div className="relative z-10">
                    {/* Step Number */}
                    <p className="font-mono text-xs text-[var(--text-3)] mb-4">
                      {step.number}
                    </p>

                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <Icon
                        className="w-20 h-20"
                        style={{ color: step.color }}
                        strokeWidth={1}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-[var(--text-1)] mb-3">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[var(--text-2)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
