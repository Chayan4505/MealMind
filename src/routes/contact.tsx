import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const scrollRef = useScrollAnimation();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div ref={scrollRef} className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6 dot-grid min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="animate-on-scroll">
              <div className="inline-block brutal-shadow px-4 py-1 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest">Get In Touch</span>
              </div>
              <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[0.95] mb-8">
                Join the<br />
                <span className="text-gradient-pink-blue">Zero Waste</span><br />
                Revolution.
              </h1>
              <p className="text-muted-foreground text-lg mb-12 max-w-lg leading-relaxed">
                Whether you run an institutional kitchen, a food business, or an NGO — we'd love to hear from you.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 gradient-pink-blue flex items-center justify-center">
                    <Mail size={20} className="text-background" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</div>
                    <div className="font-bold">hello@ecofeast.ai</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 gradient-blue-green flex items-center justify-center">
                    <MapPin size={20} className="text-background" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</div>
                    <div className="font-bold">Kolkata, West Bengal, India</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 gradient-green-blue flex items-center justify-center">
                    <Phone size={20} className="text-background" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</div>
                    <div className="font-bold">+91 33 XXXX XXXX</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-slide-right">
              {submitted ? (
                <div className="border-2 border-neon-green p-12 text-center">
                  <div className="font-heading text-3xl font-bold mb-4 text-gradient-blue-green">Thank You!</div>
                  <p className="text-muted-foreground">We'll be in touch shortly.</p>
                </div>
              ) : (
                <form
                  className="border-2 border-foreground p-10 space-y-6"
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                >
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-2">Name</label>
                    <input
                      type="text"
                      required
                      className="w-full border-2 border-foreground bg-background px-4 py-3 text-sm font-medium focus:outline-none focus:border-neon-pink transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-2">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full border-2 border-foreground bg-background px-4 py-3 text-sm font-medium focus:outline-none focus:border-neon-pink transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-2">Organization</label>
                    <input
                      type="text"
                      className="w-full border-2 border-foreground bg-background px-4 py-3 text-sm font-medium focus:outline-none focus:border-neon-pink transition-colors"
                      placeholder="Your organization"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-2">Message</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full border-2 border-foreground bg-background px-4 py-3 text-sm font-medium focus:outline-none focus:border-neon-pink transition-colors resize-none"
                      placeholder="Tell us about your kitchen operations..."
                    />
                  </div>
                  <Button variant="neonPink" size="lg" type="submit" className="w-full">
                    Send Message <ArrowRight className="arrow-move" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
