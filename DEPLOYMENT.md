# Lankahope Deployment Guide

Complete guide to deploy this application using Docker on DigitalOcean.

## Quick Start (For Future Deployments)

Once your server is set up, updating is just 2 commands:

```bash
ssh deploy@YOUR_SERVER_IP
cd ~/Lankahope && git pull && docker compose up -d --build
```

---

## First-Time Setup

### Prerequisites

1. **MongoDB Atlas Account** (Free)
   - Create at: https://cloud.mongodb.com
   - Get connection string

2. **DigitalOcean Account**
   - Create at: https://digitalocean.com
   - Create a $6/month droplet (Ubuntu 24.04)

3. **Domain Name** (Optional but recommended)
   - Point A record to your droplet IP

---

## Step 1: Server Setup

SSH into your droplet:
```bash
ssh root@YOUR_DROPLET_IP
```

Install Docker:
```bash
apt update && apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install -y docker-compose-plugin git

# Create deploy user
adduser deploy
usermod -aG docker deploy
usermod -aG sudo deploy
```

---

## Step 2: Deploy Application

Switch to deploy user and clone:
```bash
su - deploy
git clone https://github.com/YOUR_USERNAME/Lankahope.git
cd Lankahope
```

Create environment file:
```bash
cp .env.example .env
nano .env
```

Fill in your values:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lankahope
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=5000
DOMAIN=yourdomain.com  # optional
```

Build and start:
```bash
docker compose up -d --build
```

---

## Step 3: Verify

Check containers are running:
```bash
docker compose ps
```

View logs:
```bash
docker compose logs -f
```

Visit your site:
- http://YOUR_DROPLET_IP

---

## Common Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start containers |
| `docker compose down` | Stop containers |
| `docker compose logs -f` | View live logs |
| `docker compose logs backend` | View backend logs |
| `docker compose restart` | Restart all containers |
| `docker compose up -d --build` | Rebuild and restart |
| `docker system prune -a` | Clean old images |

---

## SSL Setup (Optional)

Install certbot and get certificate:
```bash
sudo apt install -y certbot
docker compose stop nginx
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

Then uncomment the SSL section in `nginx/nginx.conf` and restart.

---

## Troubleshooting

### Containers not starting
```bash
docker compose logs backend
docker compose down && docker compose up -d --build
```

### MongoDB connection error
- Check MONGO_URI in .env
- Ensure IP is whitelisted in Atlas (0.0.0.0/0 for all IPs)

### Images not uploading
```bash
docker volume ls
docker compose exec backend ls -la /app/uploads
```

### Out of disk space
```bash
df -h
docker system prune -a
```

---

## Architecture

```
Internet
    │
    ▼
┌─────────────────────────────────────┐
│         Nginx (Port 80/443)         │
│   - Reverse Proxy                   │
│   - SSL Termination                 │
│   - Static File Serving             │
└─────────────────────────────────────┘
    │           │           │
    ▼           ▼           ▼
  /api/*    /uploads/*     /*
    │           │           │
┌───────┐  ┌────────┐  ┌─────────┐
│Backend│  │ Volume │  │Frontend │
│ :5000 │  │(files) │  │ (React) │
└───────┘  └────────┘  └─────────┘
    │
    ▼
MongoDB Atlas (External)
```

---

## Cost Summary

| Service | Cost |
|---------|------|
| DigitalOcean Droplet | $6/month |
| MongoDB Atlas | $0 (free tier) |
| SSL (Let's Encrypt) | $0 |
| **Total** | **$6/month** |
