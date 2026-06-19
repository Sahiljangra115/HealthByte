"use client"

import { useRef, useMemo } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { Flame, Dumbbell, Wheat, Droplets, Atom, Shield, Sun, UtensilsCrossed } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MacroRing } from "@/components/macro-rings"

const nutritionOutputs = [
  { icon: Flame, label: "420 kcal", sublabel: "per serving", color: "var(--red)" },
  { icon: Dumbbell, label: "38g Protein", hasProgress: true, progressPercent: 75, color: "var(--green)" },
  { icon: Wheat, label: "44g Carbs", badge: "GI 52", color: "var(--blue)" },
  { icon: Droplets, label: "14g Fat", color: "var(--orange)" },
  { icon: Atom, label: "Magnesium 68mg", color: "var(--purple)" },
  { icon: Shield, label: "Inflammatory Score: Low", badge: "Low", badgeColor: "var(--green)", color: "var(--green)" },
  { icon: Sun, label: "Vitamin D 12 IU", badge: "Low", badgeColor: "var(--orange)", color: "var(--orange)" },
]

// Pre-seeded sparkle positions to avoid hydration mismatch
const SPARKLE_POSITIONS = [
  { top: 32, left: 25 },
  { top: 45, left: 55 },
  { top: 58, left: 35 },
  { top: 40, left: 70 },
  { top: 52, left: 45 },
  { top: 65, left: 60 },
]

export function NutritionEngineSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()

  // Memoize sparkle data to ensure consistency between server and client
  const sparkles = useMemo(() => {
    return SPARKLE_POSITIONS.map((pos, i) => ({
      ...pos,
      delay: i * 0.3,
      duration: 2 + (i % 3) * 0.5,
    }))
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 md:px-8"
      id="nutrition"
      aria-label="Nutrition Engine"
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
            Food Photo → Full Biological Profile
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--text-2)] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
          >
            Not just calories. Every meal outputs macros, micros, glycemic index, and
            inflammatory score.
          </motion.p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left - Scan Card */}
          <motion.div
            className="glass-card p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
          >
            {/* Spotlight */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(10, 132, 255, 0.1) 0%, transparent 60%)",
              }}
            />

            {/* Dark Inset Panel */}
            <div className="relative bg-black/40 rounded-xl p-12 flex flex-col items-center">
              <UtensilsCrossed className="w-16 h-16 text-white/15 mb-4" />

              {/* Animated ellipsis */}
              <div className="flex items-center gap-1 font-mono text-xs text-[var(--text-3)]">
                <span>AI scanning</span>
                <motion.span
                  animate={shouldReduceMotion ? {} : { opacity: [1, 0, 1] }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  }
                >
                  ...
                </motion.span>
              </div>
            </div>

            {/* Sparkle particles with seeded positions - always render to avoid hydration mismatch */}
            {sparkles.map((sparkle, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/30"
                style={{
                  top: `${sparkle.top}%`,
                  left: `${sparkle.left}%`,
                }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.3 }
                    : {
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: sparkle.duration,
                        repeat: Infinity,
                        delay: sparkle.delay,
                      }
                }
              />
            ))}
          </motion.div>

          {/* Right - Output Stack */}
          <div className="flex flex-col gap-3">
            {nutritionOutputs.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.4, delay: 0.3 + index * 0.08 }
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" style={{ color: item.color }} />
                  <span className="font-semibold text-[var(--text-1)]">{item.label}</span>
                  {item.sublabel && (
                    <span className="text-[var(--text-3)] text-sm">{item.sublabel}</span>
                  )}
                  {item.hasProgress && (
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden ml-2">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${item.progressPercent}%` } : {}}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { duration: 0.8, delay: 0.5 + index * 0.08 }
                        }
                      />
                    </div>
                  )}
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="ml-auto px-2 py-0.5 rounded-lg text-xs bg-[var(--glass-bg)] border-[var(--glass-border)]"
                      style={{ color: item.badgeColor || item.color }}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Macro Rings */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 md:gap-16 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.6 }}
        >
          <MacroRing value={90} max={150} color="var(--green)" label="Protein" size={100} />
          <MacroRing value={90} max={150} color="var(--blue)" label="Carbs" size={100} />
          <MacroRing value={40} max={80} color="var(--orange)" label="Fat" size={100} />
        </motion.div>

        {/* Caption */}
        <p className="text-center font-mono text-xs text-[var(--text-3)]">
          Powered by ViT + USDA FoodData Central API
        </p>
      </div>
    </section>
  )
}
