import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChefHat, Droplets, ArrowDown, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const Route = createFileRoute("/forecast")({
  component: ForecastPage,
});

function ForecastPage() {
  const scrollRef = useScrollAnimation();
  const { user } = useAuth();

  return (
    <div ref={scrollRef} className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <section className="flex-1 pt-32 pb-20 px-6 dot-grid">
        <div className="max-w-5xl mx-auto align-middle">
          <div className="animate-on-scroll mb-12">
             <div className="inline-block brutal-shadow px-4 py-1 mb-6 bg-neon-yellow text-foreground">
              <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Bell size={14} /> 06:00 AM • MORNING BRIEFING
              </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[0.95]">
              Lunch<br /><span className="text-gradient-pink-blue">Forecasting</span>
            </h1>
            <p className="mt-6 text-muted-foreground max-w-xl text-lg">
              {user?.user_metadata?.restaurant_name || "Kitchen Manager"}, here is your demand projection based on current city-wide variables.
            </p>
          </div>

          <div className="brutal-shadow p-8 bg-card border-l-8 border-l-neon-pink">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-8">
              <div className="bg-neon-blue px-4 py-3 brutal-shadow-light flex items-center gap-3 text-primary-foreground text-sm font-bold shrink-0">
                <Droplets size={20} /> Kolkata Context: Heavy Rain Alert Active
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-background brutal-shadow border-2 border-foreground hover:-translate-y-1 transition-transform">
                 <div className="text-sm uppercase font-bold text-muted-foreground mb-4">Algorithm Prediction</div>
                 <div className="text-7xl font-heading font-bold">450 <span className="text-2xl text-muted-foreground">meals</span></div>
                 <div className="text-md font-bold text-neon-green mt-4 flex items-center gap-2">
                    <ArrowDown size={18} /> 15% volume drop due to rain
                 </div>
              </div>
              <div className="p-8 bg-neon-green brutal-shadow text-primary-foreground flex flex-col justify-center hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4 mb-4">
                  <ChefHat size={32} />
                  <span className="font-bold uppercase tracking-widest text-sm">AI Confidence Rating</span>
                </div>
                <div className="text-7xl font-heading font-bold">94%</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
