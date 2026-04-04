import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Edit3, Plus, Trash2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/edit-menu")({
  component: EditMenuPage,
});

function EditMenuPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <section className="flex-1 pt-32 pb-20 px-6 dot-grid">
        <div className="max-w-4xl mx-auto">
          <div className="brutal-shadow bg-card p-8 border-l-8 border-l-neon-pink animate-on-scroll visible">
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-neon-pink p-3 brutal-shadow-light">
                   <Edit3 size={32} className="text-primary-foreground" />
                </div>
                <h1 className="font-heading text-4xl font-bold">Edit Catalog</h1>
             </div>
             <p className="text-muted-foreground mb-8 text-lg">
                Modify your current active catalog, or add manual entries without requiring Gemini extractions.
             </p>
             
             <div className="space-y-4 mb-8">
                {["Hyderabadi Chicken Dum Biryani", "Paneer Butter Masala", "Crispy Masala Dosa"].map((item, i) => (
                  <div key={i} className="flex gap-3">
                     <Input defaultValue={item} className="brutal-shadow-light border-2 border-foreground bg-background h-14 text-lg font-bold flex-1" />
                     <Button variant="outline" className="h-14 w-14 shrink-0 border-2 border-foreground hover:bg-neon-blue hover:text-primary-foreground brutal-shadow-light transition-colors">
                        <Trash2 size={22} className="shrink-0" />
                     </Button>
                  </div>
                ))}
             </div>

             <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t-2 border-border">
                 <Button variant="outline" className="h-14 text-md border-2 border-dashed border-foreground flex-1 hover:bg-muted/50">
                    <Plus className="mr-2" size={20} /> Add Item Manually
                 </Button>
                 <Button variant="neonPink" className="h-14 text-md justify-center flex-1 sm:flex-none sm:w-48">
                    <Save className="mr-2" size={20} /> Save Changes
                 </Button>
             </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
