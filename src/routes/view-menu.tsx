import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClipboardList, ChefHat } from "lucide-react";

export const Route = createFileRoute("/view-menu")({
  component: ViewMenuPage,
});

function ViewMenuPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <section className="flex-1 pt-32 pb-20 px-6 dot-grid">
        <div className="max-w-4xl mx-auto">
          <div className="brutal-shadow bg-card p-8 border-l-8 border-l-neon-green animate-on-scroll visible">
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-neon-green p-3 brutal-shadow-light">
                   <ClipboardList size={32} className="text-primary-foreground" />
                </div>
                <h1 className="font-heading text-4xl font-bold">Active Menu Tracking</h1>
             </div>
             <p className="text-muted-foreground mb-8 text-lg">
                These are the items actively being tracked and optimized daily by your Gemini AI forecasting engine.
             </p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mock data, normally fetched from user_metadata.menu */}
                {["Hyderabadi Chicken Dum Biryani", "Mutton Rogan Josh", "Paneer Butter Masala", "Garlic Butter Naan", "Tandoori Roti", "Crispy Masala Dosa", "Gulab Jamun"].map((item, i) => (
                  <div key={i} className="p-4 border-2 border-foreground bg-background brutal-shadow flex items-center gap-4 font-bold text-lg hover:-translate-y-1 transition-transform">
                    <ChefHat size={20} className="text-neon-pink shrink-0" /> {item}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
