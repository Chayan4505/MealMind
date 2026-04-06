import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t-3 border-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <Link to="/" className="inline-block mb-4">
            <img src="/icon.png" alt="EcoFeast Engine" className="h-12 w-auto object-contain" />
          </Link>
          <p className="text-sm opacity-70 leading-relaxed">
            AI-powered demand forecasting & waste optimization for urban kitchens. Born in Kolkata.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-neon-blue">Platform</h4>
          <div className="flex flex-col gap-2">
            <Link to="/how-it-works" className="text-sm opacity-70 hover:opacity-100 transition-opacity">How It Works</Link>
            <Link to="/dashboard" className="text-sm opacity-70 hover:opacity-100 transition-opacity">Dashboard</Link>
            <Link to="/ai-intelligence" className="text-sm opacity-70 hover:opacity-100 transition-opacity">AI Intelligence</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-neon-green">Impact</h4>
          <div className="flex flex-col gap-2">
            <Link to="/impact" className="text-sm opacity-70 hover:opacity-100 transition-opacity">Our Impact</Link>
            <Link to="/contact" className="text-sm opacity-70 hover:opacity-100 transition-opacity">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-neon-yellow">Connect</h4>
          <p className="text-sm opacity-70">hello@ecofeast.ai</p>
          <p className="text-sm opacity-70 mt-1">Kolkata, India</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center">
        <p className="text-xs opacity-50">© 2026 EcoFeast Engine. All rights reserved.</p>
      </div>
    </footer>
  );
}
