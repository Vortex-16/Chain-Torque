import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Users, FileText, Award } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-hero text-primary-foreground py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow animate-gradient-shift bg-[length:400%_400%]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-bounce-in">
            Buy & Sell
            <span className="block text-4xl md:text-5xl mt-2 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">Professional CAD Models</span>
          </h1>
          
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in-up">
            The premier marketplace for mechanical engineers and designers. 
            Discover, purchase, and customize high-quality CAD models from industry professionals.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8 animate-slide-in-right">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/70 h-5 w-5 transition-colors group-hover:text-accent" />
              <Input 
                placeholder="Search gears, assemblies, parts..."
                className="pl-12 h-12 bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/70 transition-all hover:bg-background/20 focus:bg-background/20 focus:border-accent"
              />
              <Button size="sm" className="absolute right-2 top-2 bg-accent text-background hover:bg-accent/90 transition-all hover:scale-105">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up [animation-delay:0.4s]">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all hover:scale-105 hover:shadow-glow">
              Browse Models
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-accent/50 text-primary-foreground hover:bg-accent/20 hover:border-accent transition-all hover:scale-105">
              Start Selling
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center animate-bounce-in [animation-delay:0.6s] group">
              <div className="flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                <FileText className="h-8 w-8 text-accent transition-colors" />
              </div>
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-primary-foreground/80">CAD Models</div>
            </div>
            <div className="text-center animate-bounce-in [animation-delay:0.8s] group">
              <div className="flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                <Users className="h-8 w-8 text-secondary transition-colors" />
              </div>
              <div className="text-2xl font-bold">5,000+</div>
              <div className="text-primary-foreground/80">Engineers</div>
            </div>
            <div className="text-center animate-bounce-in [animation-delay:1s] group">
              <div className="flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                <Award className="h-8 w-8 text-accent transition-colors" />
              </div>
              <div className="text-2xl font-bold">99%</div>
              <div className="text-primary-foreground/80">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}