"use client"

import { Separator } from "@/components/ui/separator"

const footerLinks = [
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
  { href: "#", label: "Contact" },
]

function HexagonLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Hexagon */}
      <path
        d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Pulse line inside */}
      <path
        d="M8 16H12L14 12L16 20L18 14L20 16H24"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function FooterSection() {
  return (
    <footer className="relative" aria-label="Footer">
      <Separator className="opacity-10" />

      <div className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Wordmark */}
            <div className="flex items-center gap-3">
              <HexagonLogo className="w-8 h-8" />
              <span className="text-lg font-semibold text-[var(--text-1)]">HealthByte</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Tech Stack */}
            <p className="font-mono text-xs text-[var(--text-3)]">
              ViT · TFT · PINNs · Oura API · HealthKit
            </p>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-[var(--text-3)] mt-8">
            © 2026 HealthByte. Your Biology, Decoded.
          </p>
        </div>
      </div>
    </footer>
  )
}
