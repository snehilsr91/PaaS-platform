const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec, execSync } = require("child_process");

const app = express();
app.use(express.json());

/**
 * CONSTANTS
 */
const APPS_DIR = "/home/ubuntu/paas-platform/apps";
const NGINX_APPS_DIR = "/etc/nginx/conf.d/apps";

/**
 * HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.send("College PaaS backend running 🚀");
});

/**
 * UTILS
 */
function isValidAppName(name) {
  return /^[a-z0-9-]+$/.test(name);
}

function getFreePort(start = 3001) {
  let port = start;
  while (true) {
    try {
      execSync(`ss -tuln | grep :${port}`, { stdio: "ignore" });
      port++;
    } catch {
      return port;
    }
  }
}

/**
 * NGINX ROUTING (CORRECT WAY)
 */
function addNginxRoute(appName, port) {
  if (!fs.existsSync(NGINX_APPS_DIR)) {
    fs.mkdirSync(NGINX_APPS_DIR, { recursive: true });
  }

  const confPath = path.join(NGINX_APPS_DIR, `${appName}.conf`);

  const config = `
location /${appName}/ {
    proxy_pass http://localhost:${port};
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
`;

  fs.writeFileSync(confPath, config);
}

/**
 * DEPLOY
 */
app.post("/deploy", (req, res) => {
  const { repoUrl, appName } = req.body;

  if (!repoUrl || !appName) {
    return res.status(400).json({ error: "repoUrl and appName required" });
  }

  if (!isValidAppName(appName)) {
    return res.status(400).json({ error: "Invalid app name" });
  }

  const appPath = path.join(APPS_DIR, appName);
  const imageName = `paas-${appName}`;
  const port = getFreePort();

  try {
    // Clean previous state (idempotent deploy)
    execSync(`docker rm -f ${appName}`, { stdio: "ignore" });
    execSync(`rm -rf ${appPath}`, { stdio: "ignore" });

    if (!fs.existsSync(APPS_DIR)) {
      fs.mkdirSync(APPS_DIR, { recursive: true });
    }
  } catch {}

  exec(`git clone ${repoUrl} ${appPath}`, (err) => {
    if (err) {
      return res.status(500).json({ error: "Git clone failed" });
    }

    exec(`docker build -t ${imageName} ${appPath}`, (err) => {
      if (err) {
        return res.status(500).json({ error: "Docker build failed" });
      }

      exec(
        `docker run -d -p ${port}:3000 --name ${appName} ${imageName}`,
        (err) => {
          if (err) {
            return res.status(500).json({ error: "Docker run failed" });
          }

          try {
            addNginxRoute(appName, port);

            execSync("sudo nginx -t", { stdio: "inherit" });
            execSync("sudo systemctl reload nginx", { stdio: "inherit" });

            return res.json({
              message: "App deployed successfully",
              url: `http://3.108.249.105/${appName}`,
            });
          } catch (e) {
            console.error("NGINX reload error:", e.message);
            return res.status(500).json({ error: "NGINX reload failed" });
          }
        }
      );
    });
  });
});

/**
 * UNDEPLOY
 */
app.delete("/undeploy/:appName", (req, res) => {
  const { appName } = req.params;

  if (!isValidAppName(appName)) {
    return res.status(400).json({ error: "Invalid app name" });
  }

  const appPath = path.join(APPS_DIR, appName);
  const confPath = path.join(NGINX_APPS_DIR, `${appName}.conf`);

  try {
    execSync(`docker rm -f ${appName}`, { stdio: "ignore" });
    execSync(`rm -rf ${appPath}`, { stdio: "ignore" });

    if (fs.existsSync(confPath)) {
      fs.unlinkSync(confPath);
    }

    execSync("sudo nginx -t", { stdio: "inherit" });
    execSync("sudo systemctl reload nginx", { stdio: "inherit" });

    return res.json({ message: `${appName} undeployed successfully` });
  } catch (err) {
    console.error("Undeploy error:", err.message);
    return res.status(500).json({ error: "Undeploy failed" });
  }
});

/**
 * START SERVER
 */
app.listen(5000, () => {
  console.log("PaaS backend running on port 5000");
});

