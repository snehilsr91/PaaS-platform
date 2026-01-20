import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Book, Terminal, Box, Server, AlertCircle } from "lucide-react";

const Docs = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
              <Book className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">Documentation</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to know about deploying applications on Launchpad.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Quick Start */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Terminal className="h-6 w-6 text-primary" />
                Quick Start
              </h2>
              <div className="card-gradient rounded-xl border border-border/50 p-6 space-y-4">
                <p className="text-muted-foreground">
                  Deploying your first app is simple. Follow these steps:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                  <li>Go to the <strong className="text-foreground">Deploy</strong> page</li>
                  <li>Enter your public GitHub repository URL (e.g., <code className="font-mono bg-secondary px-2 py-1 rounded text-sm">https://github.com/user/repo.git</code>)</li>
                  <li>Choose a unique app name (lowercase, numbers, hyphens only)</li>
                  <li>Click <strong className="text-foreground">Deploy</strong> and wait for the magic</li>
                </ol>
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Box className="h-6 w-6 text-primary" />
                App Requirements
              </h2>
              <div className="card-gradient rounded-xl border border-border/50 p-6 space-y-4">
                <p className="text-muted-foreground">
                  Your application must have a <code className="font-mono bg-secondary px-2 py-1 rounded text-sm">Dockerfile</code> in the root of your repository.
                </p>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm font-mono text-muted-foreground mb-2"># Example Dockerfile for Node.js</p>
                  <pre className="text-sm font-mono text-foreground">
{`FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`}
                  </pre>
                </div>
              </div>
            </section>

            {/* API Reference */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Server className="h-6 w-6 text-primary" />
                API Reference
              </h2>
              <div className="space-y-4">
                {/* Deploy Endpoint */}
                <div className="card-gradient rounded-xl border border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded bg-success/20 text-success text-sm font-bold">POST</span>
                    <code className="font-mono text-lg">/deploy</code>
                  </div>
                  <p className="text-muted-foreground mb-4">Deploy a new application from a GitHub repository.</p>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Request Body</p>
                    <pre className="text-sm font-mono text-foreground">
{`{
  "repoUrl": "https://github.com/user/repo.git",
  "appName": "my-app"
}`}
                    </pre>
                  </div>
                </div>

                {/* Undeploy Endpoint */}
                <div className="card-gradient rounded-xl border border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded bg-destructive/20 text-destructive text-sm font-bold">DELETE</span>
                    <code className="font-mono text-lg">/undeploy/:appName</code>
                  </div>
                  <p className="text-muted-foreground">Remove a deployed application.</p>
                </div>
              </div>
            </section>

            {/* Limitations */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-primary" />
                Limitations
              </h2>
              <div className="card-gradient rounded-xl border border-border/50 p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    Only public GitHub repositories are supported
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    App names must be unique across the platform
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    A valid Dockerfile must be present in the repository root
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    No persistent storage between deploys
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Docs;
