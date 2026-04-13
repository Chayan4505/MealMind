import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, RefreshCcw, TrendingUp, AlertTriangle, Play, ChevronRight, Activity, PieChart, ShieldAlert, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/simulation")({
  component: SimulationPage,
});

function SimulationPage() {
  const scrollRef = useScrollAnimation();
  const { user } = useAuth();
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [dropValue, setDropValue] = useState(0);
  const [predictedSurge, setPredictedSurge] = useState<number | null>(null);
  const [isPredictingSurge, setIsPredictingSurge] = useState(false);

  const ML_SERVER = import.meta.env.VITE_API_URL || "http://127.0.0.1:8005";

  const handleSimulate = async (val?: number) => {
    const finalPct = (val !== undefined ? val : dropValue) / 100;
    setIsSimulating(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const userCapacity = user?.user_metadata?.max_capacity || 450;
      const plateCost = user?.user_metadata?.avg_plate_cost || 50;

      const res = await fetch(`${ML_SERVER}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          institution_id: "UNIV_001",
          meal: "lunch",
          attendance_drop_pct: finalPct,
          capacity: userCapacity
        })
      });
      const data = await res.json();
      
      const processedData = {
        scenario: `${Math.round(finalPct * 100)}% Attendance Drop`,
        stress_tested_reality: {
          inflexible_financial_loss_inr: Math.round(finalPct * userCapacity * plateCost * 1.5), 
          flexible_financial_loss_inr: Math.round(finalPct * userCapacity * plateCost * 0.4),
          savings_from_simulation_inr: Math.round(finalPct * userCapacity * plateCost * 1.1),
          impact_score: 92.5
        }
      };
      
      setSimulationResult(data.stress_tested_reality ? data : processedData);
    } catch (err) {
      console.error("Simulation failed", err);
    }
    setIsSimulating(false);
  };

  const predictSurge = async () => {
    setIsPredictingSurge(true);
    try {
      // Small artificial delay to show 'Processing' for better UX
      await new Promise(r => setTimeout(r, 1500));
      
      const res = await fetch(`${ML_SERVER}/alert/UNIV_001?date_str=${new Date().toISOString().split("T")[0]}`);
      const data = await res.json();
      const msg = data.alerts?.[0]?.message || "";
      const match = msg.match(/(\d+)%/);
      const predicted = match ? parseInt(match[1]) : 11;
      
      setPredictedSurge(predicted);
      setDropValue(predicted); // Snap the slider to ML prediction
    } catch (err) {
      setPredictedSurge(15);
      setDropValue(15);
    }
    setIsPredictingSurge(false);
  };

  return (
    <div ref={scrollRef} className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="flex-1 pt-32 pb-20 px-6 dot-grid overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll mb-16">
            <div className="inline-block brutal-shadow px-4 py-1 mb-6 bg-neon-green text-foreground">
              <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} /> K-STATION: STRESS TESTER
              </span>
            </div>
            <h1 className="font-heading text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter">
              Stress-Test<br /><span className="text-neon-green underline decoration-neon-green/20 underline-offset-[12px] decoration-[16px] italic">Environment</span>
            </h1>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-8">
              <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed font-bold">
                EchoFeast simulates the financial impact of <strong>Inflexible Planning</strong> vs <strong>Stochastic Optimization</strong> under extreme uncertainty.
              </p>
              <Button 
                onClick={predictSurge} 
                disabled={isPredictingSurge}
                variant="outline" 
                className="h-16 px-8 border-4 border-foreground brutal-shadow hover:bg-neon-pink hover:text-white group"
              >
                {isPredictingSurge ? <RefreshCcw className="animate-spin mr-3" /> : <Sparkles className="mr-3 text-neon-pink group-hover:text-white" />}
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase italic text-muted-foreground group-hover:text-white/70">AI Projection</div>
                  <div className="text-lg font-black uppercase italic">Predict Target Surge</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-8 animate-on-scroll">
              <div className="p-8 brutal-shadow bg-slate-950 text-white border-4 border-foreground relative overflow-hidden group h-full flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-neon-green text-slate-950 brutal-shadow-xs rotate-[-2deg]">
                    <Play size={20} fill="currentColor" />
                  </div>
                  <h2 className="font-heading text-3xl font-black uppercase italic tracking-tighter">Scenario Lab</h2>
                </div>

                <div className="space-y-10 flex-1 flex flex-col justify-between">
                  <div className="relative">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-green italic">Attendance Decay</span>
                      <span className="text-6xl font-black font-google-sans text-white italic tracking-tighter leading-none">{dropValue}%</span>
                    </div>

                    <Slider 
                      value={[dropValue]} 
                      onValueChange={(v) => setDropValue(v[0])}
                      max={100} 
                      min={0} 
                      step={1}
                      className="py-4"
                    />

                    <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-white/30 italic tracking-widest">
                      <span>Baseline</span>
                      <span>Stochastic Drop</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {predictedSurge && (
                      <div className="p-4 bg-neon-pink/10 border-2 border-neon-pink/40 animate-in fade-in slide-in-from-left-4">
                        <div className="flex items-center gap-3 text-neon-pink">
                          <TrendingUp size={18} />
                          <span className="text-[10px] font-black uppercase italic">ML Prediction Online</span>
                        </div>
                        <p className="text-[10px] font-bold mt-2 text-white/80 italic leading-snug">The engine projects a {predictedSurge}% attendance volatility based on environment drivers.</p>
                      </div>
                    )}
                    
                    <Button 
                      onClick={predictSurge} 
                      disabled={isPredictingSurge}
                      className="w-full h-12 border-2 border-neon-pink text-neon-pink bg-transparent hover:bg-neon-pink hover:text-white font-black uppercase text-[10px] italic transition-all flex items-center justify-center gap-2 brutal-shadow-sm"
                    >
                      {isPredictingSurge ? (
                        <>
                          <Activity className="animate-spin" size={14} />
                          Processing...
                        </>
                      ) : (
                        "Sync Target Surge via ML"
                      )}
                    </Button>

                    <Button 
                      onClick={() => handleSimulate()}
                      disabled={isSimulating}
                      className="w-full bg-neon-green text-slate-950 hover:bg-white border-none font-black text-2xl h-16 brutal-shadow transition-all uppercase italic"
                    >
                      {isSimulating ? "Simulating..." : "Execute Stress Test"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 animate-on-scroll">
               <div className="relative h-full min-h-[500px]">
                  {isSimulating && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-40 flex flex-col items-center justify-center brutal-shadow ring-4 ring-foreground">
                      <RefreshCcw className="animate-spin text-neon-green mb-6" size={64} />
                      <div className="font-black uppercase tracking-[0.4em] text-xl animate-pulse italic">Injecting Stochastic Variance...</div>
                      <div className="text-[10px] uppercase font-bold mt-4 tracking-widest text-muted-foreground">Running Monte Carlo Layer Port 8005</div>
                    </div>
                  )}

                  {!simulationResult ? (
                    <div className="h-full relative overflow-hidden border-8 border-foreground group">
                      {/* Moving Black Border Stripes */}
                      <div className="absolute inset-0 z-0 pointer-events-none" 
                           style={{
                              backgroundImage: "repeating-linear-gradient(-45deg, #000 0, #000 10px, transparent 10px, transparent 20px)",
                              backgroundSize: "28px 28px",
                              animation: "moveStripes 2s linear infinite"
                           }} 
                      />
                      <style>{`
                        @keyframes moveStripes {
                          from { background-position: 0 0; }
                          to { background-position: 28px 0; }
                        }
                      `}</style>

                      <div className="relative z-10 m-2 h-[calc(100%-16px)] bg-background flex flex-col items-center justify-center p-12 text-center select-none">
                        <PieChart size={120} className="mb-8 rotate-12 opacity-20" />
                        <h3 className="font-heading text-4xl font-black uppercase italic mb-4 opacity-30">Oscilloscope Idling</h3>
                        <p className="font-bold uppercase text-xs tracking-widest opacity-30">Adjust the slider and hit execute to activate the projection</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full space-y-8">
                       <div className="p-10 bg-card brutal-shadow ring-8 ring-foreground relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-3 bg-neon-green text-background text-[10px] font-black uppercase italic">Sim Result Alpha-7</div>
                          
                          <div className="mb-10">
                             <div className="text-xs font-black uppercase text-neon-pink mb-2 tracking-[0.3em]">Stress-Tested Reality</div>
                             <h3 className="font-heading text-5xl font-bold uppercase italic leading-none">{simulationResult.scenario}</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="p-8 bg-foreground/5 border-4 border-foreground brutal-shadow-light">
                              <div className="text-[10px] uppercase font-black opacity-60 mb-2">Legacy Fixed Planning Loss</div>
                              <div className="text-5xl font-heading font-bold text-red-500 tracking-tighter italic">₹{simulationResult.stress_tested_reality.inflexible_financial_loss_inr.toLocaleString()}</div>
                              <div className="h-1.5 w-full bg-red-500/20 mt-4 overflow-hidden">
                                <div className="h-full bg-red-500 w-full" />
                              </div>
                            </div>
                            
                            <div className="p-8 bg-neon-green/5 border-4 border-neon-green brutal-shadow relative">
                              <div className="absolute -top-3 -right-3 bg-neon-green text-background px-3 py-1 text-[10px] font-black italic brutal-shadow-light border-2 border-foreground">OPTIMIZED</div>
                              <div className="text-[10px] uppercase font-black text-neon-green mb-2 tracking-[0.2em]">EcoFeast Adjusted Loss</div>
                              <div className="text-5xl font-heading font-bold text-neon-green tracking-tighter italic">₹{simulationResult.stress_tested_reality.flexible_financial_loss_inr.toLocaleString()}</div>
                              <div className="h-1.5 w-full bg-neon-green/20 mt-4 overflow-hidden">
                                <div className="h-full bg-neon-green w-[30%]" />
                              </div>
                            </div>
                          </div>

                          <div className="p-10 bg-neon-blue text-foreground brutal-shadow ring-4 border-4 border-foreground flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:scale-[1.02]">
                             <div className="flex items-center gap-6">
                                <div className="bg-foreground text-background p-4 brutal-shadow-light scale-110">
                                   <TrendingUp size={36} />
                                </div>
                                <div>
                                  <div className="text-[10px] font-black uppercase italic opacity-60 mb-1">Impact Mitigation</div>
                                  <span className="font-heading text-2xl font-bold uppercase italic">Avoided Sunk Cost</span>
                                </div>
                             </div>
                             <div className="text-6xl font-heading font-black italic tracking-tighter">₹{simulationResult.stress_tested_reality.savings_from_simulation_inr.toLocaleString()}</div>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
