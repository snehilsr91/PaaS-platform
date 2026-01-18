# 📦 College PaaS Platform

A lightweight **Platform-as-a-Service (PaaS)** built for college students to deploy backend/frontend projects easily using **Git, Docker, NGINX, and AWS**.

This platform allows users to submit a Git repository and receive a live URL without worrying about containerization, networking, or server configuration.

---

## 🚀 Features

* Git-based application deployment
* Automatic Docker image build & container execution
* Dynamic port allocation
* Path-based routing using NGINX (no exposed ports)
* Idempotent deployments (safe re-deploys)
* Application undeploy support
* Persistent backend using PM2
* Runs fully on AWS EC2

---

## 🧠 Motivation

Many students struggle to deploy projects due to:

* Lack of cloud infrastructure knowledge
* Complex Docker & networking setup
* Manual server configuration

This project abstracts those complexities and provides a **self-service deployment platform** suitable for academic environments.

---

## 🏗️ Architecture Overview

### Components

* **Node.js Backend**
  Acts as the control plane handling deploy & undeploy requests.

* **Docker**
  Used to containerize and isolate student applications.

* **NGINX**
  Reverse proxy that routes clean URLs to running containers.

* **PM2**
  Keeps the backend alive across SSH disconnects and reboots.

* **AWS EC2**
  Cloud compute infrastructure.

---

### Deployment Flow

1. User sends a deploy request with a Git repo URL
2. Backend clones the repository
3. Docker builds an image from the project
4. Container runs on a dynamically selected free port
5. NGINX route is generated automatically
6. Application becomes accessible via a clean URL

---

## 🌐 Example URLs

```
http://<EC2-IP>/student-app-1
http://<EC2-IP>/student-app-2
```

---

## 🔌 API Endpoints

### Deploy an Application

```http
POST /deploy
```

**Request Body**

```json
{
  "repoUrl": "https://github.com/username/repo.git",
  "appName": "my-app"
}
```

**Response**

```json
{
  "message": "App deployed successfully",
  "url": "http://<EC2-IP>/my-app"
}
```

---

### Undeploy an Application

```http
DELETE /undeploy/:appName
```

**Response**

```json
{
  "message": "my-app undeployed successfully"
}
```

---

## 🛠️ Tech Stack

* **Backend:** Node.js (Express)
* **Containerization:** Docker
* **Reverse Proxy:** NGINX
* **Process Manager:** PM2
* **Cloud Provider:** AWS EC2
* **Version Control:** Git & GitHub (SSH authentication)

---

## 📚 DevOps Concepts Used

* Containerization
* Reverse proxy routing
* Infrastructure automation
* Idempotent deployments
* Process supervision
* SSH-based authentication
* Cloud networking & security groups

---

## 🧪 OSI Model Mapping (Academic)

| OSI Layer   | Used In                  |
| ----------- | ------------------------ |
| Application | Node.js, NGINX           |
| Transport   | TCP, Docker port mapping |
| Network     | AWS VPC, Security Groups |
| Physical    | AWS infrastructure       |

---

## ❓ Why Not Kubernetes?

Kubernetes is powerful but overkill for a controlled academic environment.

This project intentionally uses **Docker + NGINX** to:

* Keep the system simple and transparent
* Improve debuggability
* Reduce operational overhead

---

## 📁 Project Structure

```text
PaaS-platform/
├── api/
│   ├── index.js
│   ├── package.json
├── apps/              # runtime state (not version-controlled)
├── .gitignore
└── README.md
```

---

## 🔐 Security Notes

* App names are validated to prevent command injection
* Only controlled NGINX reload permissions are granted
* Runtime application state is isolated from platform code

---

## 🎓 Academic Relevance

This project demonstrates concepts from:

* DevOps
* Cloud Computing
* Computer Networks
* Operating Systems

It is suitable for:

* College mini-projects
* DevOps demonstrations
* Infrastructure automation showcases

---

## ✨ Author

**Snehil Singh Rokey**
National Institute of Engineering, Mysore
AIML-B

---

## 📌 Future Enhancements

* HTTPS using Let’s Encrypt
* Frontend UI for deployments
* Authentication & user accounts
* Resource limits per application
* Multi-server support
