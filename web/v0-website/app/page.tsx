import { DynamicIsland } from "@/components/dynamic-island"
import { HeroSection } from "@/components/sections/hero"
import { NutritionEngineSection } from "@/components/sections/nutrition-engine"
import { FusionLayerSection } from "@/components/sections/fusion-layer"
import { HowItWorksSection } from "@/components/sections/how-it-works"
import { WeeklyImpactSection } from "@/components/sections/weekly-impact"
import { ComparisonSection } from "@/components/sections/comparison"
import { FeaturesGridSection } from "@/components/sections/features-grid"
import { CTABannerSection } from "@/components/sections/cta-banner"
import { FooterSection } from "@/components/sections/footer"

export default function Home() {
  return (
    <div className="w-full max-w-full">
      {/* Dynamic Island Navigation */}
      <DynamicIsland />

      {/* Main Content */}
      <main className="relative z-10 w-full">
        {/* Hero Section */}
        <HeroSection />

        {/* Nutrition Engine Section */}
        <NutritionEngineSection />

        {/* 24-Hour Fusion Layer Section */}
        <FusionLayerSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Weekly Impact Score Section */}
        <WeeklyImpactSection />

        {/* Competitor Comparison Section */}
        <ComparisonSection />

        {/* Features Grid Section */}
        <FeaturesGridSection />

        {/* CTA Banner Section */}
        <CTABannerSection />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  )
}
