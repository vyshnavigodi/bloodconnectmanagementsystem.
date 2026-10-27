# BloodConnect Architecture, Database Design, API Plan & Implementation Blueprint

> **Smart Multilingual Blood Bank Management, Emergency Matching, Certification & Traceability Platform**  
> BTech CSE Final-Year Capstone Project Specification & Technical Roadmap

---

## 1. System Overview & Core Objectives

**BloodConnect** is an enterprise-grade, full-stack healthcare coordination platform designed to eliminate blood supply fragmentation, expedite emergency matching, uphold rigorous regulatory safety workflows, provide end-to-end digital traceability with cryptographic verification, and forecast localized blood demand using machine learning.

### Core Workflow Pipeline
```
[ REGISTERED DONOR ]
        │
        ▼
[ DONATION INTAKE (Staff Recorded) ]  ───►  Generates: DON-2026-XXXXXX & BLD-2026-XXXXXX
        │
        ▼
[ AUTHORIZED TESTING RECORD ]        ───►  ABO/Rh Confirmation & Mandatory Screening
        │                                  (Pending ➔ Under Review ➔ Passed / Failed)
        ▼
[ DIGITAL CERTIFICATION ]            ───►  Generates: CERT-2026-XXXXXX + SHA-256 Hash + QR
        │
        ▼
[ ACTIVE INVENTORY (Slot Tracked) ]  ───►  Status: AVAILABLE (Monitored for Expiry/Low Stock)
        │
        ▼
[ PATIENT / HOSPITAL REQUEST ]       ───►  Normal / Urgent / 🚨 EMERGENCY
        │
        ▼
[ COMPATIBILITY & STOCK CHECK ]      ───►  Admin-Configured ABO/Rh Matrix + Component Matching
        │                                  Displays: Required, Available, Reserved, Shortage
        ▼
[ ATOMIC RESERVATION ]               ───►  AVAILABLE ➔ RESERVED (Prevents Double-Booking)
        │
        ▼
[ AUTHORIZED BLOOD ISSUE ]           ───►  RESERVED ➔ ISSUED (Generates ISS-2026-XXXXXX)
        │
        ▼
[ COMPLETE TRACEABILITY AUDIT ]      ───►  Interactive Timeline + Public QR Verification
```

---

## 2. Medical Safety & Clinical Governance Boundaries

BloodConnect strictly implements **software management, authorization, and chain-of-custody tracking**. It is **NOT** a clinical diagnostic or medical advice platform.

| Clinical Boundary | Platform Implementation Standard |
| :--- | :--- |
| **No Diagnostic Claims** | The system does not test blood or perform medical diagnostic reasoning. Authorized laboratory staff manually input verified physical laboratory results. |
| **No AI Medical Decisions** | The Python AI microservice is restricted to **demand forecasting** (predicting monthly consumption based on historical counts). AI is explicitly barred from assessing donor suitability, patient compatibility, or clinical eligibility. |
| **Deterministic Compatibility** | Transfusion compatibility uses an administrator-auditable, rule-based configuration matrix based on standard hematological guidelines (e.g., AABB/WHO standards), stored in the database and reviewed by blood bank supervisors. |
| **Data Privacy & Sanitization** | Public QR verification displays *only* non-sensitive certificate validity, Blood Unit ID, blood group, component, and issuance status. Donor names, contact numbers, residential coordinates, and recipient clinical details are strictly redacted. |
| **No Fabricated Data** | All seeded records are explicitly marked as synthetic demonstration data. |

---

## 3. Technology Stack & Workspace Environment

### Inspected Environment
- **Operating System:** Windows 11 (PowerShell environment)
- **Node.js Runtime:** `v24.12.0` (LTS)
- **Package Manager:** `npm 11.6.2`
- **Python Runtime:** `Python 3.14.0` (with `pip 26.2.1`)
- **Database Service:** MongoDB Server running locally on `127.0.0.1:27017` (Active Windows Service verified)
- **Git:** `2.55.0.windows.5`

### Monorepo Stack Components
```
bloodconnect/
├── frontend/                # React 18 + Vite + TypeScript
│   ├── UI Framework:         Tailwind CSS v3 + Radix UI / shadcn style components
│   ├── Routing:              React Router DOM v6
│   ├── State & Forms:        React Hook Form + Zod + React Context (Auth, Language, Theme)
│   ├── Icons:                Lucide React
│   ├── Charts:               Recharts
│   ├── Localization:         i18next + react-i18next (English, Telugu, Hindi)
│   ├── Voice Recognition:    Web Speech API with manual confirmation fallback
│   └── Maps:                 Leaflet + React-Leaflet / OpenStreetMap tiles
│
├── backend/                 # Node.js + Express + TypeScript
│   ├── Database Layer:       MongoDB 7.x + Mongoose 8.x
│   ├── Security:             Helmet, CORS, express-rate-limit, bcryptjs, jsonwebtoken
│   ├── Validation:           Zod request schema validation middleware
│   ├── QR & Cryptography:    qrcode, Node crypto (SHA-256 digest)
│   ├── PDF Generation:       PDFKit with healthcare certificate templates
│   └── Logging & Audit:      Morgan + Winston + Mongo AuditLog collection
│
├── ai-service/              # Python 3.14 + FastAPI + Uvicorn
│   ├── Machine Learning:     scikit-learn (Ridge / Random Forest Regressor), pandas, numpy
│   ├── Synthetic Data:       Realistic hospital blood consumption simulation
│   └── API Integration:      REST endpoint `/predict-demand` consumed by Express backend
│
├── docs/                    # Architecture, API, Database, Security & User Flow manuals
├── scripts/                 # Synthetic database seeding, test runners, dev scripts
├── .env.example             # Centralized environment variable template
├── README.md                # Comprehensive documentation and evaluation instructions
└── docker-compose.yml       # Production-ready multi-container orchestration
```

---

## 4. Role-Based Access Control (RBAC) Matrix

| Feature / Action | DONOR | PATIENT / RECIPIENT | HOSPITAL | BLOOD BANK STAFF | ADMIN | PUBLIC (ANON) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Self Registration & Login** | ✅ | ✅ | ✅ | Staff Created | Pre-seeded | ✅ (Verify only) |
| **Manage Personal Profile** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **View Donation History** | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **View Digital Certificates** | ✅ (Own) | ❌ | ❌ | ✅ (All) | ✅ (All) | ❌ |
| **Public QR Certificate Verification** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (Sanitized) |
| **Create Blood Request** | ❌ | ✅ (Personal) | ✅ (Institutional)| ❌ | ✅ | ❌ |
| **Track Request & Shortage Status**| ❌ | ✅ (Own) | ✅ (Own) | ✅ | ✅ | ❌ |
| **Record Physical Donation** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Record Laboratory Test Results** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Certify Blood Unit** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Manage Inventory & Slots** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Reserve Blood Units** | ❌ | ❌ | ✅ (Via Request) | ✅ | ✅ | ❌ |
| **Issue Blood Unit** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **View Unit Traceability Timeline** | ❌ | ❌ | ✅ (Issued units) | ✅ | ✅ | ❌ |
| **Emergency Broadcast Response** | ✅ (Accept/Decline)| ❌ | ❌ | ❌ | ❌ | ❌ |
| **Configure Compatibility & Thresholds**| ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Audit Logs & Analytics** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## 5. Comprehensive Database Design (Mongoose Models)

All models will reside in `backend/src/models/` with TypeScript interfaces, automated timestamps, schema indexes, and pre/post middleware hooks.

```
                  ┌──────────────────────┐
                  │         User         │
                  └──────────┬───────────┘
                             │ 1:1
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
   ┌─────────┐         ┌───────────┐        ┌───────────┐
   │  Donor  │         │  Patient  │        │ Hospital  │
   └────┬────┘         └─────┬─────┘        └─────┬─────┘
        │ 1:N                │ 1:N                │ 1:N
        ▼                    ▼                    ▼
   ┌──────────┐        ┌──────────────────────────────┐
   │ Donation │        │         BloodRequest         │
   └────┬─────┘        └──────────────┬───────────────┘
        │ 1:1                         │ 1:N
        ▼                             ▼
   ┌───────────┐               ┌─────────────┐
   │ BloodUnit │◄──────────────┤ Reservation │
   └────┬──────┤               └──────┬──────┘
        │      │                      │ 1:1
        │      │ 1:1                  ▼
        │      ├──────────────►┌─────────────┐
        │      │               │ BloodIssue  │
        │      ▼               └─────────────┘
        │ ┌───────────┐
        ├─┤ BloodTest │
        │ └───────────┘
        │ 1:1
        ▼
   ┌─────────────┐             ┌──────────────────────┐
   │ Certificate │             │ InventoryTransaction │
   └─────────────┘             └──────────────────────┘
```

### 1. `User` Schema
- `_id`: ObjectId
- `email`: String (Unique, Indexed, Trimmed, Lowercase)
- `passwordHash`: String (Bcrypt salted)
- `role`: Enum `['DONOR', 'PATIENT', 'HOSPITAL', 'STAFF', 'ADMIN']`
- `fullName`: String
- `phoneNumber`: String (Trimmed)
- `preferredLanguage`: Enum `['en', 'te', 'hi']` (Default: `'en'`)
- `isActive`: Boolean (Default: `true`)
- `profileCompleted`: Boolean (Default: `false`)
- `lastLoginAt`: Date
- `createdAt`, `updatedAt`: Timestamps

### 2. `Donor` Schema
- `userId`: ObjectId (Ref: `User`, Indexed, Unique)
- `donorId`: String (e.g., `DNR-2026-000123`, Unique, Indexed)
- `bloodGroup`: Enum `['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']` (Indexed)
- `dateOfBirth`: Date
- `gender`: Enum `['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']`
- `address`: { `street`: String, `city`: String, `state`: String, `postalCode`: String }
- `areaCoordinates`: { `lat`: Number, `lng`: Number } *(generalized, approximate only)*
- `lastDonationDate`: Date (Nullable)
- `eligibilityStatus`: Enum `['ELIGIBLE', 'TEMPORARILY_DEFERRED', 'PERMANENTLY_DEFERRED']` (Recorded by staff)
- `deferralReason`: String (Optional)
- `deferralUntil`: Date (Optional)
- `notificationPreferences`: { `email`: Boolean, `sms`: Boolean, `emergencyPush`: Boolean }
- `totalDonationsCount`: Number (Default: `0`)

### 3. `Patient` Schema
- `userId`: ObjectId (Ref: `User`, Indexed, Unique)
- `patientIdentifier`: String (e.g., `PAT-2026-000456`, Unique, Indexed)
- `hospitalAffiliation`: ObjectId (Ref: `Hospital`, Nullable)
- `bloodGroup`: Enum `['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']`
- `emergencyContact`: { `name`: String, `relationship`: String, `phone`: String }

### 4. `Hospital` Schema
- `userId`: ObjectId (Ref: `User`, Indexed)
- `hospitalId`: String (e.g., `HSP-2026-000012`, Unique, Indexed)
- `name`: String (Indexed)
- `licenseNumber`: String (Unique)
- `address`: { `street`: String, `city`: String, `state`: String, `postalCode`: String }
- `coordinates`: { `lat`: Number, `lng`: Number }
- `contactPhone`: String
- `emergencyHelpline`: String
- `isVerified`: Boolean (Default: `true`)

### 5. `BloodBank` Schema
- `bloodBankId`: String (e.g., `BBK-2026-000001`, Unique, Indexed)
- `name`: String
- `licenseNumber`: String (Unique)
- `address`: { `street`: String, `city`: String, `state`: String, `postalCode`: String }
- `coordinates`: { `lat`: Number, `lng`: Number }
- `contactPhone`: String
- `storageCapacityUnits`: Number
- `isActive`: Boolean (Default: `true`)

### 6. `Donation` Schema
- `donationId`: String (Format: `DON-2026-XXXXXX`, Unique, Indexed)
- `donorId`: ObjectId (Ref: `Donor`, Indexed)
- `bloodBankId`: ObjectId (Ref: `BloodBank`, Indexed)
- `staffUserId`: ObjectId (Ref: `User`)
- `bloodGroup`: Enum `['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']`
- `componentType`: Enum `['WHOLE_BLOOD', 'PACKED_RED_CELLS', 'PLATELETS', 'FRESH_FROZEN_PLASMA', 'CRYOPRECIPITATE']`
- `volumeMl`: Number (e.g., `450`)
- `collectionDate`: Date (Indexed)
- `collectionLocation`: String
- `status`: Enum `['COLLECTED', 'UNDER_TESTING', 'PROCESSED', 'REJECTED']`
- `remarks`: String

### 7. `BloodUnit` Schema *(Core Lifecycle Entity)*
- `bloodUnitId`: String (Format: `BLD-2026-XXXXXX`, Unique, Indexed)
- `donationId`: ObjectId (Ref: `Donation`, Indexed)
- `bloodBankId`: ObjectId (Ref: `BloodBank`, Indexed)
- `bloodGroup`: Enum `['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']` (Indexed)
- `component`: Enum `['WHOLE_BLOOD', 'PACKED_RED_CELLS', 'PLATELETS', 'FRESH_FROZEN_PLASMA', 'CRYOPRECIPITATE']` (Indexed)
- `volumeMl`: Number
- `collectionDate`: Date (Indexed)
- `expiryDate`: Date (Indexed)
- `status`: Enum `['DONATED', 'UNDER_TESTING', 'CERTIFIED', 'AVAILABLE', 'RESERVED', 'ISSUED', 'EXPIRED', 'REJECTED']` (Indexed)
- `testRecordId`: ObjectId (Ref: `BloodTest`, Nullable)
- `certificateId`: ObjectId (Ref: `Certificate`, Nullable)
- `storageSlot`: String (e.g., `Refrigeration-Unit-B3-Rack-4`)
- `reservedForRequestId`: ObjectId (Ref: `BloodRequest`, Nullable)
- `issuedAt`: Date (Nullable)

### 8. `BloodTest` Schema *(Authorized Testing Record)*
- `testRecordId`: String (Format: `TST-2026-XXXXXX`, Unique, Indexed)
- `bloodUnitId`: ObjectId (Ref: `BloodUnit`, Unique, Indexed)
- `staffUserId`: ObjectId (Ref: `User`, Indexed)
- `aboRhConfirmed`: Boolean
- `confirmedBloodGroup`: Enum `['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']`
- `screenings`: {
    `hivI_II`: Enum `['NEGATIVE', 'POSITIVE', 'INCONCLUSIVE']`,
    `hbcAg`: Enum `['NEGATIVE', 'POSITIVE', 'INCONCLUSIVE']`,
    `hcv`: Enum `['NEGATIVE', 'POSITIVE', 'INCONCLUSIVE']`,
    `syphilisVDRL`: Enum `['NON_REACTIVE', 'REACTIVE']`,
    `malariaParasite`: Enum `['NOT_DETECTED', 'DETECTED']`
  }
- `overallResult`: Enum `['PENDING', 'UNDER_REVIEW', 'PASSED', 'FAILED', 'REQUIRES_REVIEW']` (Indexed)
- `testDate`: Date
- `laboratoryTechnicianName`: String
- `staffVerificationNotes`: String

### 9. `Certificate` Schema *(Cryptographic Chain of Custody)*
- `certificateId`: String (Format: `CERT-2026-XXXXXX`, Unique, Indexed)
- `bloodUnitId`: ObjectId (Ref: `BloodUnit`, Unique, Indexed)
- `bloodUnitCode`: String (e.g., `BLD-2026-XXXXXX`, Indexed)
- `bloodGroup`: String
- `component`: String
- `collectionDate`: Date
- `expiryDate`: Date
- `certificationDate`: Date
- `authorizedBloodBank`: { `id`: ObjectId, `name`: String, `license`: String }
- `certifyingStaff`: { `id`: ObjectId, `name`: String, `role`: String }
- `sha256IntegrityHash`: String (Indexed)
- `qrVerificationUrl`: String
- `status`: Enum `['VALID', 'REVOKED', 'SUPERSEDED']` (Indexed)
- `pdfUrl`: String (Generated downloadable receipt path)

### 10. `BloodRequest` Schema
- `requestId`: String (Format: `REQ-2026-XXXXXX`, Unique, Indexed)
- `requesterRole`: Enum `['PATIENT', 'HOSPITAL', 'ADMIN']`
- `requesterUserId`: ObjectId (Ref: `User`, Indexed)
- `patientName`: String
- `hospitalId`: ObjectId (Ref: `Hospital`, Indexed)
- `bloodGroup`: Enum `['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']` (Indexed)
- `component`: Enum `['WHOLE_BLOOD', 'PACKED_RED_CELLS', 'PLATELETS', 'FRESH_FROZEN_PLASMA', 'CRYOPRECIPITATE']`
- `unitsRequired`: Number (Min: 1)
- `unitsAvailableSnapshot`: Number (Default: 0)
- `unitsReserved`: Number (Default: 0)
- `unitsIssued`: Number (Default: 0)
- `shortageUnits`: Number (Computed)
- `urgency`: Enum `['NORMAL', 'URGENT', 'EMERGENCY']` (Indexed)
- `requiredDate`: Date
- `clinicalReason`: String
- `contactPhone`: String
- `status`: Enum `['PENDING', 'MATCHING', 'PARTIALLY_AVAILABLE', 'AVAILABLE', 'RESERVED', 'FULFILLED', 'CANCELLED', 'EXPIRED']` (Indexed)
- `donorAlertBroadcasted`: Boolean (Default: false)

### 11. `Reservation` Schema
- `reservationId`: String (Format: `RES-2026-XXXXXX`, Unique, Indexed)
- `requestId`: ObjectId (Ref: `BloodRequest`, Indexed)
- `bloodUnitId`: ObjectId (Ref: `BloodUnit`, Unique, Indexed)
- `hospitalId`: ObjectId (Ref: `Hospital`, Indexed)
- `authorizedByStaffId`: ObjectId (Ref: `User`)
- `reservedAt`: Date (Default: `Date.now`)
- `expiresAt`: Date (Default: `Date.now + 24 hours`, Indexed)
- `status`: Enum `['ACTIVE', 'FULFILLED', 'CANCELLED', 'EXPIRED']` (Indexed)

### 12. `BloodIssue` Schema
- `issueId`: String (Format: `ISS-2026-XXXXXX`, Unique, Indexed)
- `reservationId`: ObjectId (Ref: `Reservation`, Indexed)
- `requestId`: ObjectId (Ref: `BloodRequest`, Indexed)
- `bloodUnitId`: ObjectId (Ref: `BloodUnit`, Unique, Indexed)
- `hospitalId`: ObjectId (Ref: `Hospital`, Indexed)
- `issuedByStaffId`: ObjectId (Ref: `User`)
- `recipientIdentityCardNo`: String (Masked/Redacted)
- `issuedDate`: Date (Default: `Date.now`, Indexed)
- `status`: Enum `['DISPATCHED', 'DELIVERED', 'TRANSFUSED', 'RETURNED_DAMAGED']`
- `handoverRemarks`: String

### 13. `InventoryTransaction` Schema *(Immutable Ledger)*
- `transactionId`: String (Format: `TXN-2026-XXXXXX`, Unique, Indexed)
- `bloodUnitId`: ObjectId (Ref: `BloodUnit`, Indexed)
- `actionType`: Enum `['DONATION_INTAKE', 'TEST_RECORDED', 'CERTIFIED', 'MARKED_AVAILABLE', 'RESERVED', 'RELEASED_RESERVATION', 'ISSUED', 'MARKED_EXPIRED', 'DISCARDED_REJECTED']`
- `previousStatus`: String
- `newStatus`: String
- `performedByUserId`: ObjectId (Ref: `User`)
- `timestamp`: Date (Default: `Date.now`, Indexed)
- `notes`: String

### 14. `Notification` Schema
- `notificationId`: String (Unique, Indexed)
- `recipientUserId`: ObjectId (Ref: `User`, Indexed)
- `title`: String
- `message`: String
- `type`: Enum `['EMERGENCY_ALERT', 'LOW_STOCK', 'EXPIRY_WARNING', 'DONATION_INVITE', 'REQUEST_UPDATE', 'SYSTEM']`
- `urgency`: Enum `['INFO', 'WARNING', 'CRITICAL']`
- `isRead`: Boolean (Default: `false`, Indexed)
- `actionLink`: String (Optional)
- `metadata`: Schema.Types.Mixed

### 15. `AuditLog` Schema
- `logId`: String (Unique, Indexed)
- `userId`: ObjectId (Ref: `User`, Nullable for public QR calls)
- `userRole`: String
- `action`: String (e.g., `DONATION_CREATED`, `UNIT_CERTIFIED`, `UNIT_RESERVED`, `PUBLIC_QR_VERIFIED`)
- `entityType`: String
- `entityId`: String
- `ipAddress`: String
- `userAgent`: String
- `beforeState`: Schema.Types.Mixed
- `afterState`: Schema.Types.Mixed
- `timestamp`: Date (Default: `Date.now`, Indexed)

### 16. `DemandForecast` Schema
- `forecastMonth`: String (e.g., `2026-10`, Indexed)
- `bloodGroup`: Enum `['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']` (Indexed)
- `component`: String
- `predictedDemandMin`: Number
- `predictedDemandMax`: Number
- `confidenceScore`: Number
- `trainedModelVersion`: String
- `generatedAt`: Date

### 17. `SystemSetting` Schema
- `key`: String (Unique, Indexed)
- `value`: Schema.Types.Mixed
- `category`: Enum `['COMPATIBILITY', 'INVENTORY', 'ALERTS', 'SECURITY']`
- `description`: String
- `updatedBy`: ObjectId (Ref: `User`)
- `updatedAt`: Date

---

## 6. Comprehensive REST API Specifications

All endpoints prefix: `/api`  
Standard Response Wrapper:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2026-09-23T08:30:00.000Z"
}
```

### Module 1: Authentication & Users (`/api/auth`, `/api/users`)
- `POST /api/auth/register` — Register new Donor or Patient (Validates role, hashes password with bcrypt)
- `POST /api/auth/login` — Authenticate user, issue JWT with embedded role and user ID
- `POST /api/auth/logout` — Invalidate session/clear auth cookie
- `GET /api/auth/me` — Return currently authenticated user profile
- `POST /api/auth/forgot-password` — Initiate password recovery token
- `POST /api/auth/reset-password` — Verify token and update password
- `GET /api/users` — Admin view of all users with search & role filters
- `PATCH /api/users/:id/status` — Admin toggle user active/deactivated
- `PATCH /api/users/profile` — Update logged in user profile & language preference

### Module 2: Donors & Registrations (`/api/donors`)
- `GET /api/donors/profile` — Get donor profile, donation stats, eligibility status
- `PUT /api/donors/profile` — Update address, language, notification preferences
- `GET /api/donors/donations` — Get historical donations for the logged-in donor
- `GET /api/donors/certificates` — Get certificates associated with donor's units
- `GET /api/donors/eligible-alerts` — List emergency requests matching donor blood group/area
- `POST /api/donors/alerts/:id/respond` — Accept or decline an emergency donation notification

### Module 3: Donations & Intake (`/api/donations`)
- `POST /api/donations` — Blood Bank Staff records physical donation; auto-generates `DON-2026-XXXXXX` and creates initial `BloodUnit` (`BLD-2026-XXXXXX`) in `DONATED` status
- `GET /api/donations` — Search & list donations with filters (Date range, blood bank, blood group)
- `GET /api/donations/:id` — View full donation details with donor reference

### Module 4: Laboratory Testing Records (`/api/blood-tests`)
- `POST /api/blood-tests` — Staff logs physical lab results for a unit (ABO/Rh, HIV, HBV, HCV, Syphilis, Malaria)
- `GET /api/blood-tests/:bloodUnitId` — Retrieve test record for a specific unit
- `PATCH /api/blood-tests/:id/review` — Senior supervisor reviews testing results; marks `PASSED` or `FAILED`
  - If `PASSED` ➔ BloodUnit status updates to `UNDER_TESTING` completed, ready for certification
  - If `FAILED` ➔ BloodUnit status immediately transitions to `REJECTED`, moved to quarantine ledger

### Module 5: Certification & QR Verification (`/api/certificates`)
- `POST /api/certificates/certify` — Staff certifies a passed unit:
  - Generates `CERT-2026-XXXXXX`
  - Computes SHA-256 integrity hash over `[UnitId + BloodGroup + Expiry + BloodBankLicense]`
  - Generates public QR data URL pointing to `/verify/:certificateId`
  - Transitions BloodUnit to `AVAILABLE` inventory
- `GET /api/certificates/:id` — View full certificate details (Role-protected)
- `GET /api/certificates/:id/pdf` — Stream generated PDF certificate document
- `GET /api/certificates/public/verify/:certificateId` — **PUBLIC ENDPOINT (No Auth Required)**:
  - Validates certificate ID and recalculates SHA-256 hash
  - Returns strictly sanitized payload: `{ certificateId, bloodUnitId, bloodGroup, component, collectionDate, expiryDate, status, verified: true }`
  - Explicitly filters out donor name, donor phone, hospital recipient, or internal notes
  - Records an entry in `AuditLog`

### Module 6: Blood Inventory & Management (`/api/inventory`)
- `GET /api/inventory` — Query available stock with pagination & filters (group, component, status, expiry)
- `GET /api/inventory/summary` — Aggregate counts by blood group & component (Total, Certified, Reserved, Expiring)
- `GET /api/inventory/expiring` — Filter units expiring within next 7 days / today / already expired
- `GET /api/inventory/low-stock` — Compute current stock vs. admin minimum thresholds
- `PATCH /api/inventory/:bloodUnitId/slot` — Update storage rack/slot location
- `POST /api/inventory/:bloodUnitId/discard` — Manually record disposal of expired or damaged units

### Module 7: Patient & Hospital Blood Requests (`/api/blood-requests`)
- `POST /api/blood-requests` — Patient or Hospital creates blood request:
  - Computes immediate snapshot: `{ unitsRequired, unitsAvailable, unitsReserved, shortage }`
  - If `shortage > 0` and urgency is `EMERGENCY` ➔ triggers donor broadcast alert
- `GET /api/blood-requests` — List requests (filtered by user role: Hospital sees own, Staff/Admin sees all)
- `GET /api/blood-requests/:id` — Detailed request view with matched candidates
- `PATCH /api/blood-requests/:id/cancel` — Cancel pending request

### Module 8: Smart Compatibility & Matching Engine (`/api/matches`)
- `GET /api/matches/check` — Query compatible units for a given request:
  - Reads active Blood Group Compatibility Matrix from `SystemSetting`
  - Filters `BloodUnit` where `status == 'AVAILABLE'` AND `expiryDate > Date.now()`
  - Ranks by earliest expiry (FIFO / FEFO: First-Expiry-First-Out)
  - Returns `{ matchedUnits: [...], availableQuantity: N, shortage: M }`

### Module 9: Reservation Module (`/api/reservations`)
- `POST /api/reservations` — Authorized staff reserves matched units for an active request:
  - Executes **Atomic MongoDB Transaction** with `findOneAndUpdate` on each unit
  - Verifies status is strictly `AVAILABLE` before updating to `RESERVED`
  - Sets `reservedForRequestId` and `expiresAt` (default: 24h timeout)
  - Updates `BloodRequest` status to `RESERVED` or `PARTIALLY_AVAILABLE`
  - Prevents race conditions and duplicate allocations
- `DELETE /api/reservations/:id` — Release reservation back to `AVAILABLE`

### Module 10: Blood Issue Module (`/api/issues`)
- `POST /api/issues` — Staff issues reserved blood unit to hospital courier/representative:
  - Transitions `BloodUnit` from `RESERVED` to `ISSUED`
  - Creates `BloodIssue` record with `ISS-2026-XXXXXX`
  - Generates immutable `InventoryTransaction` & `AuditLog`
  - Updates parent `BloodRequest` to `FULFILLED` if all units dispatched
- `GET /api/issues` — View dispatched blood unit history

### Module 11: Traceability Timeline (`/api/blood-units/:id/traceability`)
- `GET /api/blood-units/:id/traceability` — Fetches full lifecycle timeline for a Blood Unit:
  1. Intake (`DON-2026-XXXXXX` recorded at Blood Bank)
  2. Testing (`TST-2026-XXXXXX` screenings recorded and passed)
  3. Certification (`CERT-2026-XXXXXX` digital certificate created with hash)
  4. Inventory Placement (Allocated to Storage Slot)
  5. Reservation (`RES-2026-XXXXXX` tagged for Request)
  6. Issue (`ISS-2026-XXXXXX` dispatched to Hospital)

### Module 12: Emergency Broadcasts & Notifications (`/api/notifications`)
- `GET /api/notifications` — Fetch user unread and historical notifications
- `PATCH /api/notifications/:id/read` — Mark notification as read
- `POST /api/notifications/broadcast-emergency` — Trigger notification push to compatible eligible donors

### Module 13: Analytics, Reports & AI Demand (`/api/analytics`, `/api/reports`, `/api/ai`)
- `GET /api/analytics/kpis` — Real-time KPIs: Donors, Donations, Certified Units, Available, Reserved, Shortages
- `GET /api/analytics/charts` — Aggregated time-series for Recharts (Monthly intake vs. demand, group distributions)
- `GET /api/reports/:reportType/csv` — Stream CSV report (Inventory, Donations, Requests, Issues, Audit)
- `GET /api/reports/:reportType/pdf` — Stream PDF formatted summary report
- `GET /api/ai/forecast` — Express calls FastAPI AI service; returns 30-day demand predictions with confidence bounds

### Module 14: System Settings & Compatibility (`/api/settings`, `/api/audit-logs`)
- `GET /api/settings/compatibility-matrix` — Get standard ABO/Rh compatibility rules
- `PUT /api/settings/compatibility-matrix` — Admin modifies compatibility matrix
- `GET /api/settings/thresholds` — Get low-stock minimum thresholds
- `PUT /api/settings/thresholds` — Admin sets minimum inventory levels per blood group
- `GET /api/audit-logs` — Admin paginated audit trail with filter by user, role, entity, and date

---

## 7. Deterministic Compatibility Configuration Matrix

Whole Blood & Red Blood Cell (RBC) Default Matrix:
```json
{
  "O-":  ["O-"],
  "O+":  ["O+", "O-"],
  "A-":  ["A-", "O-"],
  "A+":  ["A+", "A-", "O+", "O-"],
  "B-":  ["B-", "O-"],
  "B+":  ["B+", "B-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"]
}
```
*Note: Stored in `SystemSetting` model. Platelet and Plasma compatibility inverted mappings are configured independently and can be inspected/edited by Admins.*

---

## 8. Frontend Architecture & Page Layouts

### Design System & Theme
- **Color Palette:**
  - Primary Accent: Deep Crimson `#DC2626` / `#991B1B` (Medical Cross / Blood Identity)
  - Surface Background: Clean Slate `#F8FAFC` / Pure White `#FFFFFF`
  - Typography: Deep Navy Slate `#0F172A` / `#334155` (High contrast, readable)
  - Status Indicators: Emerald Green `#059669` (Available/Valid), Amber `#D97706` (Reserved/Expiring), Rose/Red `#E11D48` (Emergency/Shortage/Rejected)
- **Component Primitives:** Rounded cards (`rounded-xl`), crisp data tables with sort/filter headers, responsive dialogs/modals, floating emergency action badges, and accessible form controls.

### Page Directory & Route Layout
```
frontend/src/
├── pages/
│   ├── public/
│   │   ├── LandingPage.tsx           # Hero, live blood shortage counter, why donate, mission
│   │   ├── LoginPage.tsx             # Role-aware login with quick demo account selector
│   │   ├── RegisterPage.tsx          # Donor / Patient signup with language picker
│   │   ├── CertificateVerifyPage.tsx # Public /verify/:certificateId (Clean verified badge or alert)
│   │   └── BloodBankLocatorPage.tsx  # Interactive Leaflet map of blood banks & facilities
│   │
│   ├── donor/
│   │   ├── DonorDashboard.tsx        # Donation streak, next eligible date, digital donor card
│   │   ├── DonorHistoryPage.tsx      # Past donations with linked certificates
│   │   ├── DonorCertificatesPage.tsx # Digital certificate gallery with PDF download
│   │   ├── DonorAlertsPage.tsx       # Emergency blood calls with Accept/Decline actions
│   │   └── DonorProfilePage.tsx      # Edit preferences, language, medical flags
│   │
│   ├── patient/
│   │   ├── PatientDashboard.tsx      # Active requests, shortage calculator, matched alerts
│   │   ├── CreateRequestPage.tsx     # Blood request form with optional Voice Input draft tool
│   │   ├── RequestTrackingPage.tsx   # Visual status tracker (Pending ➔ Matched ➔ Reserved ➔ Issued)
│   │   └── PatientProfilePage.tsx
│   │
│   ├── hospital/
│   │   ├── HospitalDashboard.tsx     # Hospital KPIs, active quotas, reserved units
│   │   ├── HospitalRequestsPage.tsx  # Batch institutional requests with urgency toggles
│   │   ├── HospitalInventoryPage.tsx # Live available stock across regional blood banks
│   │   └── HospitalIssuedBlood.tsx   # Received units with unit IDs and handover receipts
│   │
│   ├── staff/
│   │   ├── StaffDashboard.tsx        # Daily intake queue, pending tests, urgent reservations
│   │   ├── DonationIntakePage.tsx    # Record physical donation (Assigns DON & BLD IDs)
│   │   ├── TestingEntryPage.tsx      # Enter lab screening results (ABO confirmation, HIV, HCV...)
│   │   ├── CertificationPage.tsx     # Review tested units, sign & issue digital certificates
│   │   ├── InventoryManagementPage.tsx # Slot allocation, FEFO sorting, expiry warnings
│   │   ├── ReservationConsolePage.tsx # Match requests with available stock, lock units
│   │   ├── IssueBloodPage.tsx        # Discard or dispatch reserved blood with courier logging
│   │   └── TraceabilityViewerPage.tsx# Step-by-step audit timeline for any BloodUnit ID
│   │
│   └── admin/
│       ├── AdminDashboard.tsx        # System-wide analytics, inventory health, AI demand forecasts
│       ├── UserManagementPage.tsx    # Manage roles, activate/deactivate accounts
│       ├── FacilityManagementPage.tsx# Hospitals & Blood Banks licensing directory
│       ├── CompatibilityConfigPage.tsx # Editable ABO/Rh matrix configuration
│       ├── ThresholdConfigPage.tsx   # Low-stock warning trigger levels per blood group
│       ├── AuditLogViewerPage.tsx    # Filterable immutable audit logs with JSON diffs
│       └── ReportsGeneratorPage.tsx  # Downloadable CSV/PDF reports
```

### Multilingual Support (i18next)
- Supported Locales: `en` (English), `te` (Telugu - తెలుగు), `hi` (Hindi - हिन्दी)
- Translation scopes:
  - `navigation.*` (Dashboard, Inventory, Requests, Certificates, Settings)
  - `auth.*` (Login, Register, Demo credentials)
  - `donor.*` (Eligibility, Last donation, Certificate)
  - `request.*` (Required, Available, Reserved, Shortage, Urgency)
  - `emergency.*` (🚨 Emergency callouts, Broadcasts)
  - `statuses.*` (Available, Reserved, Issued, Expired, Passed, Failed)

### Voice Input Integration
- Utilizes the standard browser Web Speech API (`window.SpeechRecognition` / `window.webkitSpeechRecognition`).
- Listens to spoken prompts such as: *"I need 3 units of O positive blood urgently"*
- Natural Language Parser extracts:
  - Quantity: `3`
  - Blood Group: `O+`
  - Urgency: `URGENT` or `EMERGENCY`
- Populates the Create Request form as an editable draft. The user explicitly reviews, validates, and clicks Submit.
- Graceful fallback to conventional keyboard/dropdown input if microphone is not supported.

---

## 9. Python AI Service Architecture (`ai-service/`)

### Role & Purpose
The `ai-service` runs as an isolated microservice on `http://127.0.0.1:8000`. It provides statistical demand estimation to help blood bank directors plan collection drives before seasonal shortages occur. It has no access to diagnostic or medical decisions.

### Microservice File Structure
```
ai-service/
├── app/
│   ├── main.py                  # FastAPI application with CORS and healthcheck
│   ├── routers/
│   │   ├── forecast.py          # GET /predict-demand
│   │   └── train.py             # POST /retrain
│   ├── models/
│   │   └── demand_predictor.py  # scikit-learn model wrapper (Ridge / Random Forest)
│   ├── services/
│   │   ├── dataset_generator.py # Generates realistic historical hospital consumption data
│   │   └── preprocessor.py      # Feature engineering (Month, DayOfWeek, Group, Urgency)
│   └── schemas/
│       └── forecast_schema.py   # Pydantic input/output validation models
├── requirements.txt             # fastapi, uvicorn, scikit-learn, pandas, numpy
└── Dockerfile                   # Isolated container definition
```

### Model Feature Inputs & Output Schema
- **Features:** Month of year, Day of week, Blood group index (0–7), Component type, Historical 30-day moving average, Emergency request count.
- **Output:**
```json
{
  "bloodGroup": "O+",
  "component": "PACKED_RED_CELLS",
  "forecastPeriod": "October 2026",
  "expectedDemandMin": 42,
  "expectedDemandMax": 48,
  "averageDemand": 45.2,
  "confidenceScore": 0.89,
  "disclaimer": "Statistically generated demand projection for planning purposes. Not a medical directive."
}
```

---

## 10. Monorepo Directory Layout

```
bloodconnect/
├── .env.example
├── .gitignore
├── README.md
├── docker-compose.yml
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/               # Button, Input, Modal, Badge, Card, Table, Select
│   │   │   ├── common/           # Navbar, Sidebar, Footer, LanguageSelector, VoiceInputButton
│   │   │   ├── donor/            # DonorCard, EligibilityBadge, DonationTimeline
│   │   │   ├── inventory/        # StockGrid, ExpiryBadge, SlotEditorModal
│   │   │   ├── matching/         # ShortageCard, MatchSummaryBanner
│   │   │   ├── certificate/      # CertificateCard, QrCodeViewer, PrintPreview
│   │   │   └── map/              # BloodBankMap, FacilityPopup
│   │   ├── contexts/             # AuthContext, LanguageContext, NotificationContext
│   │   ├── hooks/                # useAuth, useSpeechRecognition, useTraceability, useInventory
│   │   ├── layouts/              # MainLayout, DashboardLayout, AuthLayout
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   ├── te.json
│   │   │   └── hi.json
│   │   ├── pages/                # Public, Donor, Patient, Hospital, Staff, Admin pages
│   │   ├── services/             # api.ts, authService, inventoryService, requestService
│   │   ├── types/                # index.ts (TypeScript interfaces for all models & states)
│   │   ├── utils/                # formatters, dateUtils, sha256Utils, constants
│   │   ├── App.tsx
│   │   └── main.tsx
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── src/
│   │   ├── config/               # db.ts, env.ts, compatibilityDefaults.ts
│   │   ├── controllers/          # auth, donor, donation, test, certificate, inventory, request...
│   │   ├── middleware/           # authGuard, roleGuard, rateLimiter, errorHandler, auditLogger
│   │   ├── models/               # 18 Mongoose models
│   │   ├── routes/               # Express modular route mounts
│   │   ├── services/             # matchingEngine, qrService, pdfService, certificateService, aiClient
│   │   ├── validators/           # Zod schemas for all incoming payloads
│   │   ├── utils/                # logger, idGenerator (DON-2026-..., BLD-2026-...), cryptoHash
│   │   ├── app.ts
│   │   └── server.ts
│   └── tests/                    # Jest/Supertest integration & unit test suites
│
├── ai-service/
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   ├── models/
│   │   ├── services/
│   │   └── schemas/
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   ├── security.md
│   ├── ai.md
│   ├── user-flows.md
│   ├── deployment.md
│   └── implementation-plan.md
│
└── scripts/
    ├── seedData.ts               # Complete synthetic database populator (all roles & states)
    ├── trainAiModel.py           # Training pipeline for demand forecasting
    └── testE2EWorkflow.ts        # Automated script verifying Demo Scenario Steps A-K
```

---

## 11. Multi-Phase Implementation Plan

### Phase 1: Architecture & Foundation (Current Step 1 Completed)
- Inspect environment and verify prerequisites (Node 24, Python 3.14, local MongoDB service on 27017).
- Design complete database schema, API contracts, RBAC matrices, and folder architecture.
- Create architectural documentation in `docs/implementation-plan.md`.

### Phase 2: Monorepo Scaffold, Database & Authentication
- Initialize `package.json` configurations for `backend/`, `frontend/`, and `ai-service/`.
- Setup Express TypeScript server with Helmet, CORS, centralized Zod validation, and MongoDB connection.
- Implement 18 Mongoose models with proper indexes.
- Implement Authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`, JWT tokens, bcrypt password hashing, and role-based guards).
- Setup Frontend Vite + Tailwind CSS + React Router + Lucide Icons.
- Seed demo users for all 5 roles (Donor, Patient, Hospital, Staff, Admin).

### Phase 3: Donor, Donation & Laboratory Testing Records
- Build Donor registration & profile management UI.
- Implement Donation recording endpoint generating `DON-2026-XXXXXX` and `BLD-2026-XXXXXX`.
- Implement Authorized Laboratory Testing Record module (`BloodTest` schema with ABO/Rh confirmation and mandatory screening results).
- Implement Staff review and certification workflow.

### Phase 4: Cryptographic Certification, QR Verification & Traceability
- Implement digital certificate generation (`CERT-2026-XXXXXX` with SHA-256 hash and dynamic QR data URL).
- Implement PDF certificate download using PDF generation library.
- Implement Public `/verify/:certificateId` public verification page with strict privacy sanitization.
- Build Interactive Traceability Timeline component showing complete chain-of-custody for any unit.

### Phase 5: Inventory Management, Compatibility Engine & Reservations
- Implement Blood Inventory Explorer with real-time filters (blood group, component, expiry, status).
- Implement Admin-auditable Blood Group Compatibility matching engine.
- Implement Patient and Hospital Blood Request creation with live calculation of Required, Available, Reserved, and Shortage units.
- Implement Atomic MongoDB Reservation transaction (preventing double-booking).
- Implement Blood Issue workflow (updating inventory to `ISSUED` and recording courier details).

### Phase 6: Emergency Matching, Donor Broadcast & Alerts
- Implement 🚨 Emergency request visual banners.
- Implement Donor Notification dispatch for shortage scenarios (matching blood group and region without exposing donor contact info).
- Implement donor action console to Accept or Decline emergency requests.
- Implement low-stock alerts and expiry monitoring dashboards.

### Phase 7: Multilingual UI, Voice Input & Map Integration
- Implement `i18next` with complete translation catalogs for English, Telugu, and Hindi.
- Implement Web Speech API voice input for natural language blood request drafting.
- Implement Leaflet / OpenStreetMap regional facility and blood bank locator.

### Phase 8: Python AI Demand Prediction Microservice
- Setup FastAPI service with `scikit-learn`.
- Generate realistic synthetic historical blood consumption dataset.
- Train regression model to predict monthly demand ranges per blood group.
- Connect Express backend to AI service and display forecasts on the Admin dashboard.

### Phase 9: Analytics, Reporting, QA & Evaluation Walkthrough
- Build comprehensive Analytics Dashboards with Recharts (KPIs, donations/requests by month, supply vs. demand).
- Implement CSV and PDF export for inventory, donations, requests, and audit logs.
- Write automated tests covering authentication, double-booking prevention, expired blood blocking, and public QR sanitization.
- Verify end-to-end Demonstration Scenario (Steps A to K).

---

## 12. End-to-End Demo Scenario Verification (Steps A – K)

The project will be verified against the exact evaluation script:
1. **Step A (Donor):** Register new donor `donor.demo@bloodconnect.org` -> Record donation intake -> Generate `DON-2026-000001` and `BLD-2026-000001`.
2. **Step B (Staff Testing):** Log authorized screening test results (Passed) -> Certify unit -> Generate `CERT-2026-000001` with SHA-256 integrity hash and QR code.
3. **Step C (Inventory):** Blood unit enters active inventory as `AVAILABLE`.
4. **Step D (Request):** Hospital submits emergency request for 3 units of `O+`.
5. **Step E (Matching):** System instantly displays breakdown: Required: 3 | Available: 1 | Reserved: 0 | Shortage: 2.
6. **Step F (Donor Broadcast):** Triggers notification to participating compatible donors in the region.
7. **Step G (Reservation):** Staff locks the 1 available unit atomically -> Unit becomes `RESERVED`.
8. **Step H (Issue):** Staff completes dispatch to hospital -> Unit status transitions to `ISSUED`.
9. **Step I (Traceability):** Open `BLD-2026-000001` timeline -> View full timestamped chronological steps from collection to issue.
10. **Step J (Public QR):** Scan certificate QR -> View `/verify/CERT-2026-000001` showing `VALID` and non-sensitive details with zero PII leaks.
11. **Step K (Analytics):** Open Admin dashboard -> Real-time KPIs and AI monthly demand projections reflect the operations.

---
*Created as part of Step 1 Specification for BloodConnect.*
