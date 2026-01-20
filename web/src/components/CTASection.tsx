import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-8 glow-primary-strong">
            <Rocket className="h-8 w-8 text-primary-foreground" />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to <span className="text-gradient">Launch</span>?
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Stop configuring servers. Start shipping projects. 
            Your next deployment is just a click away.
          </p>

          <Link to="/deploy">
            <Button variant="hero" size="xl">
              Deploy Your First App
              <Rocket className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
