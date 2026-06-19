"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const impactCards = [
  {
    type: "positive",
    title: "Consistent Protein Intake",
    impact: "Improved Recovery HRV by 9%",
    badges: [
      { label: "High Confidence", color: undefined },
      { label: "HRV ↑", color: "var(--green)" },
    ],
    borderColor: "var(--green)",
  },
  {
    type: "positive",
    title: "Almonds 3x/week",
    impact: "Addresses Magnesium deficit — +14% sleep score predicted over 2 weeks",
    badges: [
      { label: "Predicted", color: undefined },
      { label: "Sleep ↑", color: "var(--teal)" },
    ],
    borderColor: "var(--green)",
  },
  {
    type: "negative",
    title: "High Carb After 9 PM",
    impact: "Deep sleep dropped 18 min. Next-day HRV 12% lower.",
    badges: [
      { label: "High Confidence", color: undefined },
      { label: "Sleep ↓", color: "var(--red)" },
    ],
    borderColor: "var(--red)",
  },
  {
    type: "negative",
    title: "Low Vitamin D",
    impact: "Elevated resting HR and poor sleep latency detected.",
    badges: [
      { label: "Detected", color: undefined },
      { label: "HR ↑", color: "var(--orange)" },
    ],
    borderColor: "var(--orange)",
  },
]

export function WeeklyImpactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 md:px-8"
      id="features"
      aria-label="Weekly Impact Score"
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
            Weekly Behavioral Impact Scores — Not Seen Anywhere Else
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--text-2)] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
          >
            7 days of biological data. Isolated correlations. Ranked micro-interventions.
          </motion.p>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {impactCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="glass-card p-6 relative overflow-hidden"
              style={{
                borderLeft: `3px solid ${card.borderColor}`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.5, delay: 0.2 + index * 0.1 }
              }
              whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  {card.type === "positive" ? (
                    <CheckCircle2 className="w-[18px] h-[18px]" style={{ color: "var(--green)" }} />
                  ) : (
                    <AlertTriangle
                      className="w-[18px] h-[18px]"
                      style={{ color: card.borderColor }}
                    />
                  )}
                  <h3 className="font-semibold text-[var(--text-1)]">{card.title}</h3>
                </div>
              </div>

              {/* Impact Description */}
              <p className="text-sm text-[var(--text-2)] leading-relaxed mb-4">
                {card.impact}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {card.badges.map((badge) => (
                  <Badge
                    key={badge.label}
                    variant="outline"
                    className="px-2 py-0.5 rounded-lg text-xs bg-[var(--glass-bg)] border-[var(--glass-border)]"
                    style={{ color: badge.color || "var(--text-2)" }}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
