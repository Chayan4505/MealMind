import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Leaf, Heart } from "lucide-react";

export const Route = createFileRoute("/impact")({
  component: ImpactPage,
});

function ImpactPage() {
  const scrollRef = useScrollAnimation();

  return (
    <div ref={scrollRef} className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6 dot-grid">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll">
            <div className="inline-block brutal-shadow px-4 py-1 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest">Measured Impact</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[0.95]">
              Real <span className="text-gradient-pink-blue">Numbers.</span><br />
              Real <span className="text-gradient-blue-green">Change.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Counters */}
      <section className="py-24 px-6 dot-grid">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="animate-on-scroll">
            <AnimatedCounter end={25} suffix="%" label="Cost Reduction" colorClass="text-neon-pink" />
          </div>
          <div className="animate-on-scroll" style={{ transitionDelay: "200ms" }}>
            <AnimatedCounter end={40} suffix="%" label="Waste Eliminated" colorClass="text-neon-blue" />
          </div>
          <div className="animate-on-scroll" style={{ transitionDelay: "400ms" }}>
            <AnimatedCounter end={1200} suffix="+" label="Meals Redistributed" colorClass="text-neon-green" />
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-32 px-6 dot-grid">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll text-center mb-20">
            <h2 className="font-heading text-4xl md:text-6xl font-bold">
              Three Pillars of <span className="text-gradient-pink-blue">Impact</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-on-scroll brutal-shadow gradient-pink-blue p-10 text-primary-foreground">
              <DollarSign size={32} className="mb-6" />
              <h3 className="font-heading text-2xl font-bold mb-4">Economic</h3>
              <ul className="space-y-3 text-sm">
                <li className="border-l-2 border-primary-foreground/50 pl-4">20–25% monthly cost reduction</li>
                <li className="border-l-2 border-primary-foreground/50 pl-4">ROI positive within 3 months</li>
                <li className="border-l-2 border-primary-foreground/50 pl-4">₹15,000+ saved per kitchen/month</li>
              </ul>
            </div>

            <div className="animate-on-scroll brutal-shadow gradient-green-blue p-10 text-primary-foreground" style={{ transitionDelay: "150ms" }}>
              <Leaf size={32} className="mb-6" />
              <h3 className="font-heading text-2xl font-bold mb-4">Environmental</h3>
              <ul className="space-y-3 text-sm">
                <li className="border-l-2 border-primary-foreground/50 pl-4">40% reduction in food waste</li>
                <li className="border-l-2 border-primary-foreground/50 pl-4">Methane emissions reduced proportionally</li>
                <li className="border-l-2 border-primary-foreground/50 pl-4">Lower carbon footprint per meal</li>
              </ul>
            </div>

            <div className="animate-on-scroll brutal-shadow border-neon-blue p-10" style={{ transitionDelay: "300ms" }}>
              <Heart size={32} className="text-neon-blue mb-6" />
              <h3 className="font-heading text-2xl font-bold mb-4">Social</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="border-l-2 border-neon-blue pl-4">Surplus redistributed to NGOs</li>
                <li className="border-l-2 border-neon-blue pl-4">Community feeding programs supported</li>
                <li className="border-l-2 border-neon-blue pl-4">Staff empowered with AI tools</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 dot-grid text-center">
        <div className="animate-on-scroll max-w-3xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-8">
            Be Part of the <span className="text-neon-yellow">Revolution</span>
          </h2>
          <Link to="/contact">
            <Button variant="neonPink" size="lg">
              Join the Movement <ArrowRight className="arrow-move" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
