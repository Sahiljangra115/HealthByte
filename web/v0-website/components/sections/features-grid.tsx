"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ScanLine, FlaskConical, Activity, TrendingUp, Cpu, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: ScanLine,
    title: "AI Recognition",
    description: "ViT + YOLO identifies meals, ingredients, and density from a single photo.",
    color: "var(--blue)",
  },
  {
    icon: FlaskConical,
    title: "Full Micro + Macro Profile",
    description: "Calories, macros, Vitamin D, B12, Iron, Zinc, Magnesium, inflammatory score.",
    color: "var(--green)",
  },
  {
    icon: Activity,
    title: "Wearable Fusion",
    description: "Oura Ring + Apple Watch — HRV, sleep stages, resting HR in one context window.",
    color: "var(--purple)",
  },
  {
    icon: TrendingUp,
    title: "Weekly Impact Score",
    description: "The only tracker that correlates behaviors to outcomes over a full week.",
    color: "var(--yellow)",
  },
  {
    icon: Cpu,
    title: "Real-Time State Vector",
    description: "Biological state recalculated continuously as new data streams in.",
    color: "var(--teal)",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-First",
    description: "End-to-end encrypted. Your biometrics never leave your control.",
    color: "rgba(255, 255, 255, 0.5)",
  },
]

export function FeaturesGridSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 md:px-8"
      aria-label="Features"
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
            Everything You Need. Nothing You Don&apos;t.
          </motion.h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="glass-card p-6 relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.5, delay: 0.1 + index * 0.08 }
                }
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.02,
                        boxShadow: "0 8px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                      }
                }
              >
                {/* Spotlight on hover */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${feature.color}15 0%, transparent 50%)`,
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ color: feature.color }}
                  >
                    <Icon className="w-10 h-10" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-[var(--text-1)] mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[var(--text-2)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
