import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Utensils, AlertTriangle, ChefHat, Droplets, ArrowDown, ArrowUp, CheckCircle, RefreshCcw, Bell, Upload, FileImage, Sparkles, Check, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const scrollRef = useScrollAnimation();
  const { user } = useAuth();
  const [wasteLevel, setWasteLevel] = useState<"Low" | "Expected" | "High" | null>(null);
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedItems, setExtractedItems] = useState<string[]>([]);

  const [procurementItems, setProcurementItems] = useState<{ingredient: string, buyQty: string, cookQty: string}[]>([
    { ingredient: "Chicken (Raw)", buyQty: "45 kg", cookQty: "~38 kg" },
    { ingredient: "Basmati Rice", buyQty: "From Inventory", cookQty: "90 kg" },
    { ingredient: "Vegetables (Mixed)", buyQty: "20 kg", cookQty: "20 kg" }
  ]);
  const [isProcurementGenerating, setIsProcurementGenerating] = useState(false);

  const generateProcurementForMenu = async (menuList: string[]) => {
    setIsProcurementGenerating(true);
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
       setIsProcurementGenerating(false);
       return;
    }
    
    try {
       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             contents: [{ parts: [{ text: `We are predicting demand for 450 meals today based heavily on this specific menu: ${menuList.join(", ")}. Give me a raw materials list of precisely 4 major food ingredients required to cook these menu items. Return ONLY a valid JSON array of objects taking this exact string schema shape: [{"ingredient": "string", "buyQty": "string", "cookQty": "string"}]. Do NOT wrap in markdown tags or add any text outside the JSON array.` }] }]
          })
       });
       const data = await response.json();
       if (data.candidates && data.candidates[0]) {
           let text = data.candidates[0].content.parts[0].text;
           text = text.replace(/```json/g, "").replace(/```/g, "").trim();
           setProcurementItems(JSON.parse(text));
       }
    } catch(err) {
       console.error("Procurement Gen Error:", err);
    }
    setIsProcurementGenerating(false);
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
        setExtractedItems(["Paneer Butter Masala", "Garlic Naan", "Tandoori Roti", "Chicken Biryani"]);
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

      if (data.error) {
        console.error("API Error Object:", data);
        setExtractedItems([`API Failed: ${data.error.message}`]);
        setIsExtracting(false);
        return;
      }

      if (!data.candidates || !data.candidates[0]) {
        setExtractedItems(["Error: Unrecognized image or blocked by safety filters."]);
        setIsExtracting(false);
        return;
      }

      const text = data.candidates[0].content.parts[0].text;
      const itemsArray = text.split('\n').filter((item: string) => item.trim() !== '');
      setExtractedItems(itemsArray);
      
      generateProcurementForMenu(itemsArray);
    } catch (error: any) {
      console.error("Gemini Extraction Error:", error);
      setExtractedItems([`App Error: ${error.message || "Failed to contact Google API."}`]);
    }
    setIsExtracting(false);
  };

  // Baseline Dinner Forecast Strategy
  const dinnerBaseline = 320;

  const handleLogWaste = (level: "Low" | "Expected" | "High") => {
    setIsRecalibrating(true);
    setWasteLevel(null);
    setTimeout(() => {
      setWasteLevel(level);
      setIsRecalibrating(false);
    }, 1200);
  };

  const getDinnerForecast = () => {
    if (wasteLevel === "High") return dinnerBaseline - 45; // Overcooked lunch, lower dinner
    if (wasteLevel === "Low") return dinnerBaseline + 50;  // Undercooked lunch, raise dinner
    return dinnerBaseline;
  };

  return (
    <div ref={scrollRef} className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-6 dot-grid">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll mb-12">
            <div className="inline-block brutal-shadow px-4 py-1 mb-6 bg-neon-yellow text-foreground">
              <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Bell size={14} /> LIVE: DAILY CYCLE
              </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[0.95]">
              Manager's<br /><span className="text-gradient-pink-blue">Command Center</span>
            </h1>
            <p className="mt-6 text-muted-foreground max-w-xl text-lg">
              Welcome back, <span className="font-bold text-foreground">{user?.user_metadata?.restaurant_name || "Kitchen Manager"}</span>. Here is your intelligent operational flow for today.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* 6:00 AM - Morning Briefing */}
            <div className="lg:col-span-8 space-y-8 animate-on-scroll" style={{ transitionDelay: "100ms" }}>

              {/* AI Menu Integration Panel */}
              <div className="brutal-shadow p-8 bg-card border-l-8 border-l-neon-green">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-neon-green p-2 brutal-shadow-light">
                    <ImageIcon className="text-primary-foreground" size={24} />
                  </div>
                  <h2 className="font-heading text-3xl font-bold">Menu Intelligence Scanner</h2>
                </div>
                <p className="text-muted-foreground mb-6">Upload a physical menu to let Gemini instantly digitize and inject it directly into the demand forecasting engine.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-4 border-dashed border-foreground p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative brutal-shadow-light overflow-hidden bg-background">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {!imagePreview ? (
                        <div className="flex flex-col items-center">
                          <Upload size={28} className="mb-2 text-neon-green" />
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Menu Image</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <FileImage size={28} className="mb-2 text-neon-blue" />
                          <span className="text-xs font-bold uppercase tracking-widest text-neon-blue">Image Loaded</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="neonGreen"
                      onClick={handleExtractMenu}
                      className="w-full text-md h-12"
                      disabled={isExtracting || !imagePreview}
                    >
                      {isExtracting ? (
                        <span className="flex items-center"><Sparkles size={16} className="mr-2 animate-pulse" /> Scanning Image...</span>
                      ) : (
                        <span className="flex items-center"><Sparkles size={16} className="mr-2" /> Add Menu using AI</span>
                      )}
                    </Button>
                  </div>

                  <div className="bg-background border-2 border-foreground brutal-shadow-light p-4 h-48 overflow-y-auto">
                    {extractedItems.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">
                        Awaiting extraction...
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {extractedItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm font-bold border-b border-border pb-2 last:border-0 last:pb-0">
                            <Check size={16} className="text-neon-green shrink-0 mt-0.5" /> <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="brutal-shadow p-8 bg-card border-l-8 border-l-neon-pink">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-neon-pink mb-1">06:00 AM • Morning Briefing</div>
                    <h2 className="font-heading text-3xl font-bold">Lunch Forecasting</h2>
                  </div>
                  <div className="bg-neon-blue px-3 py-2 brutal-shadow-light flex items-center gap-2 text-primary-foreground text-sm font-bold shrink-0">
                    <Droplets size={16} /> Kolkata Context: Heavy Rain Alert
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-background brutal-shadow border-2 border-foreground">
                    <div className="text-xs uppercase font-bold text-muted-foreground mb-2">Algorithm Prediction</div>
                    <div className="text-5xl font-heading font-bold">450 <span className="text-xl text-muted-foreground">meals</span></div>
                    <div className="text-sm font-bold text-neon-green mt-2 flex items-center gap-1">
                      <ArrowDown size={14} /> 15% volume drop due to rain
                    </div>
                  </div>
                  <div className="p-6 bg-neon-green brutal-shadow text-primary-foreground flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <ChefHat size={24} />
                      <span className="font-bold uppercase tracking-widest text-xs">AI Confidence</span>
                    </div>
                    <div className="text-5xl font-heading font-bold">94%</div>
                  </div>
                </div>
              </div>

              {/* 6:15 AM - Procurement Action */}
              <div className="brutal-shadow p-8 bg-card border-l-8 border-l-neon-blue transition-all">
                <div className="text-xs font-bold uppercase tracking-widest text-neon-blue mb-1">06:15 AM • Procurement Action</div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h2 className="font-heading text-3xl font-bold flex items-center gap-3">
                    Auto "Buy & Cook" List
                    {isProcurementGenerating && <RefreshCcw size={20} className="animate-spin text-neon-blue" />}
                  </h2>
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex"><Utensils size={14} className="mr-2" /> Send to Kitchen</Button>
                </div>

                <div className="overflow-x-auto relative">
                  {isProcurementGenerating && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="font-bold text-neon-blue uppercase tracking-widest text-sm flex items-center">
                         <Sparkles size={16} className="mr-2 animate-pulse" /> AI Designing Kitchen List...
                      </div>
                    </div>
                  )}
                  <table className="w-full text-left font-bold border-collapse">
                    <thead>
                      <tr className="border-b-2 border-foreground">
                        <th className="pb-3 px-2 text-muted-foreground uppercase text-xs tracking-widest">Ingredient</th>
                        <th className="pb-3 px-2 text-muted-foreground uppercase text-xs tracking-widest">Buy Qty</th>
                        <th className="pb-3 px-2 text-muted-foreground uppercase text-xs tracking-widest">Cook Qty</th>
                        <th className="pb-3 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {procurementItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-border last:border-0">
                          <td className="py-4 px-2">{item.ingredient}</td>
                          <td className="py-4 px-2 text-neon-pink">{item.buyQty}</td>
                          <td className="py-4 px-2 text-neon-blue">{item.cookQty}</td>
                          <td className="py-4 px-2 text-right">
                             <Button variant={idx % 2 === 0 ? "outline" : "neonPink"} size="sm">Procured</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Sidebar Feedbacks */}
            <div className="lg:col-span-4 space-y-8 animate-on-scroll" style={{ transitionDelay: "200ms" }}>

              {/* 2:30 PM - The Feedback Loop (Crucial Step) */}
              <div id="log-waste" className="brutal-shadow p-8 bg-card border-none ring-4 ring-neon-pink shadow-[0_0_25px_oklch(0.65_0.28_350_/_0.2)] scroll-mt-24">
                <div className="text-xs font-bold uppercase tracking-widest text-neon-pink mb-1">02:30 PM • The Feedback Loop</div>
                <h2 className="font-heading text-2xl font-bold mb-2">Log Lunch Waste</h2>
                <p className="text-sm text-muted-foreground mb-6">Service ends. Inform the AI how much food was left over to actively control your upcoming costs.</p>

                <div className="space-y-3">
                  <Button
                    variant={"outline"}
                    className={`w-full h-14 justify-start text-lg transition-colors border-2 ${wasteLevel === "Low" ? 'bg-foreground text-background border-foreground' : 'hover:bg-neon-pink/10 hover:border-neon-pink'}`}
                    onClick={() => handleLogWaste("Low")}
                    disabled={isRecalibrating}
                  >
                    <ArrowDown className={`mr-3 ${wasteLevel === "Low" ? 'text-neon-pink' : 'text-neon-pink'}`} /> 1. Low Waste (Ran Out)
                  </Button>
                  <Button
                    variant={"outline"}
                    className={`w-full h-14 justify-start text-lg transition-colors border-2 ${wasteLevel === "Expected" ? 'bg-foreground text-background border-foreground' : 'hover:bg-neon-green/10 hover:border-neon-green'}`}
                    onClick={() => handleLogWaste("Expected")}
                    disabled={isRecalibrating}
                  >
                    <CheckCircle className={`mr-3 ${wasteLevel === "Expected" ? 'text-neon-green' : 'text-neon-green'}`} /> 2. Expected (Perfect)
                  </Button>
                  <Button
                    variant={"outline"}
                    className={`w-full h-14 justify-start text-lg transition-colors border-2 ${wasteLevel === "High" ? 'bg-foreground text-background border-foreground' : 'hover:bg-neon-blue/10 hover:border-neon-blue'}`}
                    onClick={() => handleLogWaste("High")}
                    disabled={isRecalibrating}
                  >
                    <ArrowUp className={`mr-3 ${wasteLevel === "High" ? 'text-neon-blue' : 'text-neon-blue'}`} /> 3. High Waste (Too Much)
                  </Button>
                </div>
              </div>

              {/* 2:31 PM - Auto Recalibration */}
              <div className="brutal-shadow p-8 bg-background relative overflow-hidden h-[300px] flex flex-col">
                {isRecalibrating && (
                  <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                    <RefreshCcw className="animate-spin text-neon-pink mb-4" size={36} />
                    <div className="font-bold uppercase tracking-widest text-sm text-foreground">Recalibrating AI Engine...</div>
                  </div>
                )}

                <div className="text-xs font-bold uppercase tracking-widest text-foreground mb-1">02:31 PM • Auto-Recalibration</div>
                <h2 className="font-heading text-xl font-bold mb-4">Upcoming: Dinner Service</h2>

                <div className="p-5 bg-card brutal-shadow mb-4 text-center border-l-4 border-l-foreground">
                  <div className="text-xs uppercase text-muted-foreground font-bold mb-1">Dinner Forecast</div>
                  <div className={`text-5xl font-heading font-bold transition-colors ${wasteLevel === "High" ? "text-neon-blue" : wasteLevel === "Low" ? "text-neon-pink" : wasteLevel === "Expected" ? "text-neon-green" : ""}`}>
                    {getDinnerForecast()}
                  </div>
                  <div className="text-sm mt-2 text-muted-foreground font-bold">meals expected</div>
                </div>

                <div className="flex-1 flex flex-col justify-end">
                  {!wasteLevel ? (
                    <div className="text-sm text-muted-foreground text-center animate-pulse py-2">Waiting for Lunch Waste Feedback...</div>
                  ) : (
                    <div className="p-4 bg-neon-yellow text-foreground text-sm font-bold brutal-shadow flex items-start gap-3 mt-auto">
                      <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                      <div className="leading-tight">
                        {wasteLevel === "High" && "Overcooked lunch detected! Decreased dinner forecast by 45 meals to protect margins."}
                        {wasteLevel === "Expected" && "Lunch forecasting was >95% efficient. Proceeding with standard baseline for dinner."}
                        {wasteLevel === "Low" && "Lunch sold out rapidly! Increased dinner forecast by 50 meals to service extra demand."}
                      </div>
                    </div>
                  )}
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
