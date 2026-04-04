import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingDown, AlertTriangle, ChefHat, Droplets, BookOpen, Sun } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type Scenario = "normal" | "exam" | "humidity";

const scenarioData: Record<Scenario, {
  forecast: number;
  range: [number, number];
  waste: number;
  recommendation: string;
  kai: number;
  humidityLabel: string;
}> = {
  normal: {
    forecast: 460,
    range: [450, 470],
    waste: 12,
    recommendation: "Maintain standard portions. No significant adjustments needed.",
    kai: 0.73,
    humidityLabel: "Moderate (68%)",
  },
  exam: {
    forecast: 380,
    range: [360, 400],
    waste: 8,
    recommendation: "Cook 20kg less rice today. Exam week reduces lunch demand by ~18%.",
    kai: 0.58,
    humidityLabel: "Moderate (65%)",
  },
  humidity: {
    forecast: 410,
    range: [395, 430],
    waste: 15,
    recommendation: "Reduce heavy items by 15%. High humidity suppresses appetite for dense meals.",
    kai: 0.64,
    humidityLabel: "High (92%)",
  },
};

function DashboardPage() {
  const scrollRef = useScrollAnimation();
  const [scenario, setScenario] = useState<Scenario>("normal");
  const data = scenarioData[scenario];

  const forecastBars = [
    { day: "Mon", value: scenario === "exam" ? 370 : scenario === "humidity" ? 400 : 455 },
    { day: "Tue", value: scenario === "exam" ? 365 : scenario === "humidity" ? 395 : 460 },
    { day: "Wed", value: data.forecast },
    { day: "Thu", value: scenario === "exam" ? 390 : scenario === "humidity" ? 420 : 465 },
    { day: "Fri", value: scenario === "exam" ? 410 : scenario === "humidity" ? 430 : 470 },
    { day: "Sat", value: scenario === "exam" ? 350 : scenario === "humidity" ? 380 : 440 },
    { day: "Sun", value: scenario === "exam" ? 340 : scenario === "humidity" ? 370 : 430 },
  ];

  const maxVal = 500;

  return (
    <div ref={scrollRef} className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6 dot-grid">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll">
            <div className="inline-block border-2 border-foreground px-4 py-1 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest">Live Dashboard</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[0.95]">
              Demand<br /><span className="text-gradient-pink-blue">Intelligence</span>
            </h1>
            <p className="mt-6 text-muted-foreground max-w-xl text-lg">
              Simulated dashboard showing real-time forecasting and optimization.
            </p>
          </div>

          {/* Scenario Toggle */}
          <div className="mt-12 flex flex-wrap gap-3">
            <Button
              variant={scenario === "normal" ? "neonBlue" : "outline"}
              size="sm"
              onClick={() => setScenario("normal")}
            >
              <Sun size={16} /> Normal Day
            </Button>
            <Button
              variant={scenario === "exam" ? "neonPink" : "outline"}
              size="sm"
              onClick={() => setScenario("exam")}
            >
              <BookOpen size={16} /> Exam Week
            </Button>
            <Button
              variant={scenario === "humidity" ? "neonGreen" : "outline"}
              size="sm"
              onClick={() => setScenario("humidity")}
            >
              <Droplets size={16} /> High Humidity
            </Button>
          </div>

          {/* Dashboard Grid */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Forecast Chart */}
            <div className="lg:col-span-2 brutal-shadow p-8 bg-background">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Weekly Forecast</div>
                  <div className="font-heading text-3xl font-bold mt-1">{data.forecast} meals</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Range: {data.range[0]} – {data.range[1]}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">KAI Score</div>
                  <div className="font-heading text-3xl font-bold text-neon-pink mt-1">{data.kai}</div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end gap-3 h-48">
                {forecastBars.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs font-bold text-muted-foreground">{bar.value}</div>
                    <div
                      className="w-full gradient-blue-green transition-all duration-700 ease-out brutal-shadow"
                      style={{ height: `${(bar.value / maxVal) * 100}%`, border: 'none', boxShadow: 'none' }}
                    />
                    <div className="text-xs font-bold uppercase tracking-widest">{bar.day}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Panels */}
            <div className="flex flex-col gap-6">
              {/* Waste Reduction */}
              <div className="brutal-shadow border-neon-green p-6 bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingDown size={20} className="text-neon-green" />
                  <span className="text-xs font-bold uppercase tracking-widest">Waste Reduction</span>
                </div>
                <div className="font-heading text-4xl font-bold text-gradient-blue-green">{data.waste}%</div>
                <p className="text-xs text-muted-foreground mt-2">vs. last month baseline</p>
              </div>

              {/* Humidity */}
              <div className="brutal-shadow border-neon-blue p-6 bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <Droplets size={20} className="text-neon-blue" />
                  <span className="text-xs font-bold uppercase tracking-widest">Humidity</span>
                </div>
                <div className="font-heading text-2xl font-bold">{data.humidityLabel}</div>
              </div>

              {/* Alert */}
              <div className="brutal-shadow border-neon-yellow p-6 bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle size={20} className="text-neon-yellow" />
                  <span className="text-xs font-bold uppercase tracking-widest">Alert</span>
                </div>
                <p className="text-sm font-medium">
                  {scenario === "exam" ? "Exam week detected" : scenario === "humidity" ? "High humidity alert" : "No alerts"}
                </p>
              </div>
            </div>
          </div>

          {/* Cooking Recommendation */}
          <div className="mt-8 brutal-shadow border-neon-pink p-8 bg-background">
            <div className="flex items-center gap-3 mb-4">
              <ChefHat size={24} className="text-neon-pink" />
              <span className="text-xs font-bold uppercase tracking-widest">Cooking Recommendation</span>
            </div>
            <p className="font-heading text-xl md:text-2xl font-bold">{data.recommendation}</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
