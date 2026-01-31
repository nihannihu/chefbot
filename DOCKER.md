# ChefBotARENA - Docker Deployment Guide

## 🐳 Quick Start with Docker

### Prerequisites
- Docker installed
- Docker Compose installed

### 1. Clone the Repository
```bash
git clone https://github.com/nihannihu/chefbot.git
cd chefbot
```

### 2. Create Environment File
Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

### 3. Build and Run with Docker Compose
```bash
docker-compose up -d
```

The app will be available at: `http://localhost:3000`

### 4. Stop the Container
```bash
docker-compose down
```

---

## 🔧 Manual Docker Commands

### Build the Image
```bash
docker build -t chefbot-arena .
```

### Run the Container
```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key \
  -e CLERK_SECRET_KEY=your_key \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key \
  chefbot-arena
```

---

## 📦 What's Included

- **Dockerfile**: Multi-stage build for optimized production image
- **docker-compose.yml**: Easy orchestration with environment variables
- **.dockerignore**: Excludes unnecessary files from build

---

## 🚀 Production Deployment

### Deploy to Any Cloud Platform

**AWS ECS / Google Cloud Run / Azure Container Instances:**
1. Build the image
2. Push to container registry (Docker Hub, ECR, GCR, ACR)
3. Deploy using platform-specific tools

**Example - Docker Hub:**
```bash
docker build -t yourusername/chefbot-arena .
docker push yourusername/chefbot-arena
```

---

## 🔍 Troubleshooting

**Container won't start:**
- Check environment variables are set correctly
- Verify port 3000 is not already in use
- Check logs: `docker-compose logs`

**Build fails:**
- Ensure you have enough disk space
- Try: `docker system prune` to clean up

---

## 📝 Notes

- The Docker image uses Node.js 20 Alpine for minimal size
- Multi-stage build reduces final image size
- Runs as non-root user for security
- Standalone output mode for optimal Docker performance
