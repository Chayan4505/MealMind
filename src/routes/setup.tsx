import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Store, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  IndianRupee, 
  ShieldAlert, 
  Zap, 
  Calendar,
  CheckCircle2,
  Navigation,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/setup")({
  component: SetupPage,
});

function SetupPage() {
  const { user, updateProfileData, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Registration State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    kitchenName: "",
    location: null as { lat: number, lon: number } | null,
    maxCapacity: "",
    plateCost: "",
    shortageSensitivity: [3],
    syncHolidays: true,
    activateKAI: true
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login" });
    }
    // Only auto-redirect if they've finished the setup before
    if (user && user.user_metadata?.setup_complete) {
      navigate({ to: "/dashboard" });
    }
  }, [user, isLoading, navigate]);

  const handleAutoDetect = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          location: { lat: position.coords.latitude, lon: position.coords.longitude }
        }));
      });
    }
  };

  const handleLaunch = async () => {
    setIsSubmitting(true);
    
    // Save to Supabase Auth metadata
    await updateProfileData({
      restaurant_name: formData.kitchenName,
      max_capacity: parseInt(formData.maxCapacity),
      avg_plate_cost: parseFloat(formData.plateCost),
      shortage_sensitivity: formData.shortageSensitivity[0],
      smart_sync: formData.syncHolidays,
      kai_active: formData.activateKAI,
      coordinates: formData.location,
      setup_complete: true
    });

    setIsSubmitting(false);
    navigate({ to: "/dashboard" });
  };

  if (isLoading || !user) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-black uppercase text-xs tracking-widest text-neon-pink">Authenticating...</div>;
  }

  return (
    <div className="min-h-screen dot-grid flex flex-col pt-16">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6 mt-10">
        <div className="w-full max-w-2xl brutal-shadow bg-card border-none ring-4 ring-foreground relative overflow-hidden">
          
          {/* Progress Indicator */}
          <div className="h-2 w-full bg-foreground/10">
            <div 
              className="h-full bg-neon-pink transition-all duration-700" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="p-10">
            {/* STEP 1: IDENTITY & LOCATION */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-neon-yellow p-4 brutal-shadow-light border-2 border-foreground">
                    <Store size={32} />
                  </div>
                  <div>
                    <h2 className="font-heading text-3xl font-bold uppercase italic italic">Identity & Location</h2>
                    <p className="text-[10px] font-black uppercase opacity-50 tracking-widest mt-1">Foundation Strategy</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Kitchen / Canteen Name</Label>
                    <Input 
                      placeholder="e.g. MAKAUT Central Canteen" 
                      value={formData.kitchenName}
                      onChange={(e) => setFormData(p => ({ ...p, kitchenName: e.target.value }))}
                      className="h-14 brutal-shadow font-bold text-lg border-2"
                    />
                  </div>

                  <div className="p-6 bg-background border-4 border-foreground brutal-shadow-dark flex items-center justify-between">
                    <div>
                      <h4 className="font-black uppercase text-sm mb-1 italic">Weather Syncing</h4>
                      <p className="text-[10px] font-bold opacity-50 uppercase max-w-[200px]">IMD Local Grid Data Mapping</p>
                    </div>
                    <Button 
                      variant={formData.location ? "outline" : "neonPink"}
                      onClick={handleAutoDetect}
                      className="h-14 px-8 border-2 brutal-shadow"
                    >
                      {formData.location ? (
                        <><CheckCircle2 size={18} className="mr-2 text-neon-green" /> Detected</>
                      ) : (
                        <><Navigation size={18} className="mr-2" /> Auto-Detect</>
                      )}
                    </Button>
                  </div>

                  <Button 
                    onClick={() => setStep(2)} 
                    disabled={!formData.kitchenName}
                    className="w-full h-16 bg-foreground text-background font-black uppercase italic tracking-widest text-lg brutal-shadow hover:bg-neon-pink transition-all"
                  >
                    Next Phase <ArrowRight size={20} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: OPERATIONS */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-neon-blue p-4 brutal-shadow-light border-2 border-foreground">
                    <Zap size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-heading text-3xl font-bold uppercase italic">Operational Math</h2>
                    <p className="text-[10px] font-black uppercase opacity-50 tracking-widest mt-1">Calibration Engine</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Max Daily Capacity</Label>
                      <div className="relative">
                        <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                        <Input 
                          type="number" 
                          placeholder="450" 
                          className="h-14 pl-12 border-2 brutal-shadow font-black text-xl"
                          value={formData.maxCapacity}
                          onChange={(e) => setFormData(p => ({ ...p, maxCapacity: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg Plate Cost (₹)</Label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                        <Input 
                          type="number" 
                          placeholder="85" 
                          className="h-14 pl-12 border-2 brutal-shadow font-black text-xl"
                          value={formData.plateCost}
                          onChange={(e) => setFormData(p => ({ ...p, plateCost: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 border-4 border-foreground brutal-shadow-dark bg-background">
                    <div className="flex justify-between items-end mb-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Shortage Sensitivity</Label>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <ShieldAlert key={s} size={18} className={s <= formData.shortageSensitivity[0] ? "text-neon-pink fill-neon-pink" : "text-foreground/10"} />
                        ))}
                      </div>
                    </div>
                    <Slider 
                      value={formData.shortageSensitivity} 
                      max={5} 
                      min={1} 
                      step={1} 
                      onValueChange={(v) => setFormData(p => ({ ...p, shortageSensitivity: v }))}
                    />
                    <div className="flex justify-between mt-2 text-[8px] font-black uppercase opacity-40">
                      <span>Low (Resource Saver)</span>
                      <span>High (Safety First)</span>
                    </div>
                    <p className="text-[10px] mt-4 font-bold text-center opacity-60 uppercase italic">
                      "How critical is it to NEVER run out of food?"
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="h-16 w-20 brutal-shadow border-4 border-foreground">
                      <ArrowLeft />
                    </Button>
                    <Button 
                      onClick={() => setStep(3)} 
                      disabled={!formData.maxCapacity || !formData.plateCost}
                      className="flex-1 h-16 bg-foreground text-background font-black uppercase italic tracking-widest text-lg brutal-shadow hover:bg-neon-blue transition-all"
                    >
                      Next Phase <ArrowRight size={20} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: INTELLIGENCE ACTIVATION */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-neon-pink p-4 brutal-shadow-light border-2 border-foreground">
                    <Sparkles size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-heading text-3xl font-bold uppercase italic tracking-tighter">Intelligence Activation</h2>
                    <p className="text-[10px] font-black uppercase opacity-50 tracking-widest mt-1">XGBoost Optimization Layer</p>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="p-6 bg-background border-4 border-foreground brutal-shadow-dark flex items-center justify-between hover:bg-neon-green/5 transition-colors">
                    <div className="flex gap-4 items-center">
                      <Calendar className="text-neon-blue" />
                      <div>
                        <h4 className="font-black uppercase text-sm mb-1">WB Smart Calendar</h4>
                        <p className="text-[9px] font-bold opacity-50 uppercase">Auto-sync Holidays & Exam Weeks</p>
                      </div>
                    </div>
                    <Switch checked={formData.syncHolidays} onCheckedChange={(v) => setFormData(p => ({ ...p, syncHolidays: v }))} />
                  </div>

                  <div className="p-6 bg-background border-4 border-foreground brutal-shadow-dark flex items-center justify-between hover:bg-neon-pink/5 transition-colors">
                    <div className="flex gap-4 items-center">
                      <Zap className="text-neon-yellow" />
                      <div>
                        <h4 className="font-black uppercase text-sm mb-1">Kolkata Appetite Index</h4>
                        <p className="text-[9px] font-bold opacity-50 uppercase">Weather-based sentiment weightage</p>
                      </div>
                    </div>
                    <Switch checked={formData.activateKAI} onCheckedChange={(v) => setFormData(p => ({ ...p, activateKAI: v }))} />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="h-16 w-20 brutal-shadow border-4 border-foreground">
                    <ArrowLeft />
                  </Button>
                  <Button 
                    onClick={handleLaunch}
                    disabled={isSubmitting}
                    className="flex-1 h-16 bg-neon-green text-primary-foreground font-black uppercase italic tracking-widest text-lg brutal-shadow hover:scale-[1.02] border-4 border-foreground transition-all"
                  >
                    {isSubmitting ? "Generating Weights..." : "Launch Optimization Engine"} <Zap size={20} className="ml-2 fill-current" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
