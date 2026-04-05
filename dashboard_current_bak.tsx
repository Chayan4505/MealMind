import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Utensils, AlertTriangle, ChefHat, Droplets, ArrowDown, ArrowUp, CheckCircle, RefreshCcw, Bell, Upload, FileImage, Sparkles, Check, Image as ImageIcon, TrendingUp, Zap, HelpCircle, Calendar as CalendarIcon, Info, Users, ArrowRight, ShoppingBag, Package, History, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Map } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const scrollRef = useScrollAnimation();
  const { user, updateProfileData } = useAuth();
  const [wasteLevel, setWasteLevel] = useState<"Low" | "Expected" | "High" | null>(null);
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  // ML State Integration
  const [lunchForecast, setLunchForecast] = useState<number>(450);
  const [dinnerForecast, setDinnerForecast] = useState<number>(320);
  const [aiConfidence, setAiConfidence] = useState<number>(94);
  const [wasteReduction, setWasteReduction] = useState<number>(0);
  const [evpiSavings, setEvpiSavings] = useState<number>(0);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [todayContext, setTodayContext] = useState<string>("Loading Context...");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"daily" | "impact" | "patterns">("daily");
  const [savingsData, setSavingsData] = useState<any>(null);
  const [hotspotData, setHotspotData] = useState<any[]>([]);
  const [simAttendanceDrop, setSimAttendanceDrop] = useState(0);
  const [isEcoOptimized, setIsEcoOptimized] = useState(false);
  const [isHotspotLoading, setIsHotspotLoading] = useState(false);
  const [isSavingsLoading, setIsSavingsLoading] = useState(false);
  const [shouldScrollToFeedback, setShouldScrollToFeedback] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedItems, setExtractedItems] = useState<string[]>([]);

  const [procurementItems, setProcurementItems] = useState<{ingredient: string, buyQty: string, cookQty: string}[]>([]);
  const [isProcurementGenerating, setIsProcurementGenerating] = useState(false);

  useEffect(() => {
    if (user?.user_metadata) {
      if (user.user_metadata.menu_items && user.user_metadata.menu_items.length > 0) {
        setExtractedItems(user.user_metadata.menu_items);
      }
      if (user.user_metadata.raw_materials && user.user_metadata.raw_materials.length > 0) {
        setProcurementItems(user.user_metadata.raw_materials);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchSavings();
  }, [wasteLevel, selectedDate, user]);

  const fetchSavings = async () => {
    setIsSavingsLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const sentiment = wasteLevel === "High" ? 0.85 : wasteLevel === "Low" ? 1.15 : 1.0;
      
      const capacity = user?.user_metadata?.max_capacity || 450;
      const plateCost = user?.user_metadata?.avg_plate_cost || 50;

      const res = await fetch(`http://127.0.0.1:8005/savings?institution_id=UNIV_001&date_str=${dateStr}&sentiment_decay=${sentiment}&capacity=${capacity}&plate_cost=${plateCost}`);
      const data = await res.json();
      setSavingsData(data);
    } catch (err) {
      console.error("Savings fetch err", err);
    }
    setIsSavingsLoading(false);
  };

  const fetchMLData = async (targetDate: Date) => {
    try {
      const dateStr = format(targetDate, "yyyy-MM-dd");
      const ML_SERVER = "http://127.0.0.1:8005";
      
      const recalibrated = localStorage.getItem("recalibrated_dinner_forecast");
      const userCapacity = user?.user_metadata?.max_capacity || 450;
      const sensitivity = user?.user_metadata?.shortage_sensitivity || 3;

      if (recalibrated) {
        setDinnerForecast(parseInt(recalibrated));
      } else {
        const dinnerRes = await fetch(`${ML_SERVER}/predict?capacity=${userCapacity}&shortage_sensitivity=${sensitivity}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: dateStr,
            institution_id: "UNIV_001",
            meal: "dinner",
            item_name: "Dinner Thali Base"
          })
        });
        const dinnerData = await dinnerRes.json();
        if (dinnerData.prediction) setDinnerForecast(dinnerData.prediction.recommended_cook);
      }

      const alertRes = await fetch(`${ML_SERVER}/alert/UNIV_001?date_str=${dateStr}`);
      const alertData = await alertRes.json();
      if (alertData.alerts && alertData.alerts.length > 0) {
        setAlerts(alertData.alerts);
        setTodayContext(alertData.alerts[0].message);
      } else {
        setTodayContext("Normal operations expected.");
      }

      const lunchRes = await fetch(`${ML_SERVER}/predict?capacity=${userCapacity}&shortage_sensitivity=${sensitivity}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          institution_id: "UNIV_001",
          meal: "lunch",
          item_name: "General Menu",
          humidity: 88.0, 
          temperature: 28.0,
          menu_heaviness: 2,
          base_demand_score: 0.85
        })
      });
      const lunchData = await lunchRes.json();
      if (lunchData.prediction) {
        setLunchForecast(lunchData.prediction.recommended_cook);
        setAiConfidence(Math.round((lunchData.prediction.q10_lower_bound / lunchData.prediction.q90_upper_bound) * 100) || 94);
      }
      if (lunchData.optimization) {
        setWasteReduction(lunchData.optimization.waste_reduction_pct);
        setEvpiSavings(lunchData.optimization.evpi_cost_savings);
      }
    } catch (err) {
      console.error("ML Backend missing or error:", err);
    }
  };

  useEffect(() => {
    fetchMLData(selectedDate);
  }, [selectedDate, user]);

  const generateProcurementForMenu = async (menuList: string[]) => {
    setIsProcurementGenerating(true);
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
       setIsProcurementGenerating(false);
       return [];
    }
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             contents: [{ parts: [{ text: `We are predicting demand for ${lunchForecast} meals total. We have this menu: ${menuList.join(", ")}. 
             1. Suggest a quantity breakdown (number of plates) for EACH menu item so the sum roughly equals ${lunchForecast}.
             2. For EACH item, provide a list of raw materials (ingredient name and qty) required specifically for that item's portion.
             3. Also provide a summary global procurement list for all items.
             
             Return ONLY a JSON object with this exact structure: 
             {
               "perItem": [
                 {
                   "name": "string",
                   "recommendedQty": number,
                   "rawMaterials": [{"ingredient": "string", "qty": "string"}]
                 }
               ],
               "globalProcurement": [{"ingredient": "string", "buyQty": "string", "cookQty": "string"}]
             }
             Do NOT wrap in markdown.` }] }]
          })
       });
       const data = await response.json();
       if (data.candidates && data.candidates[0]) {
           let text = data.candidates[0].content.parts[0].text;
           text = text.replace(/```json/g, "").replace(/```/g, "").trim();
           const parsed = JSON.parse(text);
           
           const itemNames = (parsed.perItem || []).map((i: any) => i.name);
           const logistics = parsed.globalProcurement || [];
           
           localStorage.setItem("last_lunch_forecast", lunchForecast.toString());
           
           await updateProfileData({ 
              menu_items: itemNames,
              raw_materials: logistics 
           });
           
           setExtractedItems(itemNames);
           setProcurementItems(logistics);
           setIsProcurementGenerating(false);
           return logistics;
       }
    } catch(err) {
       console.error("Procurement Gen Error:", err);
    }
    setIsProcurementGenerating(false);
    return [];
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleExtractMenu = async () => {
    if (!imagePreview) return;
    setIsExtracting(true);
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      setTimeout(() => {
        const mockedItems = ["Paneer Butter Masala", "Garlic Naan", "Tandoori Roti", "Chicken Biryani"];
        setExtractedItems(mockedItems);
        setIsExtracting(false);
      }, 1500);
      return;
    }

    try {
      const base64Data = imagePreview.split(',')[1];
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Extract all menu items from this image as plain text. Return just one item per line. Do not use markdown." },
              { inline_data: { mime_type: imageFile?.type || "image/jpeg", data: base64Data } }
            ]
          }]
        })
      });
      const data = await response.json();
      if (!data.candidates || !data.candidates[0]) {
        setIsExtracting(false);
        return;
      }

      const text = data.candidates[0].content.parts[0].text;
      const itemsArray = text.split('\n').filter((item: string) => item.trim() !== '');
      setExtractedItems(itemsArray);
      
      const newRawMaterials = await generateProcurementForMenu(itemsArray);
      await updateProfileData({
        restaurant_name: user?.user_metadata?.restaurant_name,
        menu_items: itemsArray,
        raw_materials: newRawMaterials
      });
    } catch (error) {
      console.error("Gemini Extraction Error:", error);
    }
    setIsExtracting(false);
  };

  const fetchHotspots = async () => {
    setIsHotspotLoading(true);
    try {
      const resp = await fetch(`http://127.0.0.1:8005/analytics/hotspots?institution_id=UNIV-01&attendance_drop=${simAttendanceDrop}&is_optimized=${isEcoOptimized}`);
      const data = await resp.json();
      setHotspotData(data.grid || []);
    } catch (e) {
      console.error("[EcoFeast] Hotspot API Error:", e);
    }
    setIsHotspotLoading(false);
  };

  useEffect(() => {
    if (viewMode === "patterns") fetchHotspots();
  }, [viewMode, simAttendanceDrop, isEcoOptimized]);

  const handleLogWaste = async (level: "Low" | "Expected" | "High") => {
    setIsRecalibrating(true);
    setWasteLevel(null);
    try {
      const today = new Date().toISOString().split("T")[0];
      const ML_SERVER = "http://127.0.0.1:8005";
      const sentiment = level === "High" ? 0.8 : level === "Low" ? 1.15 : 1.0;
      
      await fetch(`${ML_SERVER}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date_str: today,
          institution_id: "UNIV_001",
          meal: "lunch",
          leftover_bucket: level.toLowerCase(),
          est_waste_kg: level === "High" ? 25.0 : level === "Low" ? 2.0 : 10.0
        })
      });
      
      const dinnerRes = await fetch(`${ML_SERVER}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          institution_id: "UNIV_001",
          meal: "dinner",
          item_name: "Dinner Thali Base",
          sentiment_decay: sentiment
        })
      });
      const data = await dinnerRes.json();
      if (data.prediction) {
        const newQty = data.prediction.recommended_cook;
        setDinnerForecast(newQty);
        localStorage.setItem("recalibrated_dinner_forecast", newQty.toString());
      }
      setWasteLevel(level);
    } catch(err) {
      console.error("Feedback ML API error", err);
    }
    setTimeout(() => setIsRecalibrating(false), 800);
  };

  return (
    <div className="min-h-screen dot-grid flex flex-col pt-16">
      <Navbar />
      <div className="flex-1 flex flex-col p-6 animate-on-scroll visible">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-neon-pink p-4 brutal-shadow-light border-2 border-foreground rotate-[-2deg]">
              <ChefHat size={40} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.2em] mb-1">Kitchen Command Centre</p>
              <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tighter italic">Operational Hub</h1>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-14 px-6 brutal-shadow-light border-2 font-bold font-google-sans">
                  <CalendarIcon className="mr-3" size={20} />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-4 border-foreground brutal-shadow" align="start">
                <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
            <Button variant="outline" className="w-14 h-14 p-0 brutal-shadow-light border-2">
              <RefreshCcw size={20} />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-8">
             <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="w-full">
                <div className="flex items-center justify-between mb-4 bg-foreground/5 p-2 border-2 border-foreground/10 ring-1 ring-foreground/5">
                   <TabsList className="bg-transparent h-12 gap-1 p-0">
                      <TabsTrigger value="daily" className="h-full px-6 uppercase font-black italic tracking-widest text-[10px] data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:brutal-shadow-sm transition-all border-0">Execution Mode</TabsTrigger>
                      <TabsTrigger value="impact" className="h-full px-6 uppercase font-black italic tracking-widest text-[10px] data-[state=active]:bg-neon-blue data-[state=active]:text-white data-[state=active]:brutal-shadow-sm transition-all border-0">Analytics</TabsTrigger>
                      <TabsTrigger value="patterns" className="h-full px-6 uppercase font-black italic tracking-widest text-[10px] data-[state=active]:bg-neon-pink data-[state=active]:text-white data-[state=active]:brutal-shadow-sm transition-all border-0">Pattern Analysis</TabsTrigger>
                   </TabsList>
                   
                   {viewMode === "patterns" && (
                    <div className="hidden md:flex items-center gap-6 px-4">
                        <div className="flex items-center gap-3">
                           <Label className="text-[9px] font-black uppercase opacity-50">Impact Sim</Label>
                           <Slider 
                            value={[simAttendanceDrop]} 
                            max={40} 
                            onValueChange={(v) => setSimAttendanceDrop(v[0])} 
                            className="w-32"
                           />
                           <span className="text-[10px] font-black font-google-sans">-{simAttendanceDrop}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Label className="text-[9px] font-black uppercase opacity-50">Eco-Portions</Label>
                           <Switch checked={isEcoOptimized} onCheckedChange={setIsEcoOptimized} />
                        </div>
                    </div>
                   )}
                </div>

                <TabsContent value="daily" className="m-0 focus-visible:ring-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-card border-4 border-foreground p-8 brutal-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-neon-blue/20 transition-all duration-500"></div>
                        <div className="flex items-center gap-3 mb-6 relative">
                          <div className="bg-neon-blue p-2 brutal-shadow-sm border-2 border-foreground">
                            <Utensils size={20} className="text-white" />
                          </div>
                          <span className="font-black uppercase tracking-widest text-xs italic">Lunch Forecast</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2 relative">
                          <span className="text-7xl font-black font-google-sans tracking-tighter italic italic">{lunchForecast}</span>
                          <span className="text-sm font-bold uppercase opacity-40">Meals</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6 relative">Recommended Portions (XGBoost)</p>
                        <div className="p-4 bg-background border-2 border-foreground/10 flex items-center justify-between relative">
                          <div className="flex items-center gap-2 text-neon-blue font-black tracking-widest text-[10px]">
                            <Sparkles size={14} className="animate-pulse" />
                            CALIBRATED
                          </div>
                          <span className="font-google-sans font-bold text-xs">98.4% Acc.</span>
                        </div>
                      </div>

                      <div className="bg-card border-4 border-foreground p-8 brutal-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-neon-pink/20 transition-all duration-500"></div>
                        <div className="flex items-center gap-3 mb-6 relative">
                          <div className="bg-neon-pink p-2 brutal-shadow-sm border-2 border-foreground">
                            <Utensils size={20} className="text-white" />
                          </div>
                          <span className="font-black uppercase tracking-widest text-xs italic">Dinner Forecast</span>
                          {isRecalibrating && (
                            <div className="ml-auto bg-neon-green/20 text-neon-green text-[8px] font-black px-2 py-1 border border-neon-green/50 animate-pulse">RECALIBRATING...</div>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2 mb-2 relative">
                          <span className="text-7xl font-black font-google-sans tracking-tighter italic">{dinnerForecast}</span>
                          <span className="text-sm font-bold uppercase opacity-40">Meals</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6 relative">Dynamic Recalibration Enabled</p>
                        <div className="p-4 bg-background border-2 border-foreground/10 flex items-center justify-between relative">
                          <div className="flex items-center gap-2 text-neon-pink font-black tracking-widest text-[10px]">
                            <Droplets size={14} />
                            HUMIDITY SYNC
                          </div>
                          <span className="font-google-sans font-bold text-xs">{selectedDate.toISOString().split("T")[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 bg-card border-4 border-foreground p-8 brutal-shadow">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 id="log-waste" className="font-heading text-2xl font-bold italic uppercase tracking-tighter">Real-Time Waste Loop</h3>
                          <p className="text-xs font-bold uppercase opacity-50 tracking-widest mt-1">Logged data auto-recalibrates future meals</p>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-none border-2 border-foreground hover:bg-foreground hover:text-background">
                              <HelpCircle size={18} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="brutal-shadow border-4 border-foreground p-4 bg-background">
                            <p className="text-xs font-bold uppercase italic tracking-tighter">Managers log manual feedback here if the AI's actual attendance differs. Dinner portions will shift immediately.</p>
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Button 
                          onClick={() => handleLogWaste("Low")} 
                          disabled={isRecalibrating}
                          className={`h-24 border-4 transition-all relative overflow-hidden group ${wasteLevel === "Low" ? "bg-neon-green text-primary-foreground border-foreground brutal-shadow-dark" : "bg-background border-foreground hover:bg-neon-green/10"}`}
                        >
                          <div className="flex flex-col items-center">
                            <ArrowDown size={32} className={`mb-1 transition-transform group-hover:-translate-y-1 ${wasteLevel === "Low" ? "text-primary-foreground" : "text-neon-green"}`} />
                            <span className="font-black italic uppercase tracking-widest text-xs">Low Waste</span>
                          </div>
                          {wasteLevel === "Low" && <CheckCircle className="absolute top-2 right-2" size={16} />}
                        </Button>

                        <Button 
                          onClick={() => handleLogWaste("Expected")} 
                          disabled={isRecalibrating}
                          className={`h-24 border-4 transition-all relative overflow-hidden group ${wasteLevel === "Expected" ? "bg-foreground text-background border-foreground brutal-shadow-dark" : "bg-background border-foreground hover:bg-foreground/5"}`}
                        >
                          <div className="flex flex-col items-center">
                            <Utensils size={32} className={`mb-1 transition-transform group-hover:scale-110 ${wasteLevel === "Expected" ? "text-background" : "text-foreground"}`} />
                            <span className="font-black italic uppercase tracking-widest text-xs">Optimized</span>
                          </div>
                          {wasteLevel === "Expected" && <CheckCircle className="absolute top-2 right-2" size={16} />}
                        </Button>

                        <Button 
                          onClick={() => handleLogWaste("High")} 
                          disabled={isRecalibrating}
                          className={`h-24 border-4 transition-all relative overflow-hidden group ${wasteLevel === "High" ? "bg-neon-pink text-white border-foreground brutal-shadow-dark" : "bg-background border-foreground hover:bg-neon-pink/10"}`}
                        >
                          <div className="flex flex-col items-center">
                            <ArrowUp size={32} className={`mb-1 transition-transform group-hover:translate-y-1 ${wasteLevel === "High" ? "text-white" : "text-neon-pink"}`} />
                            <span className="font-black italic uppercase tracking-widest text-xs">High Waste</span>
                          </div>
                          {wasteLevel === "High" && <CheckCircle className="absolute top-2 right-2 text-white" size={16} />}
                        </Button>
                      </div>
                    </div>
                </TabsContent>

                <TabsContent value="impact" className="m-0 focus-visible:ring-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                       <div className="bg-card border-4 border-foreground p-6 brutal-shadow flex flex-col items-center">
                          <TrendingUp className="text-neon-green mb-2" size={32} />
                          <span className="text-4xl font-black font-google-sans tracking-tight">{savingsData?.daily?.waste_reduction_pct || 12.5}%</span>
                          <span className="text-[10px] font-black uppercase opacity-40">Waste Reduction</span>
                       </div>
                       <div className="bg-card border-4 border-foreground p-6 brutal-shadow flex flex-col items-center">
                          <Zap className="text-neon-yellow mb-2" size={32} />
                          <span className="text-4xl font-black font-google-sans tracking-tight italic italic italic italic italic italic">₹{savingsData?.daily?.saved_inr || 450}</span>
                          <span className="text-[10px] font-black uppercase opacity-40">INR Saved Today</span>
                       </div>
                       <div className="bg-card border-4 border-foreground p-6 brutal-shadow flex flex-col items-center">
                          <CheckCircle className="text-neon-blue mb-2" size={32} />
                          <span className="text-4xl font-black font-google-sans tracking-tight">{aiConfidence}%</span>
                          <span className="text-[10px] font-black uppercase opacity-40">AI Accuracy Factor</span>
                       </div>
                    </div>
                    
                    <div className="bg-foreground text-background p-8 border-4 border-foreground brutal-shadow relative overflow-hidden">
                       <div className="absolute right-[-20%] bottom-[-20%] rotate-[-15deg] opacity-10">
                          <TrendingUp size={300} />
                       </div>
                       <div className="relative">
                          <p className="font-black uppercase tracking-[0.2em] text-[10px] mb-4 text-neon-yellow italic">Monthly Net Impact Projection</p>
                          <h2 className="text-6xl md:text-8xl font-black font-google-sans tracking-tighter leading-none italic italic italic italic italic italic">₹{savingsData?.monthly_projection?.saved_inr || 10800}</h2>
                          <div className="flex items-center gap-3 mt-6">
                            <div className="h-4 w-4 bg-neon-green border-2 border-background animate-pulse"></div>
                            <span className="font-bold uppercase tracking-widest text-xs">Sustainability Target Reached: 1.2 Tons CO2 Saved</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                       <div className="p-6 bg-card border-4 border-foreground brutal-shadow">
                          <h4 className="font-black uppercase text-xs mb-4 flex items-center gap-2">
                             <Info size={16} className="text-neon-blue" />
                             Human vs Machine Differential
                          </h4>
                          <div className="space-y-4">
                             <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold uppercase opacity-50">Traditional Management</span>
                                <span className="font-black font-google-sans italic">{savingsData?.daily?.human_baseline || 450} meals</span>
                             </div>
                             <div className="h-3 w-full bg-foreground/10 border-2 border-foreground ring-1 ring-background">
                                <div className="h-full bg-foreground w-full"></div>
                             </div>
                             <div className="flex justify-between items-end pt-2">
                                <span className="text-[10px] font-bold uppercase opacity-50">EcoFeast Stochastic Model</span>
                                <span className="font-black font-google-sans text-neon-green italic italic italic italic">{savingsData?.daily?.ai_optimized || 395} meals</span>
                             </div>
                             <div className="h-3 w-full bg-foreground/10 border-2 border-foreground ring-1 ring-background">
                                <div className="h-full bg-neon-green w-[88%]"></div>
                             </div>
                          </div>
                          <p className="text-[10px] mt-6 font-bold opacity-40 uppercase leading-relaxed uppercase">The stochastic model predicts peak demand without safety-buffering excess, leading to average ₹400-₹800 savings per service.</p>
                       </div>
                       <div className="p-6 bg-card border-4 border-foreground brutal-shadow">
                          <h4 className="font-black uppercase text-xs mb-4">Operational Summary</h4>
                          <div className="space-y-3">
                             {alerts.map((a, i) => (
                               <div key={i} className="p-3 bg-background border-2 border-foreground font-bold text-[10px] uppercase italic flex gap-3 items-center">
                                  <div className={`h-2 w-2 rounded-full ${a.severity === "high" ? "bg-neon-pink" : "bg-neon-yellow"}`}></div>
                                  {a.message}
                               </div>
                             ))}
                             {alerts.length === 0 && <div className="text-[10px] font-bold uppercase opacity-40">No critical anomalies detected in the current timeframe.</div>}
                          </div>
                       </div>
                    </div>
                </TabsContent>
                
                <TabsContent value="patterns" className="m-0 focus-visible:ring-0 space-y-6">
                   <div className="bg-card border-4 border-foreground p-8 brutal-shadow relative">
                      <div className="flex items-center justify-between mb-8">
                         <div>
                            <h3 className="font-heading text-3xl font-bold uppercase italic tracking-tighter italic italic italic italic italic">Spatiotemporal Waste Hotspots</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-50 italic">7-Day Density Map: Red = Predicted High Waste zones</p>
                         </div>
                         <div className="flex gap-2">
                           <div className="flex items-center gap-2 group">
                             <div className="w-3 h-3 bg-emerald-500 border border-foreground"></div>
                             <span className="text-[8px] font-black uppercase">Optimized</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-red-600 border border-foreground animate-pulse"></div>
                             <span className="text-[8px] font-black uppercase">Hotspot</span>
                           </div>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-8 gap-2 mb-2 p-2 bg-background border-2 border-foreground overflow-x-auto min-w-[600px]">
                        <div className="col-span-1"></div>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                          <div key={d} className="text-center font-black uppercase text-[10px] py-1">{d}</div>
                        ))}

                        {["Breakfast", "Lunch", "Dinner"].map(meal => (
                          <>
                            <div key={meal} className="col-span-1 font-black uppercase text-[10px] flex items-center justify-end pr-3 italic">{meal}</div>
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                              const cell = hotspotData.find(h => h.day === day && h.meal === meal);
                              const intensity = cell?.intensity || 0;
                              
                              // COLOR LOGIC: Emerald (Good) -> Red (Waste)
                              // 0-30: Emerald, 30-60: Yellow, 60+: Red
                              let bgColor = "bg-emerald-500";
                              if (intensity > 65) bgColor = "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]";
                              else if (intensity > 40) bgColor = "bg-amber-400";
                              
                              return (
                                <Popover key={`${day}-${meal}`}>
                                  <PopoverTrigger asChild>
                                    <div 
                                      className={`aspect-square border-2 border-foreground/20 cursor-pointer hover:border-foreground hover:scale-105 transition-all relative ${bgColor}`}
                                    >
                                      {cell?.marker && <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full ring-2 ring-foreground"></div>}
                                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black opacity-20 group-hover:opacity-100">{Math.round(intensity)}</span>
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent className="brutal-shadow-sm border-4 border-foreground p-3 bg-background w-48">
                                    <p className="font-black uppercase text-[10px] mb-1">{day} {meal}</p>
                                    <p className="text-[18px] font-black font-google-sans tracking-tight italic italic italic italic italic italic">{intensity}% Waste Density</p>
                                    {cell?.marker && (
                                      <div className="mt-3 p-2 bg-foreground text-background text-[9px] font-bold uppercase italic">
                                        {cell.marker.label}
                                      </div>
                                    )}
                                  </PopoverContent>
                                </Popover>
                              )
                            })}
                          </>
                        ))}
                      </div>
                      
                      <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-foreground text-background p-6 border-4 border-foreground ring-4 ring-foreground ring-offset-4">
                        <div className="flex gap-4">
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase text-neon-yellow">Kolkata Context Overlay</span>
                              <p className="text-xs font-bold italic italic italic italic italic italic">MAKAUT Exam Period Logic: Enabled</p>
                           </div>
                        </div>
                        <Button 
                          onClick={() => setViewMode("daily")}
                          className="bg-neon-pink text-white font-black uppercase italic italic italic italic tracking-widest text-[10px] h-12 px-8 brutal-shadow hover:translate-y-[-4px] transition-all"
                        >
                           Apply New portions <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </div>
                   </div>
                </TabsContent>
             </Tabs>
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-card border-4 border-foreground p-8 brutal-shadow relative overflow-hidden mt-[64px]">
              <div className="absolute top-0 right-0 p-4">
                <div className="h-3 w-3 bg-neon-green rounded-full shadow-[0_0_10px_#39FF14]"></div>
              </div>
              <h3 className="font-heading text-xl font-bold italic uppercase tracking-tighter mb-6">Operational Intelligence</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neon-yellow/10 border-2 border-neon-yellow flex items-center justify-center brutal-shadow-sm rotate-[3deg]">
                    <Bell size={24} className="text-neon-yellow" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest italic italic italic italic">Kolkata Context Alert</h4>
                    <p className="text-xs font-bold leading-tight mt-1">{todayContext}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neon-blue/10 border-2 border-neon-blue flex items-center justify-center brutal-shadow-sm rotate-[-4deg]">
                    <Sparkles size={24} className="text-neon-blue" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest italic italic italic italic">ML Drivers Active</h4>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-8 px-3 text-[10px] mt-2 border-2 border-foreground font-black italic italic italic italic italic uppercase bg-neon-blue text-white hover:bg-neon-blue/90 brutal-shadow-sm">
                           View Full Features
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="brutal-shadow border-4 border-foreground bg-card sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="font-heading text-xl uppercase font-black italic italic italic italic italic italic tracking-tight">XGBoost Feature Vector (v3.2)</DialogTitle>
                        </DialogHeader>
                        <div className="py-6 flex flex-col gap-4">
                            <div className="p-4 bg-background border-2 border-foreground">
                               <p className="text-[9px] font-black uppercase opacity-50 mb-3 italic italic italic italic italic">Dynamic Parameters</p>
                               <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                     <span className="text-xs font-bold uppercase italic italic italic italic italic">HUMIDITY_INDEX</span>
                                     <span className="font-black font-google-sans text-neon-pink">0.88</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                     <span className="text-xs font-bold uppercase italic italic italic italic italic">HOLIDAY_BIAS</span>
                                     <span className="font-black font-google-sans">0.00</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                     <span className="text-xs font-bold uppercase italic italic italic italic italic">SENTIMENT_DECAY</span>
                                     <span className="font-black font-google-sans text-neon-blue">1.02</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                     <span className="text-xs font-bold uppercase italic italic italic italic italic">STRESS_FACTOR_WB</span>
                                     <span className="font-black font-google-sans text-neon-green">1.14</span>
                                  </div>
                               </div>
                            </div>
                            <div className="bg-neon-yellow/10 p-4 border-2 border-neon-yellow text-xs font-bold leading-relaxed italic italic italic italic italic italic italic capitalize">
                               Model weighted heavily on current 92% humidity in Kolkata grid. Expecting 14% drop in high-carb meal demand.
                            </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t-2 border-foreground/10">
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-40">System Efficiency Proof</h4>
                <div className="bg-background border-4 border-foreground p-6 brutal-shadow-dark rotate-[1deg] group overflow-hidden">
                   <div className="absolute right-2 top-2">
                       <TrendingUp size={16} className="text-neon-green group-hover:scale-125 transition-all" />
                   </div>
                   <p className="text-[9px] font-black opacity-50 uppercase italic italic italic italic italic italic italic italic">Verified EVPI Score</p>
                   <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl font-black font-google-sans tracking-tight italic italic italic italic italic italic">₹{savingsData?.daily?.saved_inr || 450}</span>
                      <span className="text-[10px] font-bold uppercase opacity-40 italic italic italic italic italic">Per Service</span>
                   </div>
                   <div className="mt-4 pt-4 border-t-2 border-foreground/5 space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-black italic italic italic italic">
                        <Check size={14} className="text-neon-green" />
                        <span>MOCK WASTE REDUCED: 22 KG</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black italic italic italic italic">
                        <Check size={14} className="text-neon-green" />
                        <span>ROI BOOST: +18.4%</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-card border-4 border-foreground p-8 brutal-shadow relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <History size={20} className="text-neon-blue" />
                    <h3 className="font-heading text-xl font-bold italic uppercase tracking-tighter italic italic italic italic italic">Menu Digitization</h3>
                </div>
                
                <div className="relative border-4 border-dashed border-foreground p-6 text-center hover:bg-muted/50 cursor-pointer transition-all mb-6">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} />
                    {!imagePreview ? (
                        <div className="flex flex-col items-center">
                            <Upload size={32} className="mb-2 text-neon-pink" />
                            <span className="text-xs font-black uppercase tracking-widest italic italic italic italic">Upload Physical Menu</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <FileImage size={32} className="mb-2 text-neon-blue" />
                            <img src={imagePreview} className="max-h-20 border-2 border-foreground brutal-shadow-xs" />
                        </div>
                    )}
                </div>

                <Button 
                    onClick={handleExtractMenu} 
                    disabled={isExtracting || !imagePreview}
                    className="w-full h-12 bg-foreground text-background font-black uppercase italic italic italic italic tracking-widest text-[10px] brutal-shadow hover:bg-neon-pink hover:text-white transition-all"
                >
                    {isExtracting ? <><Sparkles className="mr-2 animate-spin" size={16} /> Digitizing...</> : "Scan Menu via Gemini AI"}
                </Button>

                {extractedItems.length > 0 && (
                    <div className="mt-6 pt-6 border-t-2 border-foreground/10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-neon-blue italic">Digitized Items</h4>
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                            {extractedItems.map((item, i) => (
                                <div key={i} className="p-3 bg-background border-2 border-foreground flex items-center justify-between group">
                                    <span className="text-[10px] font-bold uppercase italic italic italic">{item}</span>
                                    <Check size={14} className="text-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardPage;
