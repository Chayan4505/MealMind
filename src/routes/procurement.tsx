import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Utensils, CheckCircle, Bell, ShoppingBag, ChefHat, RefreshCcw, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/procurement")({
  component: ProcurementPage,
});

function ProcurementPage() {
  const scrollRef = useScrollAnimation();
  const { user, updateProfileData } = useAuth();
  const [procurementItems, setProcurementItems] = useState<any[]>([]);
  const [lunchForecast, setLunchForecast] = useState<number>(450);
  const [isLoading, setIsLoading] = useState(true);
  const [procuredList, setProcuredList] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 1. Sync Forecast from Local Recalibration or Default
    const savedForecast = localStorage.getItem("last_lunch_forecast");
    if (savedForecast) setLunchForecast(parseInt(savedForecast));

    // 2. Load Raw Materials from Profile/Metadata
    if (user?.user_metadata?.raw_materials) {
      const data = user.user_metadata.raw_materials;
      setProcurementItems(data.globalProcurement || (Array.isArray(data) ? data : []));
      
      // 3. Sync Procurement Status from Metadata
      if (user.user_metadata.procured_indices) {
        setProcuredList(user.user_metadata.procured_indices);
      }
    }
    
    setIsLoading(false);
  }, [user]);

  const toggleProcured = async (idx: number) => {
    const newList = { ...procuredList, [idx]: !procuredList[idx] };
    setProcuredList(newList);
    
    // Auto-save to Database
    setIsSaving(true);
    await updateProfileData({ 
      procured_indices: newList 
    });
    setIsSaving(false);
  };

  return (
    <div ref={scrollRef} className="min-h-screen bg-background flex flex-col text-foreground">
      <Navbar />
      
      <section className="flex-1 pt-32 pb-20 px-6 dot-grid overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Diagnostic Header */}
          <div className="animate-in fade-in slide-in-from-left-8 duration-700 mb-16">
             <div className="inline-block brutal-shadow px-4 py-1 mb-6 bg-neon-blue text-background border-2 border-foreground">
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Bell size={14} className="animate-pulse" /> Live Procurement Pipeline
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div>
                <h1 className="font-heading text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] mb-6">
                  Logistics<br /><span className="text-gradient-pink-blue">Precision</span>
                </h1>
                <p className="text-xl font-bold opacity-60 max-w-xl leading-tight italic">
                  Optimized procurement tasks adapted perfectly to <span className="text-foreground border-b-2 border-neon-blue">{lunchForecast} meals</span> forecasted for today.
                </p>
              </div>

              <div className="bg-neon-blue text-slate-950 p-6 brutal-shadow border-4 border-slate-950 min-w-[240px]">
                <div className="text-[10px] font-black uppercase opacity-60 mb-2">Inventory Efficiency</div>
                <div className="text-4xl font-heading font-black text-slate-950 italic">₹{(lunchForecast * 12).toLocaleString()}</div>
                <div className="text-[8px] font-bold uppercase mt-2 text-slate-950/60">Net Working Capital Saved</div>
              </div>
            </div>
          </div>

          {/* Action Board */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Table */}
            <div className="lg:col-span-8">
              <div className="brutal-shadow p-8 bg-card border-none ring-4 ring-foreground relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-neon-pink text-foreground px-4 py-1 text-[10px] font-black uppercase tracking-widest brutal-shadow-dark">Daily Target List</div>
                
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left font-bold border-collapse">
                    <thead>
                      <tr className="border-b-4 border-foreground">
                        <th className="pb-4 px-2 text-[10px] font-black uppercase tracking-widest opacity-40">Ingredient</th>
                        <th className="pb-4 px-2 text-[10px] font-black uppercase tracking-widest opacity-40">Buy Target</th>
                        <th className="pb-4 px-2 text-[10px] font-black uppercase tracking-widest opacity-40">Cook Qty</th>
                        <th className="pb-4 px-2 text-right text-[10px] font-black uppercase tracking-widest opacity-40">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {procurementItems.length > 0 ? (
                        procurementItems.map((item: any, idx: number) => (
                          <tr key={idx} className={`border-b border-foreground/10 hover:bg-muted/30 transition-all ${procuredList[idx] ? 'opacity-40 grayscale' : ''}`}>
                            <td className="py-6 px-2">
                               <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${idx % 3 === 0 ? 'bg-neon-pink' : idx % 3 === 1 ? 'bg-neon-blue' : 'bg-neon-green'}`} />
                                  <span className="text-xl font-heading uppercase italic tracking-tighter">{item.ingredient}</span>
                               </div>
                            </td>
                            <td className="py-6 px-2">
                               <span className="text-2xl font-heading font-black text-neon-pink">{item.buyQty}</span>
                            </td>
                            <td className="py-6 px-2">
                               <span className="text-xl font-heading opacity-60">{item.cookQty}</span>
                            </td>
                            <td className="py-6 px-2 text-right">
                               <Button 
                                  variant={procuredList[idx] ? "outline" : "neonPink"}
                                  onClick={() => toggleProcured(idx)}
                                  className="h-12 brutal-shadow font-black uppercase italic text-xs px-6 border-2 border-foreground"
                               >
                                  {procuredList[idx] ? <><CheckCircle size={16} className="mr-2" /> Done</> : "Procure"}
                               </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-20 text-center">
                            <RefreshCcw size={48} className="mx-auto mb-4 opacity-20" />
                            <h3 className="text-2xl font-black uppercase opacity-30 italic">No Operational Data</h3>
                            <p className="text-sm font-bold opacity-40 mb-8">Scan your daily menu in the Command Center to populate this list.</p>
                            <Link to="/dashboard">
                               <Button variant="neonBlue" className="brutal-shadow h-14 px-12 font-black uppercase italic border-4 border-foreground">
                                  Go to Command Center
                               </Button>
                            </Link>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tactical Sidebar */}
            <div className="lg:col-span-4 space-y-8">
               <div className="brutal-shadow p-8 bg-slate-950 text-white border-4 border-foreground relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-150 transition-transform duration-1000">
                     <ShoppingBag size={120} className="text-neon-pink" />
                  </div>
                  <h3 className="font-heading text-2xl font-black uppercase mb-4 italic text-neon-green">Supply Chain Target</h3>
                  <p className="text-[10px] font-bold opacity-60 uppercase mb-8 leading-tight text-white/80">These quantities are mathematically optimized to eliminate inventory leftover (Expiry Risk).</p>
                  
                  <div className="space-y-6 relative z-10">
                     <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="font-bold flex items-center gap-2 text-white/70 tracking-widest text-[10px] uppercase">
                          <div className="w-2 h-2 bg-white" /> 
                          Total Line Items
                        </span>
                        <span className="text-2xl font-heading italic text-white">{procurementItems.length}</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="font-bold flex items-center gap-2 text-white/70 tracking-widest text-[10px] uppercase">
                          <div className="w-2 h-2 bg-neon-pink" /> 
                          Items Pending
                        </span>
                        <span className="text-2xl font-heading italic text-neon-pink">{procurementItems.length - Object.values(procuredList).filter(Boolean).length}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="font-bold flex items-center gap-2 text-white/70 tracking-widest text-[10px] uppercase">
                          <div className="w-2 h-2 bg-neon-green" /> 
                          Expiry Safety
                        </span>
                        <span className="text-2xl font-heading italic text-neon-green">100%</span>
                     </div>
                  </div>
               </div>

               <div className="brutal-shadow p-8 bg-neon-yellow text-foreground border-4 border-foreground flex items-start gap-4">
                  <Info size={32} className="shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black uppercase text-sm mb-2">Logistics Alert</h4>
                    <p className="text-[10px] font-bold uppercase leading-tight italic">
                       Procurement targets are locked. Recalibrating menu in the dashboard will force a supply-chain update.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
