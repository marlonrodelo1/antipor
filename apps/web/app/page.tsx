import { LandingNav } from "@/components/landing/nav";
import { LandingHero } from "@/components/landing/hero";
import { LandingMoment } from "@/components/landing/moment";
import { LandingBenefits } from "@/components/landing/benefits";
import { LandingTestimonials } from "@/components/landing/testimonials";
import { LandingFaith } from "@/components/landing/faith";
import { LandingFAQ } from "@/components/landing/faq";
import { LandingFooter } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="bg-[var(--color-bg)] text-[var(--foreground)]">
      <LandingNav />
      <LandingHero />
      <LandingMoment />
      <LandingBenefits />
      <LandingTestimonials />
      <LandingFaith />
      <LandingFAQ />
      <LandingFooter />
    </main>
  );
}
