const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");

const execPromise = util.promisify(exec);

const app = express();
app.use(express.json());

const APPS_DIR = "/home/ubuntu/paas-platform/apps";
const NGINX_CONFIG = "/etc/nginx/sites-available/paas";
const APPS_NGINX_DIR = "/etc/nginx/conf.d/apps";

app.get("/", (req, res) => {
  res.send("College PaaS backend running 🚀");
});

/* =========================
   Helpers
========================= */

function isValidAppName(name) {
  return /^[a-z0-9-]+$/.test(name);
}

function getFreePort(start = 3001) {
  let port = start;
  while (true) {
    try {
      require("child_process").execSync(
        `ss -tuln | grep :${port}`,
        { stdio: "ignore" }
      );
      port++;
    } catch {
      return port;
    }
  }
}

function addNginxRoute(appName, port) {
  if (!fs.existsSync(APPS_NGINX_DIR)) {
    fs.mkdirSync(APPS_NGINX_DIR, { recursive: true });
  }

  const confPath = `${APPS_NGINX_DIR}/${appName}.conf`;

  const conf = `
location /${appName}/ {
    proxy_pass http://127.0.0.1:${port}/;
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
`;

  fs.writeFileSync(confPath, conf);
}

/* =========================
   DEPLOY
========================= */

app.post("/api/deploy", async (req, res) => {
  try {
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

    if (!fs.existsSync(APPS_DIR)) {
      fs.mkdirSync(APPS_DIR, { recursive: true });
    }

    // Cleanup (safe, async)
    await execPromise(`rm -rf ${appPath}`);
    await execPromise(`docker rm -f ${appName} || true`);

    // Clone & build
    await execPromise(`git clone ${repoUrl} ${appPath}`);
    await execPromise(`docker build -t ${imageName} ${appPath}`);

    // Run container
    await execPromise(
      `docker run -d -p ${port}:3000 --name ${appName} ${imageName}`
    );

    // NGINX routing
    addNginxRoute(appName, port);
    await execPromise("sudo nginx -t");
    await execPromise("sudo systemctl reload nginx");

    res.json({
      message: "App deployed successfully",
      url: `http://3.108.249.105/${appName}/`,
    });
  } catch (err) {
    console.error("DEPLOY ERROR:", err);
    res.status(500).json({ error: "Deployment failed" });
  }
});

/* =========================
   UNDEPLOY
========================= */

app.delete("/api/undeploy/:appName", async (req, res) => {
  try {
    const { appName } = req.params;

    if (!isValidAppName(appName)) {
      return res.status(400).json({ error: "Invalid app name" });
    }

    const appPath = path.join(APPS_DIR, appName);
    const nginxConf = `${APPS_NGINX_DIR}/${appName}.conf`;

    await execPromise(`docker rm -f ${appName} || true`);
    await execPromise(`rm -rf ${appPath}`);
    await execPromise(`rm -f ${nginxConf}`);

    await execPromise("sudo nginx -t");
    await execPromise("sudo systemctl reload nginx");

    res.json({ message: `${appName} undeployed successfully` });
  } catch (err) {
    console.error("UNDEPLOY ERROR:", err);
    res.status(500).json({ error: "Undeploy failed" });
  }
});

/* =========================
   START SERVER
========================= */

app.listen(5000, () => {
  console.log("PaaS backend running on port 5000");
});
