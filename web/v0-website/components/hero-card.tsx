"use client"

import { motion, useReducedMotion } from "framer-motion"
import { HeartPulse, Moon, Footprints, TrendingUp } from "lucide-react"
import { MacroRing } from "@/components/macro-rings"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const dataChips = [
  { icon: HeartPulse, label: "HRV: 68ms", color: "var(--purple)" },
  { icon: Moon, label: "Sleep: 7.4h", color: "var(--teal)" },
  { icon: Footprints, label: "9,240 steps", color: "var(--green)" },
]

const macros = [
  { value: 90, max: 150, color: "var(--green)", label: "Protein 90g" },
  { value: 90, max: 150, color: "var(--blue)", label: "Carbs 90g" },
  { value: 40, max: 80, color: "var(--orange)", label: "Fat 40g" },
]

export function HeroCard() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className="glass-blur rounded-[var(--radius-card)] p-6 md:p-8 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 300, damping: 25, delay: 0.3 }
      }
    >
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(10, 132, 255, 0.15) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10">
        {/* Macro Rings */}
        <div className="flex justify-center gap-6 mb-6">
          {macros.map((macro) => (
            <MacroRing
              key={macro.label}
              value={macro.value}
              max={macro.max}
              color={macro.color}
              label={macro.label}
            />
          ))}
        </div>

        {/* Data Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {dataChips.map((chip, index) => {
            const Icon = chip.icon
            return (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { delay: 0.5 + index * 0.1 }
                }
              >
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 rounded-full bg-[var(--glass-bg)] border-[var(--glass-border)] text-xs"
                >
                  <Icon className="w-3 h-3 mr-1.5" style={{ color: chip.color }} />
                  <span className="text-[var(--text-1)]">{chip.label}</span>
                </Badge>
              </motion.div>
            )
          })}
        </div>

        <Separator className="opacity-15 mb-6" />

        {/* Weekly Impact Score */}
        <div className="text-center">
          <p className="text-xs font-mono uppercase text-[var(--text-3)] tracking-wider mb-2">
            Weekly Impact Score
          </p>
          <div className="flex items-center justify-center gap-2">
            <motion.span
              className="text-5xl font-bold"
              style={{ color: "var(--yellow)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { delay: 0.8, type: "spring", stiffness: 300 }
              }
            >
              +14
            </motion.span>
            <TrendingUp className="w-5 h-5" style={{ color: "var(--yellow)" }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
