"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { Check, X, Minus } from "lucide-react"

const features = [
  "Photo nutrition + weight",
  "Wearable HRV/sleep fusion",
  "24hr rolling context",
  "Weekly impact score",
  "General population",
  "Physics ML (PINNs)",
  "Price",
]

const competitors = [
  {
    name: "Twin Health",
    values: ["check", "partial", "check", "x", "x", "x", "$200+/mo"],
  },
  {
    name: "ZOE",
    values: ["check", "x", "x", "x", "check", "x", "High"],
  },
  {
    name: "Foodvisor",
    values: ["check", "x", "x", "x", "check", "x", "Free/Paid"],
  },
  {
    name: "HealthByte",
    values: ["check", "check", "check", "check", "check", "check", "Consumer SaaS"],
    highlighted: true,
  },
]

function CellIcon({ value }: { value: string }) {
  if (value === "check") {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--green)]/20">
        <Check className="w-4 h-4" style={{ color: "var(--green)" }} />
      </span>
    )
  }
  if (value === "x") {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--red)]/15">
        <X className="w-4 h-4" style={{ color: "var(--red)" }} />
      </span>
    )
  }
  if (value === "partial") {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--orange)]/20">
        <Minus className="w-4 h-4" style={{ color: "var(--orange)" }} />
      </span>
    )
  }
  return <span className="font-mono text-sm text-[var(--text-2)]">{value}</span>
}

export function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 md:px-8"
      id="compare"
      aria-label="Competitor Comparison"
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
            Where HealthByte Stands
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--text-2)]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
          >
            We built what everyone else skipped.
          </motion.p>
        </div>

        {/* Comparison Table with proper mobile scroll */}
        <motion.div
          className="glass-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
        >
          {/* Scroll hint on mobile */}
          <div className="md:hidden px-4 py-2 text-xs text-[var(--text-3)] text-center border-b border-[var(--glass-border)]">
            Scroll horizontally to see all competitors →
          </div>

          {/* Scrollable container */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[var(--glass-border)]">
                  <th className="text-left px-4 py-4 text-[var(--text-2)] font-medium text-sm">
                    Feature
                  </th>
                  {competitors.map((comp) => (
                    <th
                      key={comp.name}
                      className={`text-center px-4 py-4 font-medium text-sm ${
                        comp.highlighted
                          ? "text-[var(--blue)] bg-[var(--blue)]/5 border-l border-r border-[var(--blue)]/30"
                          : "text-[var(--text-2)]"
                      }`}
                    >
                      {comp.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, rowIndex) => (
                  <tr
                    key={feature}
                    className="border-b border-[var(--glass-border)]/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-[var(--text-1)]">{feature}</td>
                    {competitors.map((comp) => {
                      const value = comp.values[rowIndex]
                      const isPrice = feature === "Price"

                      return (
                        <td
                          key={`${comp.name}-${feature}`}
                          className={`text-center px-4 py-4 ${
                            comp.highlighted
                              ? "bg-[var(--blue)]/5 border-l border-r border-[var(--blue)]/30"
                              : ""
                          }`}
                        >
                          {isPrice ? (
                            <span
                              className={`font-mono text-sm ${
                                comp.highlighted
                                  ? "text-[var(--green)] font-semibold"
                                  : "text-[var(--text-2)]"
                              }`}
                            >
                              {value}
                            </span>
                          ) : (
                            <CellIcon value={value} />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Legend for icons */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-6 text-xs text-[var(--text-3)]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, delay: 0.4 }}
        >
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--green)]/20">
              <Check className="w-3 h-3" style={{ color: "var(--green)" }} />
            </span>
            Full support
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--orange)]/20">
              <Minus className="w-3 h-3" style={{ color: "var(--orange)" }} />
            </span>
            Partial
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--red)]/15">
              <X className="w-3 h-3" style={{ color: "var(--red)" }} />
            </span>
            Not available
          </span>
        </motion.div>
      </div>
    </section>
  )
}
