# Render Deployment Guide

This guide explains how to deploy the MERN Employee Performance Analytics app on Render.

## Services

Deploy two Render services:

- Backend: Node.js Web Service from `server/`
- Frontend: Static Site from `client/`

MongoDB stays on MongoDB Atlas.

## Backend Web Service

Use these settings:

```text
Root Directory: server
Environment: Node
Build Command: npm install
Start Command: npm start
```

Add environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5050
JWT_SECRET=replace_with_a_long_random_secret
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-5.2
CLIENT_URL=https://your-frontend-name.onrender.com
```

Health check:

```text
https://your-backend-name.onrender.com/api/health
```

## Frontend Static Site

Use these settings:

```text
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: dist
```

Add frontend environment variable:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

## Direct Link / Refresh Fix

This project now creates static fallback files during `npm run build` for all frontend routes:

```text
/dashboard
/employees
/performance
/ai
/trainings
/reports
/departments
/skills
/users
/roles
/login
/signup
```

Also add Render's recommended React Router rewrite rule:

```text
Source Path: /*
Destination Path: /index.html
Action: Rewrite
```

Add this in the frontend Static Site's **Redirects/Rewrites** tab.

## Final Test

After redeploying, these should load directly in the browser:

```text
https://your-frontend-name.onrender.com/dashboard
https://your-frontend-name.onrender.com/ai
https://your-frontend-name.onrender.com/login
```

If direct links still fail, confirm the Render rewrite rule is saved and redeploy the frontend.
