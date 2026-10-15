# EVENTORIA - Deployment & Setup Guide

This document provides step-by-step instructions to run and deploy **EVENTORIA: The Event Hub of Algeria** both locally and in cloud environments.

---

## 1. Local Development Setup

### Prerequisites
- **Node.js**: v18 or later
- **MongoDB**: Local instance running on `mongodb://localhost:27017` or MongoDB Atlas URI
- **Git**: Installed

### Step 1: Clone & Environment Variables
Create `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventoria
JWT_SECRET=eventoria_jwt_pfe_secret_key_2025
CLIENT_URL=http://localhost:3000
```

### Step 2: Install & Seed Database
From the root directory:
```bash
# Seed initial categories, cities, venues, and events
npm run seed
```

### Step 3: Run Development Servers
From the root directory:
```bash
# Terminal 1: Run Backend API
npm run dev:backend

# Terminal 2: Run Frontend Web App
npm run dev:frontend
```
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`

---

## 2. Docker Deployment

Run the full stack (MongoDB, Backend, Frontend) with a single command:

```bash
docker-compose up --build -d
```

- Web Portal: `http://localhost:3000`
- REST API: `http://localhost:5000`

---

## 3. Cloud Deployment (Render + Vercel / Netlify)

### A. Database (MongoDB Atlas)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Add Database User & IP access (`0.0.0.0/0` for cloud deployment).
3. Copy connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/eventoria?retryWrites=true&w=majority`.

### B. Backend Deployment (Render / Railway)
1. Create a **Web Service** on Render connected to `backend/`.
2. Environment variables required:
   - `MONGO_URI`: MongoDB Atlas string
   - `JWT_SECRET`: Secret string
   - `NODE_ENV`: `production`
3. Build command: `npm install`
4. Start command: `node server.js`

### C. Frontend Deployment (Vercel / Netlify)
1. Create a new site connected to `frontend/`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set Environment Variable: `VITE_API_URL=https://your-backend-render-url.onrender.com/api`

---

## Default Seed User Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@eventoria.dz` | `admin123` |
| **Organizer** | `organizer@eventoria.dz` | `organizer123` |
| **Visitor / User** | `user@eventoria.dz` | `user123` |
