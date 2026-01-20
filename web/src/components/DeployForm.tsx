import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Loader2, CheckCircle2, XCircle, ExternalLink, Trash2 } from "lucide-react";

type DeployStatus = "idle" | "loading" | "success" | "error";

interface DeployResult {
  url?: string;
  message?: string;
  error?: string;
}

export function DeployForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [appName, setAppName] = useState("");
  const [status, setStatus] = useState<DeployStatus>("idle");
  const [result, setResult] = useState<DeployResult | null>(null);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repoUrl || !appName) return;

    setStatus("loading");
    setResult(null);

    try {
      const response = await fetch("/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl, appName }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setResult(data);
      } else {
        setStatus("error");
        setResult({ error: data.error || "Deployment failed" });
      }
    } catch (error) {
      setStatus("error");
      setResult({ error: "Network error. Please try again." });
    }
  };

  const handleUndeploy = async () => {
    if (!appName) return;

    setStatus("loading");
    setResult(null);

    try {
      const response = await fetch(`/undeploy/${appName}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("idle");
        setResult({ message: data.message });
        setRepoUrl("");
        setAppName("");
      } else {
        setStatus("error");
        setResult({ error: data.error || "Undeploy failed" });
      }
    } catch (error) {
      setStatus("error");
      setResult({ error: "Network error. Please try again." });
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setResult(null);
    setRepoUrl("");
    setAppName("");
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="card-gradient rounded-2xl border border-border/50 p-8 glow-primary">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Rocket className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Deploy Application</h2>
            <p className="text-sm text-muted-foreground">Enter your repo URL and app name</p>
          </div>
        </div>

        <form onSubmit={handleDeploy} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="repoUrl" className="text-sm font-medium">
              GitHub Repository URL
            </Label>
            <Input
              id="repoUrl"
              type="url"
              placeholder="https://github.com/username/repo.git"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={status === "loading" || status === "success"}
              className="bg-input border-border/50 focus:border-primary h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appName" className="text-sm font-medium">
              Application Name
            </Label>
            <Input
              id="appName"
              type="text"
              placeholder="my-awesome-app"
              value={appName}
              onChange={(e) => setAppName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              disabled={status === "loading" || status === "success"}
              className="bg-input border-border/50 focus:border-primary h-12 font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Only lowercase letters, numbers, and hyphens allowed
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {status !== "success" ? (
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="flex-1"
                disabled={!repoUrl || !appName || status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="h-5 w-5" />
                    Deploy
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={resetForm}
                >
                  Deploy Another
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="lg"
                  onClick={handleUndeploy}
                >
                  <Trash2 className="h-5 w-5" />
                  Undeploy
                </Button>
              </>
            )}
          </div>
        </form>

        {/* Status Panel */}
        {result && (
          <div className="mt-6 animate-fade-in">
            {status === "success" && result.url && (
              <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-success mb-1">Deployed Successfully!</p>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline font-mono break-all"
                    >
                      {result.url}
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {status === "error" && result.error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive mb-1">Deployment Failed</p>
                    <p className="text-sm text-muted-foreground">{result.error}</p>
                  </div>
                </div>
              </div>
            )}

            {result.message && !result.url && !result.error && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p className="text-sm">{result.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
