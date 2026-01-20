import { Box, Cpu, GitBranch, LayoutGrid, Rocket, Server } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "GitHub Native",
    description: "Connect any public repository and deploy in one click. No complex setup required.",
  },
  {
    icon: Box,
    title: "Docker Powered",
    description: "Every app runs in its own isolated container for security and reliability.",
  },
  {
    icon: Server,
    title: "NGINX Routing",
    description: "Smart path-based routing gives each app its own unique URL endpoint.",
  },
  {
    icon: Cpu,
    title: "Auto-Scaling",
    description: "Managed by PM2 for automatic restarts and process management.",
  },
  {
    icon: LayoutGrid,
    title: "Multi-App Support",
    description: "Deploy multiple applications side by side on the same infrastructure.",
  },
  {
    icon: Rocket,
    title: "Zero Config",
    description: "Just provide a repo URL and app name. We handle the rest automatically.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="text-gradient">Ship Fast</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built on battle-tested infrastructure. Focus on your code, we'll handle the deployment.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl card-gradient border border-border/50 hover:border-primary/30 transition-all duration-300 hover:glow-primary"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
