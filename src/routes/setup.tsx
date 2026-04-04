import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Store, Upload, FileImage, Sparkles, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/setup")({
  component: SetupPage,
});

function SetupPage() {
  const { user, updateRestaurantName, updateProfileData, isLoading } = useAuth();
  const [restaurantName, setRestaurantName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedItems, setExtractedItems] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login" });
    }
    // Automatically redirect users who have already set their restaurant 
    // IF they haven't explicitly started an upload process in this session.
    if (user && user.user_metadata?.restaurant_name && !isExtracting && step === 1) {
      if (!imageFile) {
        navigate({ to: "/dashboard" });
      }
    }
  }, [user, isLoading, navigate, isExtracting, step, imageFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const extractMenuWithGemini = async (base64Image: string) => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    // If the API Key isn't provided yet, mock the Gemini extraction for demo purposes
    if (!GEMINI_API_KEY) {
      return new Promise<string[]>((resolve) => {
        setTimeout(() => {
          resolve([
            "Hyderabadi Chicken Dum Biryani",
            "Mutton Rogan Josh",
            "Paneer Butter Masala",
            "Garlic Butter Naan",
            "Tandoori Roti",
            "Crispy Masala Dosa",
            "Gulab Jamun (2 pcs)"
          ]);
        }, 2000);
      });
    }

    // Actual active Gemini API Request
    try {
      // Strip the internal data string prefix
      const base64Data = base64Image.split(',')[1];
      const mimeType = imageFile?.type || "image/jpeg";

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Extract all the menu items from this image and list them clearly as plain text. Do not use markdown (no asterisks). Return just one item per line." },
              { inline_data: { mime_type: mimeType, data: base64Data } }
            ]
          }]
        })
      });

      const data = await response.json();

      if (data.error) {
        console.error("Setup API Error:", data.error);
        return [`API Failed: ${data.error.message}`];
      }

      if (!data.candidates || !data.candidates[0]) {
        return ["Error: Unrecognized image or blocked by safety."];
      }

      const text = data.candidates[0].content.parts[0].text;
      return text.split('\n').filter((item: string) => item.trim() !== '');
    } catch (error: any) {
      console.error("Gemini Extraction Error:", error);
      return [`App Error: ${error.message || "Failed to contact Google API."}`];
    }
  };

  const handleProcessMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName.trim() || !imagePreview) return;

    setIsExtracting(true);
    // Convert to Base64 to pass to Gemini API Vision Model
    const items = await extractMenuWithGemini(imagePreview);
    setExtractedItems(items);
    setIsExtracting(false);
    setStep(2);
  };

  const generateProcurementForMenu = async (menuList: string[]) => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
       return [
          { ingredient: "Chicken (Raw)", buyQty: "45 kg", cookQty: "~38 kg" },
          { ingredient: "Basmati Rice", buyQty: "From Inventory", cookQty: "90 kg" },
          { ingredient: "Vegetables (Mixed)", buyQty: "20 kg", cookQty: "20 kg" }
        ];
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
           return JSON.parse(text);
       }
    } catch(err) {
       console.error("Procurement Gen Error:", err);
    }
    return [];
  };

  const handleFinalize = async () => {
    setIsExtracting(true);
    const rawMaterials = await generateProcurementForMenu(extractedItems);
    await updateProfileData({
      restaurant_name: restaurantName,
      menu_items: extractedItems,
      raw_materials: rawMaterials
    });
    setIsExtracting(false);
    navigate({ to: "/dashboard" });
  };

  if (isLoading || !user) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-neon-pink font-bold uppercase tracking-widest text-sm">Authenticating...</div>;
  }

  return (
    <div className="min-h-screen dot-grid flex flex-col pt-16">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6 mt-10">

        {step === 1 && (
          <div className="w-full max-w-lg brutal-shadow bg-card p-8 animate-on-scroll visible">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-16 h-16 bg-neon-yellow flex items-center justify-center mb-4 brutal-shadow-light text-primary-foreground">
                <Store size={32} />
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold font-google-sans">Register Kitchen</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Name your restaurant and upload a photo of your existing menu to automatically digitize it with <b>Gemini AI</b>.
              </p>
            </div>

            <form onSubmit={handleProcessMenu} className="space-y-6">
              <div className="space-y-2 text-left">
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input
                  id="restaurantName"
                  placeholder="e.g. Spice Kitchen Co."
                  required
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="brutal-shadow"
                />
              </div>

              <div className="space-y-2 text-left">
                <Label>Upload Physical Menu (JPG/PNG)</Label>
                <div className="border-4 border-dashed border-foreground p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative brutal-shadow-light overflow-hidden bg-background">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                  {!imagePreview ? (
                    <div className="flex flex-col items-center">
                      <Upload size={32} className="mb-2 text-neon-pink" />
                      <span className="text-sm font-bold uppercase tracking-widest">Select Image</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileImage size={32} className="mb-2 text-neon-blue" />
                      <span className="text-sm font-bold uppercase tracking-widest text-neon-blue">Menu Attached</span>
                      <img src={imagePreview} alt="Menu Preview" className="mt-4 max-h-32 border-2 border-foreground object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="neonPink"
                className="w-full h-14 text-md mt-4 relative overflow-hidden"
                disabled={isExtracting || !restaurantName || !imagePreview}
              >
                {isExtracting ? (
                  <span className="flex items-center"><Sparkles className="mr-2 animate-pulse" size={18} /> Extracting via Gemini AI...</span>
                ) : (
                  <span className="flex items-center">Scan Menu Items <ArrowRight className="ml-2 arrow-move" /></span>
                )}
              </Button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-lg brutal-shadow bg-card p-8 animate-on-scroll visible">
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-16 h-16 bg-neon-green flex items-center justify-center mb-4 brutal-shadow-light text-primary-foreground">
                <Sparkles size={32} />
              </div>
              <h1 className="font-heading text-3xl font-bold font-google-sans">Extraction Complete</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Gemini AI has successfully captured and digitized your menu!
              </p>
            </div>

            <div className="bg-background border-2 border-foreground p-5 h-64 overflow-y-auto mb-6 brutal-shadow-light">
              <ul className="space-y-3">
                {extractedItems.map((item, id) => (
                  <li key={id} className="flex items-start gap-3 text-sm font-bold border-b border-border pb-2 last:border-0 last:pb-0">
                    <Check className="shrink-0 text-neon-green" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              type="button"
              onClick={handleFinalize}
              variant="neonPink"
              className="w-full h-14 text-md"
              disabled={isExtracting}
            >
              Confirm & Go To Dashboard <ArrowRight className="ml-2" />
            </Button>

            <button
              className="w-full text-center mt-6 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
              onClick={() => setStep(1)}
            >
              Re-Upload Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
