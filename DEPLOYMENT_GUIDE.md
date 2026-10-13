# 🚀 Zephyra Auth - Production Deployment Guide

This guide provides end-to-end instructions for deploying the **Zephyra Auth** full-stack application to **Render.com** (Backend & PostgreSQL) and **Vercel** (Frontend).

---

## 🏗 System Architecture

```
                    ┌───────────────────────────────────┐
                    │          End User Browser         │
                    └─────────────────┬─────────────────┘
                                      │ HTTPS
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
┌───────────────────────────┐                   ┌───────────────────────────┐
│       Frontend (Vercel)   │                   │    Swagger / Actuator     │
│   Next.js 16 + TypeScript │                   │    Interactive API Docs   │
└─────────────┬─────────────┘                   └─────────────┬─────────────┘
              │                                               │
              │ REST API (JSON) + Bearer JWT                  │
              ▼                                               ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                           Backend (Render.com)                            │
│                     Java 21 LTS + Spring Boot 4.1.1                       │
│                     Spring Security 6 + JJWT 0.12                         │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ JDBC / SSL
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database (Render.com)                       │
│               Roles, Users, Refresh Tokens, Audit Timestamps              │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄 Step 1: Render PostgreSQL Database Setup

Your PostgreSQL database instance is already provisioned on Render:

- **Database Name**: `zephyra_auth_db`
- **Username**: `zephyra_auth_app`
- **Internal Host**: `dpg-db6qh00m7kps73av34gg-a:5432`
- **External Host**: `dpg-db6qh00m7kps73av34gg-a.singapore-postgres.render.com:5432`
- **Internal Database URL**: `postgresql://zephyra_auth_app:0dlmIpWjVwLd2gm1lsWH26X4mHVEz8Ph@dpg-db6qh00m7kps73av34gg-a/zephyra_auth_db`

> [!NOTE]
> When your backend web service is deployed in the **same Render region (Singapore)** as your PostgreSQL instance, using the **Internal Host** provides zero latency overhead and zero egress bandwidth fees!

---

## ☕ Step 2: Backend Deployment on Render.com

### Option A: Deploy via Docker (Recommended)
The repository contains a multi-stage, container-aware [Dockerfile](file:///d:/Year04/Projects/zephyra-auth/backend/Dockerfile) (`eclipse-temurin:21`).

1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository: `https://github.com/prasannadilshan/zephyra-auth`.
4. Configure the Web Service settings:
   - **Name**: `zephyra-auth-backend` (or your preferred name)
   - **Region**: `Singapore` (same region as your PostgreSQL instance)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Instance Type**: `Free` (or Starter)

5. Scroll down to **Environment Variables** and add the following keys:

| Environment Variable | Value | Description |
|----------------------|-------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://dpg-db6qh00m7kps73av34gg-a:5432/zephyra_auth_db` | Internal JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `zephyra_auth_app` | DB Username |
| `SPRING_DATASOURCE_PASSWORD` | `0dlmIpWjVwLd2gm1lsWH26X4mHVEz8Ph` | DB Password |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | 256-bit Hex Key |
| `JWT_EXPIRATION_MS` | `86400000` | 24 Hours in ms |
| `JWT_REFRESH_EXPIRATION_MS` | `604800000` | 7 Days in ms |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | Auto-creates tables on boot |
| `CORS_ALLOWED_ORIGINS` | `*` | Allows browser requests |

6. Click **Create Web Service**.
7. Render will build the Docker container and start your Spring Boot application.

### Option B: Deploy via Native Java Runtime
If you prefer native build instead of Docker:
- **Runtime**: `Java`
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -Dserver.port=$PORT -jar target/backend-0.0.1-SNAPSHOT.jar`
- **Environment Variables**: Same as Option A.

---

## 🌐 Step 3: Frontend Deployment on Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository: `https://github.com/prasannadilshan/zephyra-auth`.
4. In the configuration screen:
   - **Framework Preset**: `Next.js` (automatically detected)
   - **Root Directory**: Click **Edit** and select `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)
5. Expand **Environment Variables** and add:

| Variable Name | Example Value | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://zephyra-auth-backend.onrender.com/api` | Your Render backend API base URL with `/api` |
| `NEXT_PUBLIC_APP_NAME` | `Zephyra Auth` | Application branding |

6. Click **Deploy**.
7. Vercel will build the Next.js static and dynamic bundles in ~1 minute and assign a public `.vercel.app` URL.

---

## 🔍 Step 4: Verification & Smoke Testing Checklist

Once both services are deployed, perform the following verification steps:

### 1. Backend Health Check
Navigate in your browser to:
`https://<your-render-backend-url>/api/health`
Expected response:
```json
{
  "status": "UP",
  "service": "Zephyra Auth API",
  "timestamp": 1728812345678,
  "version": "1.0.0"
}
```

### 2. Interactive Swagger UI
Navigate to:
`https://<your-render-backend-url>/swagger-ui.html`
Verify all endpoints (`/api/auth/**`, `/api/user/**`, `/api/admin/**`, `/api/health`) are documented with request/response schemas.

### 3. Administrator Login Test
1. Open your Vercel deployment URL (`https://<your-app>.vercel.app/login`).
2. Enter administrator credentials:
   - **Email / Username**: `admin@zephyra.com`
   - **Password**: `Admin@123456`
3. Click **Sign in to Account**.
4. You should be redirected to `/dashboard`, showing:
   - User profile with `ROLE_ADMIN` badge.
   - Decoded JWT claims inspector.
   - Endpoint test buttons.
5. Click **Admin Portal** in the navigation bar (`/admin`):
   - Verify access is granted.
   - Check total user statistics and user table.

### 4. Standard User & RBAC Restriction Test
1. Log out.
2. Enter standard user credentials:
   - **Email / Username**: `user@zephyra.com`
   - **Password**: `User@123456`
3. Click **Sign in to Account**.
4. Test `/api/user/profile` -> Returns HTTP 200 with user data.
5. In the endpoint tester, click **Test Admin Endpoint (`/api/admin/stats`)** -> Returns HTTP 403 Forbidden with proper access-denied message.

### 5. Silent Token Refresh & Rotation Test
1. On the `/dashboard` page, look at the **JWT Token Inspector** section.
2. Click **Rotate Refresh Token Now**.
3. Watch the new token update immediately in the inspector with a fresh expiration and UUID.

---

## 🛠 Troubleshooting & Tips

### Cold Starts on Render Free Tier
Render spins down free web services after 15 minutes of inactivity. When accessed again, the first request may take 30-50 seconds to initialize the JVM. The Next.js frontend has built-in connection retry handling and health badges to handle this gracefully.

### Database Connection Failure
If Render logs show connection timeouts to PostgreSQL:
- Verify that `SPRING_DATASOURCE_URL` starts with `jdbc:postgresql://` (not `postgresql://`).
- If connecting using internal DNS, ensure both services are in the **same team/region**.
- If connecting via the external host, append `?sslmode=require` to the JDBC URL:
  `jdbc:postgresql://dpg-db6qh00m7kps73av34gg-a.singapore-postgres.render.com:5432/zephyra_auth_db?sslmode=require`

### CORS Errors
`WebSecurityConfig` is configured to allow `https://*.vercel.app` and `http://localhost:*` by default. If using a custom domain, add your custom domain to `CORS_ALLOWED_ORIGINS` in your Render service environment variables:
```
CORS_ALLOWED_ORIGINS=https://mycustomdomain.com,https://*.vercel.app
```

---

## 📋 Final Submission Checklist

- [x] Backend repository pushed to GitHub `main`
- [x] Frontend repository pushed to GitHub `main`
- [x] Backend deployed to Render with PostgreSQL
- [x] Frontend deployed to Vercel
- [x] Public health-check endpoint tested (`/api/health`)
- [x] Admin & User test accounts verified
- [x] `submission.txt` filled out with live URLs
