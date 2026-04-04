import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import aiBrainImage from "@/assets/ai-brain.jpg";
import { Brain, Layers, Target, Sparkles } from "lucide-react";

export const Route = createFileRoute("/ai-intelligence")({
  component: AIIntelligencePage,
});

function AIIntelligencePage() {
  const scrollRef = useScrollAnimation();

  const features = [
    {
      icon: <Brain size={28} />,
      title: "Temporal Fusion Transformer",
      desc: "Our core model uses multi-horizon attention to process sequences of historical demand, weather, and behavioral data simultaneously. It learns which inputs matter most for each prediction horizon.",
      color: "gradient-pink-blue",
    },
    {
      icon: <Layers size={28} />,
      title: "Quantile Predictions",
      desc: "Instead of a single point forecast, TFT produces full probability distributions. The 10th, 50th, and 90th percentiles give kitchens confidence intervals for decision-making.",
      color: "gradient-blue-green",
    },
    {
      icon: <Target size={28} />,
      title: "Variable Selection Networks",
      desc: "The model automatically identifies which features drive demand on any given day. During monsoon, humidity dominates. During exams, academic calendars take priority.",
      color: "gradient-green-blue",
    },
    {
      icon: <Sparkles size={28} />,
      title: "Adaptive Learning",
      desc: "Continuous feedback from kitchen staff retrains the model weekly. Drift detection algorithms flag when prediction patterns shift, triggering automatic recalibration.",
      color: "gradient-yellow-pink",
    },
  ];

  return (
    <div ref={scrollRef} className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6 dot-grid">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll">
            <div className="inline-block brutal-shadow px-4 py-1 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest">AI Architecture</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[0.95]">
              The Brain<br />Behind the<br /><span className="text-gradient-blue-green">Engine</span>
            </h1>
          </div>
        </div>
      </section>

      {/* AI Visual */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll relative">
            <img
              src={aiBrainImage}
              alt="AI neural network visualization"
              loading="lazy"
              width={1200}
              height={800}
              className="w-full brutal-shadow"
            />
            <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-neon-blue -z-10" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 dot-grid">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat, i) => (
              <div
                key={i}
                className="animate-on-scroll brutal-shadow p-10"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`w-14 h-14 ${feat.color} flex items-center justify-center text-background mb-6`}>
                  {feat.icon}
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">{feat.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attention Mechanism Visual */}
      <section className="py-32 px-6 dot-grid">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-on-scroll">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-8">
              Attention <span className="text-gradient-pink-blue">Mechanism</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-16 leading-relaxed">
              The model learns to attend to different input features based on context. Here's a simplified view of how attention weights distribute across variables.
            </p>
          </div>

          {/* Simplified attention viz */}
          <div className="animate-on-scroll grid grid-cols-5 gap-4">
            {[
              { label: "Weather", weight: 0.85 },
              { label: "History", weight: 0.92 },
              { label: "Events", weight: 0.45 },
              { label: "Time", weight: 0.78 },
              { label: "KAI", weight: 0.67 },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-full brutal-shadow bg-background relative" style={{ height: "200px" }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 gradient-pink-blue transition-all duration-1000 ease-out"
                    style={{ height: `${item.weight * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                <span className="text-xs text-muted-foreground">{(item.weight * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
