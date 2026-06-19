"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Sparkles, ScanLine, Activity, TrendingUp, Infinity, ArrowRight, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HeroCard } from "@/components/hero-card"

const statPills = [
  { icon: ScanLine, label: "Food Recognition" },
  { icon: Activity, label: "HRV & Sleep Fusion" },
  { icon: TrendingUp, label: "Weekly Impact Score" },
  { icon: Infinity, label: "Free Core" },
]

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { type: "spring", stiffness: 300, damping: 25 },
    },
  }

  return (
    <section
      className="relative min-h-screen flex items-center pt-28 pb-16 px-4 md:px-8 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Atmospheric Orbs */}
      <div className="orb orb-blue w-[600px] h-[600px] top-0 right-0" aria-hidden="true" />
      <div className="orb orb-green w-[400px] h-[400px] bottom-0 left-0" aria-hidden="true" />
      <div className="orb orb-purple w-[300px] h-[300px] top-1/2 left-1/4" aria-hidden="true" />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Early Access Badge */}
            <motion.div variants={itemVariants}>
              <Badge
                variant="outline"
                className="w-fit px-4 py-2 rounded-full bg-[var(--glass-bg)] border-[var(--glass-border)]"
              >
                <Sparkles className="w-3.5 h-3.5 mr-2" style={{ color: "var(--yellow)" }} />
                <span className="text-[var(--text-1)] text-sm">Now in Early Access</span>
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-[72px] font-bold text-[var(--text-1)] leading-[1.1] text-balance"
            >
              Track Your Biology,{" "}
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Not Just Calories.
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-[var(--text-2)] max-w-xl text-pretty leading-relaxed"
            >
              HealthByte fuses food photos, wearable HRV/sleep data, and AI to deliver
              your Weekly Impact Score — the only metric that shows what actually moves
              the needle.
            </motion.p>

            {/* Stat Pills */}
            <motion.div
              variants={containerVariants}
              className="flex flex-wrap gap-2 mt-2"
            >
              {statPills.map((pill) => {
                const Icon = pill.icon
                return (
                  <motion.div key={pill.label} variants={itemVariants}>
                    <Badge
                      variant="outline"
                      className="px-4 py-2 rounded-full bg-[var(--glass-bg)] border-[var(--glass-border)]"
                    >
                      <Icon className="w-4 h-4 mr-2 text-[var(--text-2)]" />
                      <span className="text-[var(--text-2)] text-sm">{pill.label}</span>
                    </Badge>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-4">
              {/* Primary CTA with Moving Border effect */}
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              >
                <Button
                  className="h-[52px] px-8 rounded-full font-semibold glow-blue"
                  style={{ backgroundColor: "var(--blue)" }}
                >
                  Get Early Access
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>

              {/* Secondary CTA */}
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              >
                <Button
                  variant="ghost"
                  className="h-[52px] px-8 rounded-full font-semibold bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-1)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-1)]"
                >
                  See How It Works
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Hero Card */}
          <div className="flex justify-center lg:justify-end">
            <HeroCard />
          </div>
        </div>
      </div>
    </section>
  )
}
