import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, Cloud, Brain, BarChart3, Cpu, LineChart } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorksPage,
});

function HowItWorksPage() {
  const scrollRef = useScrollAnimation();

  const stages = [
    {
      num: "01",
      title: "Multimodal Data Input",
      desc: "We ingest diverse data streams — weather APIs, biometric signals, academic calendars, POS transaction history, and IoT sensor data from kitchen operations.",
      details: ["Weather & Humidity API", "Exam Schedules", "Historical Sales", "IoT Kitchen Sensors"],
      icon: <Cloud size={32} />,
      color: "gradient-pink-blue",
      borderColor: "border-neon-pink",
    },
    {
      num: "02",
      title: "Feature Engineering",
      desc: "Raw data transforms into predictive features. Lag features capture weekly patterns, rolling averages smooth noise, and the KAI coefficient encodes Kolkata's unique appetite dynamics.",
      details: ["Lag Features (7-day, 30-day)", "Rolling Averages", "KAI Coefficient", "Seasonal Encodings"],
      icon: <BarChart3 size={32} />,
      color: "gradient-blue-green",
      borderColor: "border-neon-blue",
    },
    {
      num: "03",
      title: "AI Engine — TFT",
      desc: "Our Temporal Fusion Transformer processes multi-horizon sequences with attention mechanisms, producing interpretable quantile forecasts across confidence intervals.",
      details: ["Multi-Head Attention", "Quantile Regression", "Variable Selection Networks", "Interpretable Outputs"],
      icon: <Brain size={32} />,
      color: "gradient-green-blue",
      borderColor: "border-neon-green",
    },
    {
      num: "04",
      title: "Cost Optimization",
      desc: "Newsvendor-inspired optimization balances overage and underage costs. The system recommends the exact quantity that minimizes total expected cost across all menu items.",
      details: ["Newsvendor Model", "Cost Ratio Analysis", "Menu-Level Optimization", "Scenario Planning"],
      icon: <Cpu size={32} />,
      color: "gradient-yellow-pink",
      borderColor: "border-neon-yellow",
    },
    {
      num: "05",
      title: "Actionable Output",
      desc: "Kitchen staff receive clear, actionable cooking recommendations — not charts. 'Cook 20kg less rice today' is the output, backed by AI confidence and explainability.",
      details: ["Cooking Recommendations", "Confidence Intervals", "Dashboard Visuals", "Alert System"],
      icon: <LineChart size={32} />,
      color: "gradient-pink-blue",
      borderColor: "border-neon-pink",
    },
  ];

  return (
    <div ref={scrollRef} className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6 dot-grid">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll">
            <div className="inline-block brutal-shadow px-4 py-1 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest">System Architecture</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[0.95]">
              How the<br /><span className="text-gradient-blue-green">Engine Works</span>
            </h1>
            <p className="mt-6 text-muted-foreground max-w-xl text-lg leading-relaxed">
              A five-stage pipeline that transforms raw urban data into precise cooking recommendations.
            </p>
          </div>
        </div>
      </section>

      {stages.map((stage, i) => (
        <section
          key={i}
          className={`py-24 px-6 ${i % 2 === 0 ? "bg-background" : "dot-grid"}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="animate-slide-left">
                  <div className={`text-8xl font-heading font-bold opacity-10 mb-4`}>{stage.num}</div>
                  <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">{stage.title}</h2>
                  <p className={`text-base leading-relaxed mb-8 ${i % 2 === 0 ? "text-muted-foreground" : "opacity-70"}`}>
                    {stage.desc}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {stage.details.map((detail, j) => (
                      <div
                        key={j}
                        className={`${i % 2 === 0 ? 'brutal-shadow' : 'brutal-shadow-light'} px-4 py-3 text-xs font-bold uppercase tracking-widest`}
                      >
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="animate-slide-right">
                  <div className={`w-full aspect-square ${stage.color} flex items-center justify-center relative`}>
                    <div className="text-background/20">
                      {/* Large decorative icon */}
                      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="opacity-30">
                        <rect x="20" y="20" width="160" height="160" stroke="currentColor" strokeWidth="2" />
                        <rect x="40" y="40" width="120" height="120" stroke="currentColor" strokeWidth="2" />
                        <rect x="60" y="60" width="80" height="80" stroke="currentColor" strokeWidth="2" />
                        <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="1" />
                        <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-background">
                      {stage.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {i < stages.length - 1 && (
              <div className="flex justify-center mt-16">
                <ArrowRight size={32} className={`rotate-90 ${i % 2 === 0 ? "text-muted-foreground" : "opacity-50"}`} />
              </div>
            )}
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}
