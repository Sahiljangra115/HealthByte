"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

interface MacroRingProps {
  value: number
  max: number
  color: string
  label: string
  size?: number
}

export function MacroRing({ value, max, color, label, size = 80 }: MacroRingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()

  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (value / max) * circumference
  const offset = circumference - progress

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        className="macro-ring"
        role="img"
        aria-label={`${label}: ${value}g`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: isInView ? offset : circumference }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 1.2, ease: "easeOut" }
          }
        />
      </svg>
      <span className="text-xs text-[var(--text-3)]">{label}</span>
      <span className="text-sm font-semibold" style={{ color }}>
        {value}g
      </span>
    </div>
  )
}

export function MacroRingsRow() {
  const macros = [
    { value: 90, max: 150, color: "var(--green)", label: "Protein" },
    { value: 90, max: 150, color: "var(--blue)", label: "Carbs" },
    { value: 40, max: 80, color: "var(--orange)", label: "Fat" },
  ]

  return (
    <div className="flex justify-center gap-6">
      {macros.map((macro) => (
        <MacroRing key={macro.label} {...macro} />
      ))}
    </div>
  )
}
