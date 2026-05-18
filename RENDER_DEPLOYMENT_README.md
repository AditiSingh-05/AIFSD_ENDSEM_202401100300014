# Render Deployment Guide

This guide explains how to deploy the MERN Employee Performance Analytics app on Render.

## What You Will Deploy

Deploy two Render services:

- Backend: Node.js web service from `server/`
- Frontend: Static site from `client/`

MongoDB stays on MongoDB Atlas.

## 1. Prepare MongoDB Atlas

1. Open MongoDB Atlas.
2. Use your existing cluster.
3. Allow Render to connect:
   - For simple exam deployment, add `0.0.0.0/0` to Network Access.
   - For production, restrict this to trusted IPs.
4. Copy your connection string.

Example:

```text
mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/?appName=aiafsd
```

## 2. Deploy Backend on Render

1. Go to Render.
2. Click **New +**.
3. Select **Web Service**.
4. Connect your GitHub repository.
5. Use these settings:

```text
Name: employee-performance-api
Root Directory: . (leave empty or use .)
Environment: Node
Build Command: npm install --workspace server
Start Command: npm start --workspace server
```

6. Add environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5050
JWT_SECRET=replace_with_a_long_random_secret
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-5.2
CLIENT_URL=https://your-frontend-name.onrender.com
```

7. Deploy the service.
8. After deployment, test:

```text
https://your-backend-name.onrender.com/api/health
```

Expected output:

```json
{
  "ok": true,
  "service": "employee-performance-api"
}
```

## 3. Deploy Frontend on Render

1. Click **New +**.
2. Select **Static Site**.
3. Connect the same GitHub repository.
4. Use these settings:

```text
Name: employee-performance-client
Root Directory: . (leave empty or use .)
Build Command: npm install --workspace client && npm run build --workspace client
Publish Directory: client/dist
```

5. Add frontend environment variable:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

6. Deploy the frontend.

## 4. Update Backend CORS

After the frontend URL is created, go back to the backend Render service and set:

```env
CLIENT_URL=https://your-frontend-name.onrender.com
```

Redeploy the backend after changing this value.

## 5. Final Testing URLs

Frontend:

```text
https://your-frontend-name.onrender.com
```

Backend:

```text
https://your-backend-name.onrender.com/api/health
```

Test these API endpoints from Postman:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/employees`
- `POST /api/employees`
- `POST /api/ai/recommend`

## Common Deployment Issues

### CORS Error

Make sure backend `CLIENT_URL` exactly matches your deployed frontend URL.

### MongoDB Connection Error

Check:

- MongoDB username/password
- Atlas Network Access
- `MONGODB_URI` in Render environment variables

### Frontend Cannot Call Backend

Check frontend variable:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

Then redeploy the frontend.

### AI Recommendation Fallback

If OpenRouter fails or times out, the backend returns a local fallback recommendation so the exam demo still works.
