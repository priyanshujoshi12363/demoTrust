# TrustAI Backend

A production-ready Node.js/Express backend powered by the [`trust-ai`](https://www.npmjs.com/package/trust-ai) npm package. Provides fraud detection, risk assessment, and account takeover prevention APIs for banking and fintech frontends.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ (ES Modules) |
| Framework | Express 5 |
| Database | MongoDB Atlas (Mongoose 9) |
| Auth | JWT + bcryptjs |
| AI / Fraud Engine | trust-ai (Ollama + MiniMax) |
| Unique IDs | nanoid |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              MongoDB connection
│   ├── middleware/
│   │   └── auth.js            JWT protect + role guard
│   ├── models/
│   │   ├── User.js            User schema (bcrypt, virtuals)
│   │   └── TrustEvent.js      Trust evaluation event schema
│   └── routes/
│       ├── auth.js            Register + Login
│       ├── trust.js           Manual trust evaluation
│       ├── logs.js            Audit logs
│       ├── dashboard.js       Bank analyst dashboard
│       ├── chatbot.js         Customer & analyst chatbots
│       ├── verify.js          KYC & user verification
│       └── ai.js              AI engine control
├── server.js                  Entry point
├── test.js                    Full API test suite (34 tests)
├── .env.example               Environment variable template
└── package.json
```

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/trustai
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
OLLAMA_API_KEY=your_ollama_api_key
OLLAMA_MODEL=minimax-m3
```

### 3. Start the server
```bash
node server.js
```

### 4. Run tests
```bash
node test.js
```

---

## API Reference

Base URL: `http://localhost:3000`

---

### Auth

#### `POST /api/auth/register`
Create a new user account.

**Body:**
```json
{
  "name": "Rahul Mehta",
  "email": "rahul@example.com",
  "password": "SecurePass@123",
  "phone": "9876543210",
  "accountType": "SAVINGS",
  "role": "customer"
}
```
`role` options: `customer` | `analyst` | `admin`  
`accountType` options: `SAVINGS` | `CURRENT` | `BUSINESS`

**Response:**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "userId": "user_abc123", "name": "...", "role": "customer" }
}
```

---

#### `POST /api/auth/login`
Login with trust evaluation. Automatically runs fraud detection on every login attempt.

**Body:**
```json
{
  "email": "rahul@example.com",
  "password": "SecurePass@123",
  "device": {
    "deviceId": "iphone15-abc",
    "os": "iOS 18",
    "browser": "Safari",
    "isNewDevice": false
  },
  "location": {
    "city": "Mumbai",
    "country": "IN",
    "ipAddress": "117.201.88.10"
  },
  "behavior": { "eventType": "LOGIN", "loginHour": 10 },
  "metadata": { "channel": "MOBILE_APP" }
}
```

**Response:**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "userId": "...", "role": "customer" },
  "risk": {
    "riskScore": 17,
    "severity": "LOW",
    "decision": "ALLOW",
    "reasons": [...],
    "explanation": "...",
    "recommendations": [...]
  }
}
```

> If `decision` is `BLOCK`, login is rejected with HTTP 403.

---

### Trust Evaluation

#### `POST /api/trust/evaluate` 🔒
Manually run a trust check for any event type.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "device": { "deviceId": "dev-001", "os": "Android 14", "isNewDevice": true },
  "location": { "city": "Delhi", "country": "IN", "ipAddress": "103.21.58.77" },
  "authentication": { "method": "PASSWORD", "failedLogins": 0, "mfaEnabled": true },
  "behavior": { "eventType": "TRANSACTION", "loginHour": 23 },
  "transaction": { "amount": 50000, "currency": "INR", "type": "TRANSFER", "beneficiaryNew": true },
  "metadata": { "channel": "WEB" }
}
```

`eventType` options: `LOGIN` | `TRANSACTION` | `PROFILE_UPDATE` | `PASSWORD_RESET` | `LOGOUT`

---

### Logs

#### `GET /api/logs` 🔒 Admin/Analyst
Get all trust events with optional filters.

**Query params:** `severity`, `decision`, `eventType`, `limit` (default 100), `page`

#### `GET /api/logs/stats` 🔒 Admin/Analyst
Aggregated breakdown by severity, decision, and average risk score.

**Response:**
```json
{
  "stats": {
    "total": 120,
    "avgRiskScore": 32,
    "bySeverity": { "LOW": 80, "MEDIUM": 25, "HIGH": 12, "CRITICAL": 3 },
    "byDecision": { "ALLOW": 95, "CHALLENGE": 15, "REVIEW": 7, "BLOCK": 3 }
  }
}
```

#### `GET /api/logs/:userId` 🔒 Self or Admin/Analyst
Full audit trail for a specific user. Customers can only view their own logs.

**Query params:** `severity`, `eventType`, `limit`, `since` (ISO date)

---

### Dashboard

#### `GET /api/dashboard/stats` 🔒 Admin/Analyst
Full system overview — users, events, incidents, risk scores.

**Response:**
```json
{
  "stats": {
    "users": { "total": 500, "verified": 320, "blocked": 5, "byRole": {...} },
    "events": { "total": 1200, "today": 45, "avgRiskScore": 28, "bySeverity": {...} },
    "recentIncidents": [...]
  }
}
```

#### `POST /api/dashboard/query` 🔒 Admin/Analyst
Ask the AI analyst a natural language question about the data.

**Body:**
```json
{
  "question": "Which users had high risk logins in the last 24 hours?",
  "userId": "user_abc123"
}
```

#### `GET /api/dashboard/incidents` 🔒 Admin/Analyst
Recent HIGH/CRITICAL incidents.

**Query params:** `severity` (default `CRITICAL`), `limit` (default 20)

#### `GET /api/dashboard/users` 🔒 Admin/Analyst
Paginated user list with filters.

**Query params:** `limit`, `page`, `isBlocked`, `kycVerified`

---

### Chatbot

#### `POST /api/chatbot/customer` 🔒 Any user
Customer-facing TrustBot. Answers security questions for the logged-in user.

**Body:**
```json
{ "message": "Why was my login flagged?" }
```

#### `POST /api/chatbot/analyst` 🔒 Admin/Analyst
Bank analyst AI chatbot. Query fraud data in natural language.

**Body:**
```json
{
  "question": "Show all blocked accounts and explain why they were blocked.",
  "userId": "user_abc123"
}
```

---

### Verify

#### `GET /api/verify/:userId` 🔒 Self or Admin/Analyst
Get full verification status for a user.

**Response:**
```json
{
  "verification": {
    "userId": "user_abc123",
    "kycVerified": true,
    "mfaEnabled": true,
    "isActive": true,
    "isBlocked": false,
    "lastRiskScore": 17,
    "lastDecision": "ALLOW",
    "latestEvent": {
      "severity": "LOW",
      "decision": "ALLOW",
      "riskScore": 17,
      "timestamp": "2025-01-15T10:30:00Z"
    }
  }
}
```

#### `PUT /api/verify/:userId` 🔒 Admin/Analyst
Update a user's KYC, MFA, active, or blocked status.

**Body:**
```json
{
  "kycVerified": true,
  "mfaEnabled": true,
  "isBlocked": false,
  "isActive": true
}
```

---

### AI Engine

#### `POST /api/ai/initialize` 🔒 Admin only
Re-initialize the trust-ai engine with a new API key or model.

**Body:**
```json
{ "apiKey": "your_ollama_api_key", "model": "minimax-m3" }
```

#### `GET /api/ai/status` 🔒 Admin/Analyst
Check initialization status and current model.

#### `GET /api/ai/memory` 🔒 Admin/Analyst
Check trust-ai internal memory store sizes (users, logs, vectors).

---

## Risk Score Reference

| Score | Severity | Decision | Meaning |
|---|---|---|---|
| 0 – 25 | LOW | ALLOW | Normal activity |
| 26 – 50 | MEDIUM | CHALLENGE | Slightly suspicious |
| 51 – 75 | HIGH | REVIEW | Needs analyst review |
| 76 – 100 | CRITICAL | BLOCK | Fraud / ATO attempt |

---

## Role Permissions

| Route | Customer | Analyst | Admin |
|---|---|---|---|
| Register / Login | ✓ | ✓ | ✓ |
| Trust evaluate | ✓ | ✓ | ✓ |
| Own logs | ✓ | ✓ | ✓ |
| All logs / stats | ✗ | ✓ | ✓ |
| Dashboard | ✗ | ✓ | ✓ |
| Customer chatbot | ✓ | ✓ | ✓ |
| Analyst chatbot | ✗ | ✓ | ✓ |
| Verify (read own) | ✓ | ✓ | ✓ |
| Verify (update) | ✗ | ✓ | ✓ |
| AI initialize | ✗ | ✗ | ✓ |

---

## Running Tests

```bash
node test.js
```

Runs 34 automated tests covering all routes, auth flows, role guards, and edge cases. Server must be running first.

Expected output:
```
Passed : 34
Failed : 0
All tests passed!
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default 3000) |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | No | JWT expiry (default `7d`) |
| `OLLAMA_API_KEY` | Yes | Ollama API key for AI explanations |
| `OLLAMA_MODEL` | No | AI model (default `minimax-m3`) |
