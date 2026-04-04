import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, TrendingDown, Zap, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-kolkata.jpg";
import wasteImage from "@/assets/waste-problem.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const scrollRef = useScrollAnimation();

  return (
    <div ref={scrollRef} className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center dot-grid pt-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block brutal-shadow px-4 py-1 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest">AI-Powered Food Intelligence</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
              Stop<br />
              Guessing.<br />
              <span className="text-gradient-pink-blue">Start<br />Predicting.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-lg leading-relaxed">
              AI-powered demand forecasting for urban kitchens. Reduce waste, optimize costs, feed more people.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/how-it-works">
                <Button variant="neonPink" size="lg">
                  Explore the Engine
                  <ArrowRight className="arrow-move" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  View Dashboard
                  <ArrowRight className="arrow-move" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="EcoFeast Engine - Kolkata cityscape with AI data visualization"
              width={1920}
              height={1080}
              className="w-full brutal-shadow"
            />
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-neon-pink -z-10" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-6 dot-grid">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll">
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              The Problem Is<br /><span className="text-neon-pink">Massive.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16">
            <div className="animate-slide-left">
              <img
                src={wasteImage}
                alt="Food waste visualization"
                loading="lazy"
                width={1200}
                height={800}
                className="w-full border-2 border-neon-pink"
              />
            </div>
            <div className="animate-slide-right flex flex-col justify-center gap-8">
              <StatBlock number="85–140" unit="kg/day" desc="food wasted per urban kitchen" />
              <StatBlock number="₹15,000" unit="/month" desc="average losses from over-preparation" />
              <StatBlock number="40" unit="%" desc="of prepared food never reaches a plate" />
              <p className="text-sm opacity-60 mt-4 leading-relaxed">
                In Kolkata alone, institutional kitchens discard enough food daily to feed thousands. The problem isn't cooking — it's guessing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Pipeline */}
      <section className="py-32 px-6 dot-grid">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll text-center mb-20">
            <h2 className="font-heading text-4xl md:text-6xl font-bold">
              The <span className="text-gradient-blue-green">Solution Pipeline</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              From raw data to optimized cooking instructions in real-time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {[
              { icon: <BarChart3 size={32} />, title: "Ingest", desc: "Weather, events, biometrics, history", bg: "gradient-pink-blue" },
              { icon: <Zap size={32} />, title: "Forecast", desc: "AI predicts demand with 95% accuracy", bg: "gradient-blue-green" },
              { icon: <TrendingDown size={32} />, title: "Optimize", desc: "Newsvendor logic minimizes waste cost", bg: "gradient-green-blue" },
              { icon: <ArrowRight size={32} />, title: "Execute", desc: "Real-time cooking recommendations", bg: "gradient-yellow-pink" },
            ].map((step, i) => (
              <div key={i} className="animate-on-scroll" style={{ transitionDelay: `${i * 150}ms` }}>
                 <div className={`brutal-shadow p-8 h-full relative ${step.bg} text-primary-foreground`}>
                  <div className="w-14 h-14 bg-background/20 flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Step {i + 1}</div>
                  <h3 className="font-heading text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed">{step.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                      <ArrowRight size={24} className="text-neon-pink" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kolkata Appetite Index */}
      <section className="py-32 px-6 dot-grid">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-on-scroll">
            <div className="inline-block brutal-shadow px-4 py-1 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-neon-yellow">Innovation Spotlight</span>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-8">
              Kolkata<br /><span className="text-neon-yellow">Appetite Index</span>
            </h2>
            <p className="max-w-2xl mx-auto text-sm opacity-70 mb-16 leading-relaxed">
              A proprietary composite signal that captures how Kolkata eats — factoring humidity, exam schedules, festivals, and behavioral patterns into a single demand coefficient.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Humidity Index", value: "87%", desc: "High humidity = lighter meals", bg: "bg-neon-blue" },
              { label: "Exam Season", value: "Active", desc: "College exams shift meal timing", bg: "bg-neon-pink" },
              { label: "KAI Score", value: "0.73", desc: "Composite appetite coefficient", bg: "bg-neon-green" },
            ].map((item, i) => (
              <div key={i} className={`animate-on-scroll brutal-shadow ${item.bg} p-8 text-left text-primary-foreground`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{item.label}</div>
                <div className="font-heading text-4xl font-bold mb-2">{item.value}</div>
                <p className="text-sm opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 dot-grid text-center">
        <div className="animate-on-scroll max-w-3xl mx-auto">
          <h2 className="font-heading text-4xl md:text-6xl font-bold mb-8">
            Ready to <span className="text-gradient-pink-blue">Transform</span> Your Kitchen?
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact">
              <Button variant="neonPink" size="lg">
                Get Started
                <ArrowRight className="arrow-move" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatBlock({ number, unit, desc }: { number: string; unit: string; desc: string }) {
  return (
    <div className="border-l-2 border-neon-pink pl-6">
      <div className="font-heading text-3xl font-bold">
        {number}<span className="text-neon-pink">{unit}</span>
      </div>
      <p className="text-sm opacity-70 mt-1">{desc}</p>
    </div>
  );
}
