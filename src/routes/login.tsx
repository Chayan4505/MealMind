import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Utensils } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { signInWithGoogle, user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && user) {
      if (!user.user_metadata?.restaurant_name) {
         navigate({ to: "/setup" });
      } else {
         navigate({ to: "/dashboard" });
      }
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" }); // Mock for email login
  };

  return (
    <div className="min-h-screen dot-grid flex flex-col pt-16">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 mt-10">
        <div className="w-full max-w-md brutal-shadow bg-card p-8 animate-on-scroll visible">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-neon-pink flex items-center justify-center mb-4 brutal-shadow-light text-primary-foreground">
              <Utensils size={32} />
            </div>
            <h1 className="font-heading text-3xl font-bold">
              {isLogin ? "Restaurant Sign In" : "Register Restaurant"}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {isLogin 
                ? "Enter your credentials to access your dashboard and forecasting tools." 
                : "Join EcoFeast to optimize your kitchen and reduce food waste."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2 text-left">
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input 
                  id="restaurantName" 
                  placeholder="e.g. Spice Kitchen Co." 
                  required 
                  className="brutal-shadow"
                />
              </div>
            )}
            
            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="hello@restaurant.com" 
                required 
                className="brutal-shadow"
              />
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="brutal-shadow"
              />
            </div>

            <Button 
              type="submit" 
              variant="neonPink" 
              className="w-full h-12 text-md mt-4"
            >
              {isLogin ? "Access Dashboard" : "Create Account"}
              <ArrowRight className="ml-2 arrow-move" />
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-card px-2 text-muted-foreground font-bold">Or continue with</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              onClick={signInWithGoogle}
              className="w-full h-12 text-md brutal-shadow"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>
          </form>

          <div className="mt-8 text-center border-t-2 border-border pt-6">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already registered?"}
            </p>
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="mt-2 text-neon-blue font-bold uppercase tracking-widest text-sm hover:underline"
            >
              {isLogin ? "Sign up as Restaurant" : "Sign in to Dashboard"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
