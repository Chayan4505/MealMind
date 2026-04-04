import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Utensils, CheckCircle, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/procurement")({
  component: ProcurementPage,
});

function ProcurementPage() {
  const scrollRef = useScrollAnimation();
  const { user } = useAuth();
  
  return (
    <div ref={scrollRef} className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <section className="flex-1 pt-32 pb-20 px-6 dot-grid">
        <div className="max-w-5xl mx-auto">
          <div className="animate-on-scroll mb-12">
             <div className="inline-block brutal-shadow px-4 py-1 mb-6 bg-neon-blue text-primary-foreground">
              <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Bell size={14} /> 06:15 AM • PROCUREMENT ACTION
              </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[0.95]">
              Auto-Generated<br /><span className="text-neon-blue">Buy & Cook List</span>
            </h1>
            <p className="mt-6 text-muted-foreground max-w-xl text-lg">
              Optimized procurement tasks adapted perfectly to today's 450 meal forecast.
            </p>
          </div>

          <div className="brutal-shadow p-8 bg-card border-l-8 border-l-neon-blue">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-bold border-collapse">
                <thead>
                  <tr className="border-b-4 border-foreground">
                    <th className="pb-4 px-2 text-muted-foreground uppercase text-sm tracking-widest">Ingredient</th>
                    <th className="pb-4 px-2 text-muted-foreground uppercase text-sm tracking-widest">Buy Qty</th>
                    <th className="pb-4 px-2 text-muted-foreground uppercase text-sm tracking-widest">Cook Qty</th>
                    <th className="pb-4 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-6 px-2 text-lg">Chicken (Raw)</td>
                    <td className="py-6 px-2 text-neon-pink text-xl">45 kg</td>
                    <td className="py-6 px-2 text-xl">~38 kg</td>
                    <td className="py-6 px-2 text-right"><Button variant="outline"><CheckCircle size={16} className="mr-2 text-neon-green" /> Procured</Button></td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-6 px-2 text-lg">Basmati Rice</td>
                    <td className="py-6 px-2 text-neon-blue text-xl">From Inventory</td>
                    <td className="py-6 px-2 text-xl">90 kg</td>
                    <td className="py-6 px-2 text-right"><Button variant="neonPink"><Utensils size={16} className="mr-2" /> Prep Now</Button></td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="py-6 px-2 text-lg">Vegetables (Mixed)</td>
                    <td className="py-6 px-2 text-neon-pink text-xl">20 kg</td>
                    <td className="py-6 px-2 text-xl">20 kg</td>
                    <td className="py-6 px-2 text-right"><Button variant="outline"><CheckCircle size={16} className="mr-2 text-neon-green" /> Procured</Button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
