import { Navbar } from "@/components/Navbar";
import { DeployForm } from "@/components/DeployForm";
import { Footer } from "@/components/Footer";

const Deploy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-6">
        <div className="w-full max-w-xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Deploy Your <span className="text-gradient">Application</span>
            </h1>
            <p className="text-muted-foreground">
              Paste your GitHub repo, name your app, and launch it to the world.
            </p>
          </div>
          <DeployForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Deploy;
