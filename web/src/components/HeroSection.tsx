import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Zap, Shield, Globe } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(251, 191, 36, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(251, 191, 36, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-slide-up">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Built for Students</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Deploy Your Apps
            <br />
            <span className="text-gradient">In Seconds</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            The simplest way to deploy your projects. Just paste your GitHub URL, 
            pick a name, and watch your app go live instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/deploy">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Start Deploying
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                <Github className="h-5 w-5" />
                View Docs
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Github, label: "GitHub Integration" },
              { icon: Zap, label: "Instant Deploys" },
              { icon: Globe, label: "Custom URLs" },
              { icon: Shield, label: "Secure & Isolated" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50"
              >
                <feature.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal Preview */}
        <div className="mt-20 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="card-gradient rounded-xl border border-border/50 overflow-hidden glow-primary">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-primary/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">launchpad-deploy</span>
            </div>
            
            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <span className="text-primary">$</span>
                <span>launchpad deploy my-awesome-app</span>
              </div>
              <div className="text-muted-foreground/70 mb-2">
                → Cloning repository...
              </div>
              <div className="text-muted-foreground/70 mb-2">
                → Building Docker image...
              </div>
              <div className="text-muted-foreground/70 mb-2">
                → Configuring NGINX routing...
              </div>
              <div className="flex items-center gap-2 text-success">
                <span>✓</span>
                <span>Deployed!</span>
                <span className="text-primary underline">http://server/my-awesome-app</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
