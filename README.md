# 🛡️ Zephyra Auth - Enterprise Full-Stack Authentication System

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.1-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java 21](https://img.shields.io/badge/Java-21_LTS-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Render_Managed-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-19%2F19_Passed-brightgreen)](https://github.com/prasannadilshan/zephyra-auth)

Production-grade, full-stack authentication and authorization system developed for the **ZephyraTech Solutions (Pvt) Ltd Software Engineering Assessment**. 

---

## 🌟 Key Features

- **🔐 Dual Token Architecture (Access + Refresh Rotation)**:
  - Short-lived HMAC-SHA256 JWT access tokens.
  - Secure UUID refresh tokens persisted in PostgreSQL with expiration tracking, single-use rotation, and revocation on logout.
- **🛡️ Role-Based Access Control (RBAC)**:
  - Granular permissions with `ROLE_USER` and `ROLE_ADMIN`.
  - Protected endpoints (`/api/user/**` and `/api/admin/**`).
  - Method-level security with `@PreAuthorize`.
- **⚡ Client-Side Automatic Token Interceptor**:
  - Axios-like fetch client with queueing and retry on HTTP 401.
  - Seamless background token rotation without interrupting user workflow.
- **🎨 Modern Responsive UI**:
  - Built with Next.js 16 App Router, React 19, and Tailwind CSS 4.
  - Dark/Light aesthetic, live token inspector, interactive endpoint tester, and 1-click test credential quick-fill.
- **📖 OpenAPI 3 / Swagger UI Documentation**:
  - Interactive API documentation hosted at `/swagger-ui.html`.
- **🧪 Comprehensive Test Suite**:
  - 19 automated unit and integration tests covering authentication, RBAC, JWT validation, and token rotation.
- **🐳 Multi-Stage Docker Containerization**:
  - Alpine-based multi-stage Docker build ready for zero-config Render deployment.

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
│     Next.js 16 Frontend   │                   │    Swagger / Actuator     │
│   (Vercel Production)     │                   │    Interactive Docs       │
└─────────────┬─────────────┘                   └─────────────┬─────────────┘
              │                                               │
              │ JSON REST API + Bearer JWT                    │
              ▼                                               ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         Spring Boot 4.1.1 Backend                         │
│                           (Render.com Docker)                             │
│       AuthController | UserController | AdminController | Health          │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ JDBC / SSL
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database (Render.com)                       │
│                      zephyra_auth_db (Roles & Users)                      │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Test Credentials (Pre-Seeded)

The system automatically initializes roles and safe test accounts on startup:

| Account Type | Email | Password | Assigned Role | Accessible Portals |
|---|---|---|---|---|
| **Administrator** | `admin@zephyra.com` | `Admin@123456` | `ROLE_ADMIN` | Dashboard, Admin Portal, All APIs |
| **Standard User** | `user@zephyra.com` | `User@123456` | `ROLE_USER` | Dashboard, User APIs (Admin forbidden) |

> 💡 *You can also click the **"Quick-Fill Admin"** or **"Quick-Fill User"** buttons directly on the Login page.*

---

## 📡 API Endpoints

Full API documentation with cURL commands and schemas is available in [backend/API_DOCUMENTATION.md](file:///d:/Year04/Projects/zephyra-auth/backend/API_DOCUMENTATION.md) and interactive Swagger UI.

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Application health and status check |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate and obtain access + refresh tokens |
| `POST` | `/api/auth/refresh-token` | Rotate refresh token and obtain new access token |

### Protected User Endpoints (`ROLE_USER` or `ROLE_ADMIN`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user/profile` | Retrieve authenticated user profile |
| `GET` | `/api/user/status` | Current user session status |
| `POST` | `/api/auth/logout` | Revoke active refresh token |

### Protected Admin Endpoints (`ROLE_ADMIN` only)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users` | List all registered users with roles |
| `GET` | `/api/admin/stats` | System statistics (total users, active sessions) |

---

## 💻 Local Development Setup

### Prerequisites
- **Java 21 LTS**
- **Node.js 18+** & `npm`
- **PostgreSQL** (or run with default in-memory H2 test profile)
- **Maven 3.9+**

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Adjust database credentials in .env if running local PostgreSQL
mvn clean spring-boot:run
```
The backend starts on `http://localhost:8080`.
- Health check: `http://localhost:8080/api/health`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
The frontend starts on `http://localhost:3000`.

---

## 🧪 Running Automated Tests

### Backend Test Suite
The backend contains 19 automated tests covering security filters, JWT generation, token rotation, and RBAC:
```bash
cd backend
mvn test
```
**Results**:
```
[INFO] Tests run: 19, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Frontend Build Validation
```bash
cd frontend
npm run build
```
Compiles with Turbopack and verifies all TypeScript types and static routes.

---

## 🚀 Cloud Deployment

See the comprehensive [DEPLOYMENT_GUIDE.md](file:///d:/Year04/Projects/zephyra-auth/DEPLOYMENT_GUIDE.md) for step-by-step instructions:
- **Render.com**: Backend Web Service with Docker + Render Managed PostgreSQL
- **Vercel**: Next.js App Router deployment
- **Environment variables reference & troubleshooting**

---

## 📄 Submission File

The official submission artifact required for the assessment is located at:
👉 [submission.txt](file:///d:/Year04/Projects/zephyra-auth/submission.txt)

---

## 👤 Author
- **Prasannna Dilshan**
- GitHub: [@prasannadilshan](https://github.com/prasannadilshan)
