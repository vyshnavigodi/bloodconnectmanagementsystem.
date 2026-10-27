# BloodConnect — Full-Stack Blood Bank Management System

> **"Every Drop Counts. Every Life Matters."**

BloodConnect is an advanced full-stack blood bank and emergency transfusion management platform. Designed with real-time stock telemetry, cryptographic certificate verification, 3D interactive hero visualization, and automated emergency donor alert dispatches, BloodConnect seamlessly connects certified voluntary donors, recipient patients, regional blood banks, and hospital trauma centers.

---

## 🌟 Key Features

### 1. Interactive 3D Landing & Discovery
- **3D Hero Visualization**: WebGL-powered 3D blood drop with organic fluid distortion built using Three.js, React Three Fiber, and Drei, featuring graceful CSS/SVG fallback for unsupported hardware.
- **Multilingual Interface**: Complete localization support in English (`en`), Telugu (`te`), and Hindi (`hi`).
- **Live Inventory Telemetry**: Live blood unit counters across all 8 blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`).
- **Verified Facility Locator**: Directory of licensed blood banks and emergency trauma centers.
- **Voluntary Blood Donation Drives**: Upcoming camps with one-click donor registration.

### 2. Fast-Track Emergency SOS Requisition
- Instant guest & authenticated emergency requisitions.
- Automated alert broadcasting to compatible voluntary donors within the perimeter.
- Real-time stock shortage calculation and trauma status tracking.

### 3. Role-Based Dashboards & Workflows
- **Donor**: Profile management, donation history timeline, cryptographic QR-linked certificates, local emergency SOS alerts, and camp registrations.
- **Recipient / Patient**: Live blood group search with preliminary compatibility guidance, normal and emergency blood requests, real-time matching status.
- **Hospital / Blood Bank**: Regional cold-chain inventory management, batch tracking, shelf-life and near-expiry alerts, request review with atomic stock reservation and issue.
- **Administrator**: Comprehensive system health KPIs, hospital verification, user management, audit log inspections, CSV report exports, and system thresholds.

### 4. Integrity & Safety Safeguards
- **Atomic Inventory Locks**: Double-issue and negative-stock prevention via atomic MongoDB transitions.
- **Preliminary Compatibility Matrix**: Medical safety disclaimers with requirement for certified clinical cross-matching.
- **Audit Logging**: Comprehensive traceability across all registrations, logins, status changes, and unit releases.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v6.
- **3D Graphics & Animations**: Three.js, `@react-three/fiber`, `@react-three/drei`, Framer Motion.
- **Icons & Visualization**: Lucide React, Recharts.
- **Backend**: Node.js, Express 5, TypeScript (`tsx`).
- **Database**: MongoDB with Mongoose ODM.
- **Security & Auth**: JWT (JSON Web Tokens), bcryptjs password hashing, Helmet, CORS, audit logs.
- **Testing**: Node Test Runner, Supertest, Vitest.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v20.x or v24.x recommended)
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://localhost:27017` or a MongoDB Atlas URI

### 1. Installation

Install dependencies across both backend and frontend:

```bash
# In the project root:
npm run install:all
```

Or install separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Configuration

Copy the example environment files:

```bash
# In backend/
cp .env.example .env
```

Ensure your `backend/.env` has the following variables configured:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bloodconnect
JWT_SECRET=bloodconnect_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
FRONTEND_URL=http://localhost:5173
```

Ensure your `frontend/.env` has:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Seeding (Demo Data)

Seed demo accounts, blood units, camps, certificates, and hospitals:

```bash
# Start the backend and invoke the seed endpoint:
npm run seed
```

**Pre-seeded Demo Credentials:**

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@bloodconnect.org` | `Admin@123` |
| **Donor** | `donor@bloodconnect.org` | `Donor@123` |
| **Patient / Recipient** | `patient@bloodconnect.org` | `Patient@123` |
| **Hospital Staff** | `hospital@bloodconnect.org` | `Hospital@123` |
| **Lab Staff** | `staff@bloodconnect.org` | `Staff@123` |

### 4. Running Development Servers

Run backend and frontend:

```bash
# Terminal 1 - Backend API (runs on port 5000):
cd backend
npm run dev

# Terminal 2 - Frontend Application (runs on port 5173):
cd frontend
npm run dev
```

Visit the application at: **`http://localhost:5173`**
API Health Check at: **`http://localhost:5000/health`**

---

## 🧪 Testing & Verification

Run the automated backend test suite (covers 19 comprehensive test cases including auth, role permissions, emergency SOS dispatch, hospital verification, atomic inventory issue, and CSV reports):

```bash
cd backend
npm test
```

Build production assets:

```bash
# Backend TypeScript build:
cd backend
npm run build

# Frontend Vite production build:
cd frontend
npm run build
```

---

## 📁 Project Structure

```text
bloodconnect/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration (MongoDB / Mongoose)
│   │   ├── controllers/     # API request handlers (Auth, Inventory, Requests, Camps...)
│   │   ├── middleware/      # Authentication, role-based authorization, error handlers
│   │   ├── models/          # Mongoose schemas (User, BloodUnit, BloodRequest, Certificate...)
│   │   ├── routes/          # Express route definitions
│   │   ├── tests/           # Automated API integration tests (Node Test Runner + Supertest)
│   │   ├── utils/           # ID generators, logger, audit helpers
│   │   ├── app.ts           # Express application setup
│   │   └── server.ts        # Entry point and DB connection listener
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI cards, badges, spinners, NotificationBell
│   │   ├── contexts/        # AuthContext (JWT management, profile hydration)
│   │   ├── layouts/         # DashboardLayout (role-aware navigation), AuthLayout
│   │   ├── pages/           # Landing, Search, Emergency, Camps, Notifications, Dashboards, 404
│   │   ├── services/        # Axios API client
│   │   ├── App.tsx          # React Router route registry
│   │   └── main.tsx         # React application root
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🔒 Security & Medical Protocol Notice

1. **Authentication**: All protected endpoints enforce signed JSON Web Tokens. Passwords are encrypted with bcrypt (12 rounds).
2. **Medical Disclaimers**: Preliminary blood group compatibility algorithms are intended solely for logistical planning. Transfusions must be verified via accredited laboratory cross-matching by certified medical practitioners.
3. **No Secrets in Repo**: Environment configuration (`.env`) is excluded via `.gitignore`.
