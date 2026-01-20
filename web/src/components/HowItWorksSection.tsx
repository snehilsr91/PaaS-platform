import { ArrowDown } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Paste Your Repo",
    description: "Enter your GitHub repository URL. Public repos are supported out of the box.",
  },
  {
    number: "02",
    title: "Name Your App",
    description: "Choose a unique name for your application. This becomes your URL path.",
  },
  {
    number: "03",
    title: "Hit Deploy",
    description: "Click deploy and watch the magic happen. Your app goes live in seconds.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Three Steps to <span className="text-gradient">Launch</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No complicated pipelines. No yaml files. Just deploy.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="flex gap-6 items-start">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{step.number}</span>
                  </div>
                </div>

                {/* Step Content */}
                <div className="pb-12">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-7 top-14 w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="flex justify-center mt-8">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center animate-float glow-primary">
            <ArrowDown className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
}
