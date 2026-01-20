const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec, execSync } = require("child_process");
const app = express();
app.use(express.json());

const APPS_DIR = "/home/ubuntu/paas-platform/apps";
const NGINX_CONFIG = "/etc/nginx/sites-available/paas";

app.get("/", (req, res) => {
  res.send("College PaaS backend running 🚀");
});

function isValidAppName(name) {
  return /^[a-zA-Z0-9-_]+$/.test(name);
}

function addNginxRoute(appName, port) {
  const block = `
    location /${appName}/ {
        proxy_pass http://localhost:${port}/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  `;

  try {
    fs.appendFileSync(NGINX_CONFIG, block);
  } catch (err) {
    console.error("Failed to write NGINX config:", err.message);
    throw err;
  }
}

function getFreePort(start = 3001) {
  const { execSync } = require("child_process");
  let port = start;

  while (true) {
    try {
      execSync(`ss -tuln | grep :${port}`, { stdio: "ignore" });
      port++; // port in use
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
app.post("/api/deploy", (req, res) => {
  const { repoUrl, appName } = req.body;

  if (!repoUrl || !appName) {
    return res.status(400).json({ error: "repoUrl and appName required" });
  }

  if (!isValidAppName(appName)) {
    return res.status(400).json({ error: "Invalid app name" });
  }

  const appPath = path.join(APPS_DIR, appName);
  // Clean previous state (idempotent deploy)
  execSync(`rm -rf ${appPath}`, { stdio: "ignore" });
  execSync(`docker rm -f ${appName}`, { stdio: "ignore" });

  const imageName = `paas-${appName}`;
  const port = getFreePort();

  if (!fs.existsSync(APPS_DIR)) fs.mkdirSync(APPS_DIR);

  exec(`git clone ${repoUrl} ${appPath}`, (err) => {
    if (err) return res.status(500).json({ error: "Git clone failed" });

    exec(`docker build -t ${imageName} ${appPath}`, (err) => {
      if (err) return res.status(500).json({ error: "Docker build failed" });

      exec(
        `docker rm -f ${appName} || true && docker run -d -p ${port}:3000 --name ${appName} ${imageName}`,
        (err) => {
          if (err) return res.status(500).json({ error: "Docker run failed" });

          addNginxRoute(appName, port);

          exec(`sudo nginx -t && sudo systemctl reload nginx`, (err) => {
            if (err)
              return res.status(500).json({ error: "NGINX reload failed" });

            res.json({
              message: "App deployed successfully",
              url: `http://3.108.249.105/${appName}`,
            });
          });
        },
      );
    });
  });
});

/**
 * UNDEPLOY
 */
app.delete("/api/undeploy/:appName", (req, res) => {
  const { appName } = req.params;

  if (!isValidAppName(appName)) {
    return res.status(400).json({ error: "Invalid app name" });
  }

  const appPath = path.join(APPS_DIR, appName);

  try {
    execSync(`docker rm -f ${appName}`, { stdio: "ignore" });
    execSync(`rm -rf ${appPath}`, { stdio: "ignore" });

    // Remove nginx route
    const config = fs.readFileSync(NGINX_CONFIG, "utf8");
    const updated = config.replace(
      new RegExp(`\\s*location /${appName}/[\\s\\S]*?}\\n`, "g"),
      "",
    );

    fs.writeFileSync(NGINX_CONFIG, updated);
    execSync("sudo nginx -t && sudo systemctl reload nginx");

    res.json({ message: `${appName} undeployed successfully` });
  } catch (err) {
    res.status(500).json({ error: "Undeploy failed" });
  }
});

app.listen(5000, () => {
  console.log("PaaS backend running on port 5000");
});
