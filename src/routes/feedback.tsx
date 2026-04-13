import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle, RefreshCcw, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const scrollRef = useScrollAnimation();
  const { user } = useAuth();
  const [wasteLevel, setWasteLevel] = useState<"Low" | "Expected" | "High" | null>(null);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [dinnerForecast, setDinnerForecast] = useState<number>(0);
  const [backendStatus, setBackendStatus] = useState<"online" | "offline">("online");

  const ML_SERVER = import.meta.env.VITE_API_URL || "http://127.0.0.1:8005";

  const fetchDinnerPrediction = async (waste?: "Low" | "Expected" | "High") => {
    setIsRecalibrating(true);
    try {
      // Map waste levels to ML sentiment signals
      const sentiment = waste === "High" ? 0.8 : waste === "Low" ? 1.15 : 1.0;
      
      const res = await fetch(`${ML_SERVER}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: format(new Date(), "yyyy-MM-dd"),
          institution_id: "UNIV_001",
          meal: "dinner",
          item_name: "Dinner Thali Base",
          sentiment_decay: sentiment,
          humidity: 82.0,
          temperature: 26.0
        })
      });

      if (!res.ok) throw new Error("Backend Offline");
      
      const data = await res.json();
      const newQty = data.prediction.recommended_cook;
      
      console.log(`[EcoFeast ML] 🔁 Recalibrated Dinner Forecast based on ${waste || 'Initial'} conditions:`, newQty);
      setDinnerForecast(newQty);
      localStorage.setItem("recalibrated_dinner_forecast", newQty.toString());
      setBackendStatus("online");
    } catch (err) {
      console.error("[EcoFeast ML] ❌ Calibration Failed:", err);
      setBackendStatus("offline");
      // Safety fallback if ML engine is unreachable during the hackathon
      setDinnerForecast(320); 
    }
    setIsRecalibrating(false);
  };

  // Initial load
  useEffect(() => {
    fetchDinnerPrediction();
  }, []);

  const handleLogWaste = (level: "Low" | "Expected" | "High") => {
    setWasteLevel(level);
    fetchDinnerPrediction(level);
  };

  return (
    <div ref={scrollRef} className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="flex-1 pt-32 pb-20 px-6 dot-grid">
        <div className="max-w-5xl mx-auto">
          <div className="animate-on-scroll mb-12">
             <div className="inline-block brutal-shadow px-4 py-1 mb-6 bg-neon-pink text-primary-foreground">
              <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Bell size={14} /> {format(new Date(), "hh:mm a")} • FEEDBACK LOOP
              </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[0.95]">
              Recalibrate<br /><span className="text-neon-pink">AI Engine</span>
            </h1>
            <p className="mt-6 text-muted-foreground max-w-xl text-lg">
              Log lunch waste outputs so the AI can automatically readjust upcoming dinner prep using real-time feedback loops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="brutal-shadow p-8 bg-card border-none ring-4 ring-neon-pink shadow-[0_0_25px_oklch(0.65_0.28_350_/_0.2)]">
               <h2 className="font-heading text-3xl font-bold mb-4">Log Lunch Waste</h2>
               <p className="text-md text-muted-foreground mb-8">How much food was left over after lunch service?</p>

               <div className="space-y-4">
                 <Button 
                   variant={"outline"} 
                   className={`w-full h-16 justify-start text-xl transition-colors border-2 ${wasteLevel === "Low" ? 'bg-foreground text-background border-foreground' : 'hover:bg-neon-pink/10 hover:border-neon-pink'}`}
                   onClick={() => handleLogWaste("Low")}
                   disabled={isRecalibrating}
                 >
                   <ArrowDown className={`mr-4 ${wasteLevel === "Low" ? 'text-neon-pink' : 'text-neon-pink'}`} size={24}/> Low Waste (Ran Out)
                 </Button>
                 <Button 
                   variant={"outline"}
                   className={`w-full h-16 justify-start text-xl transition-colors border-2 ${wasteLevel === "Expected" ? 'bg-foreground text-background border-foreground' : 'hover:bg-neon-green/10 hover:border-neon-green'}`}
                   onClick={() => handleLogWaste("Expected")}
                   disabled={isRecalibrating}
                 >
                   <CheckCircle className={`mr-4 ${wasteLevel === "Expected" ? 'text-neon-green' : 'text-neon-green'}`} size={24}/> Expected (Perfect)
                 </Button>
                 <Button 
                   variant={"outline"}
                   className={`w-full h-16 justify-start text-xl transition-colors border-2 ${wasteLevel === "High" ? 'bg-foreground text-background border-foreground' : 'hover:bg-neon-blue/10 hover:border-neon-blue'}`}
                   onClick={() => handleLogWaste("High")}
                   disabled={isRecalibrating}
                 >
                   <ArrowUp className={`mr-4 ${wasteLevel === "High" ? 'text-neon-blue' : 'text-neon-blue'}`} size={24}/> High Waste (Too Much)
                 </Button>
               </div>
            </div>

            <div className="brutal-shadow p-8 bg-background relative overflow-hidden flex flex-col">
              {isRecalibrating && (
                <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center px-6">
                  <RefreshCcw className="animate-spin text-neon-pink mb-4" size={40} />
                  <div className="font-bold uppercase tracking-widest text-md text-foreground">Syncing with Port 8005...</div>
                  <div className="text-[10px] text-muted-foreground mt-2 uppercase">XGBoost Recalibration in Progress</div>
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div className="text-sm font-bold uppercase tracking-widest text-foreground mb-2">{format(new Date(), "hh:mm a")} • Response</div>
                <div className={`px-2 py-0.5 border-2 border-foreground text-[8px] font-black uppercase ${backendStatus === "online" ? "bg-neon-green text-foreground" : "bg-neon-pink text-white"}`}>
                  {backendStatus === "online" ? "Live AI Connection" : "Connection Error"}
                </div>
              </div>
              <h2 className="font-heading text-2xl font-bold mb-6">Dinner Target</h2>
              
              <div className="p-8 bg-card brutal-shadow mb-6 text-center border-l-8 border-l-foreground flex-1 flex flex-col items-center justify-center">
                <div className="text-sm uppercase text-muted-foreground font-bold mb-2">New Forecast</div>
                <div className={`text-7xl font-heading font-bold transition-colors ${wasteLevel === "High" ? "text-neon-blue" : wasteLevel === "Low" ? "text-neon-pink" : wasteLevel === "Expected" ? "text-neon-green" : ""}`}>
                  {dinnerForecast || "---"}
                </div>
                <div className="text-lg mt-2 text-muted-foreground font-bold">meals expected</div>
              </div>

              <div className="mt-auto">
                {!wasteLevel ? (
                  <div className="text-md text-muted-foreground text-center animate-pulse py-3 font-bold uppercase text-[10px] tracking-widest">Awaiting Manual Feedback Loop</div>
                ) : (
                  <div className="p-5 bg-neon-yellow text-foreground text-md font-bold brutal-shadow flex items-start gap-4">
                    <AlertTriangle className="shrink-0 mt-0.5" size={24} />
                    <div className="leading-tight">
                      {wasteLevel === "High" && "Overcooked lunch detected! Recalibrated inputs for dinner to prioritize waste reduction."}
                      {wasteLevel === "Expected" && "Lunch forecasting was extremely accurate. Baseline maintained with dynamic environmental corrections."}
                      {wasteLevel === "Low" && "Lunch sold out early! Increased dinner target to capture latent high-attendance demand."}
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
