import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LogOut, ChevronDown, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";

interface NavLink {
  to: string;
  label: string;
  hash?: string;
}

const publicLinks: NavLink[] = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/ai-intelligence", label: "AI Intelligence" },
  { to: "/impact", label: "Impact" },
];

const authLinks: NavLink[] = [
  { to: "/dashboard", label: "Overview" },
  { to: "/menu", label: "Menu" },
  { to: "/simulation", label: "Simulation" },
  { to: "/procurement", label: "Procure" },
  { to: "/feedback", label: "Log Waste" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const displayedLinks = user ? authLinks : publicLinks;

  return (
    <nav className="absolute top-4 left-4 right-4 md:left-8 md:right-8 z-50 bg-background/90 backdrop-blur-sm border-3 border-foreground shadow-[4px_4px_0_0_oklch(0.13_0.03_265)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-heading text-xl font-bold tracking-tight">
          <span className="text-gradient-pink-blue">EcoFeast</span>
          <span className="text-foreground"> Engine</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {displayedLinks.map((link) => (
            <Link
              key={link.to + (link.hash || "")}
              to={link.to}
              hash={link.hash}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                location.pathname === link.to && !link.hash
                  ? "text-neon-pink"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!user ? (
            <Link to="/login" className="ml-4">
              <Button variant="neonPink" size="sm" className="font-bold uppercase tracking-widest text-xs h-9">
                Sign In
              </Button>
            </Link>
          ) : (
            <div className="flex items-center space-x-2 ml-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="font-bold uppercase tracking-widest text-xs h-9">
                    <Store size={14} className="mr-2" />
                    {user.user_metadata?.restaurant_name || "Manager"}
                    <ChevronDown size={14} className="ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 border-2 border-foreground brutal-shadow-light bg-background" align="end">
                  <DropdownMenuLabel className="font-heading">
                     {user.email} <br/>
                     <span className="text-xs uppercase tracking-widest text-muted-foreground">Kitchen Manager</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer font-bold">
                       <Link to="/setup">Add / Upload Menu</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer font-bold">
                       <Link to="/edit-menu">Edit Menu</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer font-bold">
                       <Link to="/menu">View Uploaded Menu</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={signOut} className="text-destructive font-bold uppercase tracking-widest text-xs cursor-pointer focus:bg-destructive/10">
                     <LogOut size={14} className="mr-2" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-b border-border px-6 py-4 flex flex-col gap-2">
          {displayedLinks.map((link) => (
            <Link
              key={link.to + (link.hash || "")}
              to={link.to}
              hash={link.hash}
              className="py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!user ? (
            <Link to="/login" onClick={() => setOpen(false)} className="mt-2 w-full">
              <Button variant="neonPink" className="w-full font-bold uppercase tracking-widest text-sm">
                Sign In
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t-2 border-foreground">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Manager Access</div>
              <Link to="/setup" onClick={() => setOpen(false)} className="w-full">
                <Button variant="outline" className="w-full font-bold uppercase tracking-widest text-sm justify-start">
                  Add / Upload Menu
                </Button>
              </Link>
              <Link to="/edit-menu" onClick={() => setOpen(false)} className="w-full">
                <Button variant="outline" className="w-full font-bold uppercase tracking-widest text-sm justify-start">
                  Edit Menu
                </Button>
              </Link>
              <Link to="/menu" onClick={() => setOpen(false)} className="w-full">
                <Button variant="outline" className="w-full font-bold uppercase tracking-widest text-sm justify-start">
                  View Uploaded Menu
                </Button>
              </Link>
              <Button variant="ghost" className="w-full font-bold uppercase tracking-widest text-sm text-destructive justify-start mt-2" onClick={() => { signOut(); setOpen(false); }}>
                <LogOut size={16} className="mr-2"/> Sign Out
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
