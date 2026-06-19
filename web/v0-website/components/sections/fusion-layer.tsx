"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { Camera, Activity, Moon, Heart, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const dataStreams = [
  { icon: Camera, label: "Food Log", description: "Nutrients, glycemic load", badge: "Per meal", color: "var(--green)" },
  { icon: Activity, label: "HRV", description: "Recovery, autonomic stress", badge: "Continuous", color: "var(--purple)" },
  { icon: Moon, label: "Sleep Stages", description: "Deep sleep %, REM, latency", badge: "Nightly", color: "var(--teal)" },
  { icon: Heart, label: "Resting HR", description: "Cardiovascular load", badge: "Hourly", color: "var(--red)" },
  { icon: Zap, label: "Activity", description: "Energy expenditure, VO2 proxy", badge: "Continuous", color: "var(--orange)" },
]

export function FusionLayerSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 md:px-8 relative overflow-hidden"
      aria-label="24-Hour Fusion Layer"
    >
      {/* Tracing beam effect - left border */}
      <motion.div
        className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--blue)] to-transparent opacity-30 hidden lg:block"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        style={{ transformOrigin: "top" }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.5, ease: "easeOut" }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-1)] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6 }}
          >
            Your 24-Hour Biological Context Window
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--text-2)] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
          >
            One bad meal is noise. HealthByte fuses food, HRV, sleep stages, and
            activity into a rolling biological state — updated continuously.
          </motion.p>
        </div>

        {/* Data Stream Cards */}
        <div className="flex flex-col gap-4 mb-16">
          {dataStreams.map((stream, index) => {
            const Icon = stream.icon
            return (
              <motion.div
                key={stream.label}
                className="glass-card p-5 flex items-center justify-between relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.5, delay: 0.2 + index * 0.1 }
                }
              >
                {/* Spotlight */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-50"
                  style={{
                    background: `radial-gradient(ellipse at 0% 50%, ${stream.color}15 0%, transparent 50%)`,
                  }}
                />

                <div className="flex items-center gap-4 relative z-10">
                  <Icon className="w-5 h-5" style={{ color: stream.color }} />
                  <div>
                    <p className="font-semibold text-[var(--text-1)]">{stream.label}</p>
                    <p className="text-sm text-[var(--text-2)]">{stream.description}</p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="px-3 py-1 rounded-lg bg-[var(--glass-bg)] border-[var(--glass-border)] text-xs"
                  style={{ color: stream.color }}
                >
                  {stream.badge}
                </Badge>
              </motion.div>
            )
          })}
        </div>

        {/* Convergence Visual - All elements in same SVG coordinate space */}
        <motion.div
          className="relative h-48 md:h-64 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.7 }}
        >
          <svg
            className="w-full h-full max-w-2xl"
            viewBox="0 0 400 200"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* Converging lines - all drawn to same center point (200, 100) */}
            {dataStreams.map((stream, index) => {
              const startY = 20 + index * 40
              return (
                <motion.line
                  key={index}
                  x1="40"
                  y1={startY}
                  x2="200"
                  y2="100"
                  stroke={stream.color}
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 1, delay: 0.8 + index * 0.1, ease: "easeOut" }
                  }
                />
              )
            })}

            {/* Glow rings around center */}
            <circle cx="200" cy="100" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
            <circle cx="200" cy="100" r="30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />

            {/* Central orb - inside SVG for same coordinate space */}
            <defs>
              <radialGradient id="orbGradient" cx="30%" cy="30%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="30%" stopColor="var(--blue)" />
                <stop offset="70%" stopColor="var(--purple)" />
                <stop offset="100%" stopColor="var(--teal)" />
              </radialGradient>
              <filter id="orbGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <motion.circle
              cx="200"
              cy="100"
              r="16"
              fill="url(#orbGradient)"
              filter="url(#orbGlow)"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.6, delay: 1.3, type: "spring" }
              }
            />

            {/* Inner highlight */}
            <motion.circle
              cx="200"
              cy="100"
              r="4"
              fill="rgba(255,255,255,0.8)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, delay: 1.5 }}
            />

            {/* Label */}
            <motion.text
              x="200"
              y="145"
              textAnchor="middle"
              fill="var(--text-3)"
              fontSize="10"
              fontFamily="var(--font-mono)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, delay: 1.6 }}
            >
              Biological State Vector
            </motion.text>
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
