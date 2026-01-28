# Startup Benefits Platform

A full-stack web application where startups can browse, search, and claim exclusive deals and benefits from partner companies. Built with Next.js (App Router), Express.js, MongoDB, and JWT authentication.

---

## Overview

**What it is:** A platform connecting startups with exclusive deals from partner companies (cloud credits, development tools, design software, etc.). Users can register, browse deals, search/filter by category and access level, and claim deals they're eligible for.

**Key features:**
-  JWT-based authentication (register, login, logout)
-  Browse 20+ deals across 7 categories (cloud, development, design, productivity, marketing, support, legal)
- Search and filter deals by keyword, category, and access level
- Two-tier access system: Public deals (all users) and Locked deals (verified users only)
-  Claim deals with duplicate prevention and status tracking (pending/approved/rejected)
-  Dashboard to view profile and claimed deals
- Smooth animations with page transitions and micro-interactions
- Accessibility support (keyboard navigation, reduced motion)

---

## End-to-End Flow

1. **User registers** → Creates account with email/password → Receives JWT token → Auto-login
2. **Browse deals** → View all deals on `/deals` page → Search by keyword → Filter by category (cloud, dev, design, etc.) → Filter by access level (public/locked)
3. **View deal details** → Click "Learn More" → See full description, partner info, eligibility criteria
4. **Attempt to claim:**
   - **Not logged in** → See "Sign In to Claim" message → Redirected to login
   - **Logged in + Public deal** → Click "Claim Deal Now" → Success modal → Deal added to dashboard
   - **Logged in + Locked deal + Unverified** → See "Verification Required" message → Claim blocked
   - **Logged in + Locked deal + Verified** → Click "Claim Deal Now" → Success modal → Deal added to dashboard
5. **View dashboard** → See profile card with verification status → View all claimed deals with status badges
6. **Attempt duplicate claim** → Friendly error message: "You have already claimed this deal"
7. **Logout** → Token cleared → Protected routes redirect to login

---

## Architecture

### Folder Structure

```
startup-benefits-platform/
├── apps/
│   ├── api/                              # Express.js backend
│   │   ├── src/
│   │   │   ├── models/                   # Mongoose schemas
│   │   │   │   ├── user.ts              # User: email, passwordHash, isVerified
│   │   │   │   ├── deal.ts              # Deal: title, category, accessLevel, partner
│   │   │   │   └── claim.ts             # Claim: userId, dealId, status (pending/approved/rejected)
│   │   │   ├── routes/                   # API endpoints
│   │   │   │   ├── auth.ts              # POST /auth/register, /auth/login
│   │   │   │   ├── deals.ts             # GET /deals, GET /deals?slug=...
│   │   │   │   ├── claims.ts            # POST /claims, GET /claims/me
│   │   │   │   ├── protected.ts         # GET /protected/me (current user)
│   │   │   │   ├── health.ts            # GET /health (status check)
│   │   │   │   └── dev.ts               # Dev-only verification endpoints (disabled in prod)
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts              # authRequired: Verifies JWT, attaches req.user
│   │   │   │   ├── validate.ts          # validateBody: Zod schema validation
│   │   │   │   ├── rateLimiter.ts       # Rate limiting (100/15min general, 5/15min auth)
│   │   │   │   └── errorHandler.ts      # Central error handling
│   │   │   ├── utils/
│   │   │   │   ├── auth.ts              # signToken, verifyToken (JWT utilities)
│   │   │   │   └── validation.ts        # Common validation helpers
│   │   │   ├── db/
│   │   │   │   └── connect.ts           # MongoDB connection with retry logic
│   │   │   ├── scripts/
│   │   │   │   └── seed.ts              # Database seeding (20+ deals, 2 test users)
│   │   │   ├── config/
│   │   │   │   └── env.ts               # Environment variable validation
│   │   │   ├── app.ts                   # Express app setup (middleware, routes)
│   │   │   └── server.ts                # Server entry point
│   │   └── package.json
│   │
│   └── web/                              # Next.js frontend
│       ├── app/                          # App Router pages
│       │   ├── page.tsx                 # Landing page (hero, features, CTA)
│       │   ├── layout.tsx               # Root layout (AuthProvider, PageTransition)
│       │   ├── globals.css              # Global styles, animations, design tokens
│       │   ├── login/page.tsx           # Login form → POST /auth/login
│       │   ├── register/page.tsx        # Registration form → POST /auth/register
│       │   ├── deals/
│       │   │   ├── page.tsx            # Deals list with search/filter → GET /deals
│       │   │   └── [slug]/page.tsx     # Deal detail + claim logic → POST /claims
│       │   └── dashboard/page.tsx       # User dashboard → GET /protected/me, GET /claims/me
│       ├── components/
│       │   ├── ui/                      # Reusable components
│       │   │   ├── Button.tsx          # Variants: primary, outline, ghost, error
│       │   │   ├── Card.tsx            # Hover animations, shadow on lift
│       │   │   ├── Input.tsx           # Focus animations, error states
│       │   │   ├── Badge.tsx           # Status indicators (success, warning, error, info)
│       │   │   ├── Modal.tsx           # Success modal (claim confirmation)
│       │   │   └── Skeleton.tsx        # Loading placeholders
│       │   ├── PageTransition.tsx       # Route transition wrapper
│       │   └── ProtectedRoute.tsx       # Auth guard component
│       ├── contexts/
│       │   └── AuthContext.tsx          # Global auth state (user, token, login, logout)
│       ├── hooks/
│       │   └── useMotion.ts             # usePrefersReducedMotion (accessibility)
│       ├── lib/
│       │   └── api.ts                   # API client (fetch wrapper with auto-auth)
│       └── package.json
│
├── E2E_TEST_CHECKLIST.md                # Manual testing guide (7 scenarios)
├── VERIFICATION_GUIDE.md                 # Dev verification system docs
├── QUICK_START.md                        # 3-minute setup guide
└── package.json                          # Root package (npm workspaces)
```

### Key Modules

**Backend:**
- `models/` — Mongoose schemas with unique constraints (email, userId+dealId)
- `routes/` — Express route handlers with validation and auth middleware
- `middleware/auth.ts` — JWT verification, attaches `req.user = { sub, email, isVerified }`
- `middleware/validate.ts` — Zod schema validation for request bodies
- `utils/auth.ts` — `signToken(payload)` returns JWT, `verifyToken(token)` validates and decodes

**Frontend:**
- `contexts/AuthContext.tsx` — Manages auth state, provides `{ user, token, isAuthenticated, login, logout }`
- `lib/api.ts` — Fetch wrapper that automatically attaches `Authorization: Bearer <token>` header
- `hooks/useMotion.ts` — Detects `prefers-reduced-motion`, returns simplified animation props
- `components/PageTransition.tsx` — Wraps pages with AnimatePresence for route transitions

---

## Auth Strategy

### JWT (JSON Web Tokens)

**Token creation:** When user registers or logs in, backend generates JWT with payload:
```typescript
{
  sub: userId,
  email: "user@example.com",
  isVerified: false,
  iat: 1234567890,
  exp: 1234567890 + (7 * 24 * 60 * 60)
}
```

**Token signing:** Uses `JWT_SECRET` from environment variables (HMAC SHA256)

**Token storage (Frontend):**
- Stored in `localStorage` as `token` key
- Retrieved on app load in `AuthContext`
- Attached to all API requests via `Authorization: Bearer <token>` header

**Token verification (Backend):**
- `authRequired` middleware extracts token from `Authorization` header
- Calls `verifyToken(token)` to validate signature and expiry
- Attaches decoded payload to `req.user`
- Returns 401 if missing, invalid, or expired

### Protected Routes

**Frontend protection:**
```typescript
if (!isAuthenticated) {
  router.push('/login');
  return null;
}
```

**Backend protection:**
```typescript
router.post('/claims', authRequired, async (req, res) => {
  const userId = req.user.sub;
});
```

**Password hashing:**
- Uses `bcrypt` with 10 salt rounds
- Passwords never stored in plain text
- Compared with `bcrypt.compare()` on login

---

## Claim Flow Decision Tree

```
User wants to claim deal
│
├─ Is user logged in?
│  ├─ NO → Show "Sign In to Claim" section
│  │       └─ Buttons: "Sign In" | "Create Account"
│  │          └─ After login → Redirect back to deal page
│  │
│  └─ YES → Check deal access level
│            │
│            ├─ Deal is PUBLIC
│            │  └─ Show "Claim Deal Now" button
│            │     └─ On click → POST /claims { dealId }
│            │        ├─ Success → Show success modal
│            │        │           └─ Redirect to dashboard
│            │        │
│            │        └─ Error → Show error message
│            │           ├─ "Already claimed" → Friendly message
│            │           └─ Other errors → Generic error
│            │
│            └─ Deal is LOCKED
│               └─ Is user verified?
│                  ├─ NO → Show "Verification Required" section
│                  │       └─ Blue info box: "Why verify?"
│                  │          └─ Buttons: "Contact Support" | "Browse Public Deals"
│                  │             └─ Claim button: NOT VISIBLE
│                  │
│                  └─ YES → Show "Claim Deal Now" button
│                          └─ Same flow as PUBLIC deal
```

**Duplicate prevention:**
- MongoDB unique compound index: `{ userId: 1, dealId: 1 }`
- Prevents same user from claiming same deal twice
- Database-level constraint (race-condition safe)

---

## Frontend-Backend Interaction

### Endpoints Used Per Page

#### Landing Page (`/`)
- **No API calls** — Static content with animations

#### Register Page (`/register`)
- **POST** `/auth/register`
  - Body: `{ email, password, name }`
  - Success: `{ token, user: { id, email, name, isVerified } }`
  - Error: `{ error: { code, message } }`
  - On success: Store token in localStorage, redirect to `/dashboard`

#### Login Page (`/login`)
- **POST** `/auth/login`
  - Body: `{ email, password }`
  - Success: `{ token, user: { id, email, name, isVerified } }`
  - Error: `{ error: { code, message } }`
  - On success: Store token in localStorage, redirect to `/dashboard`

#### Deals List Page (`/deals`)
- **GET** `/deals?search=keyword&category=cloud&accessLevel=public`
  - Query params: All optional
  - Success: `{ deals: [{ id, title, slug, description, category, accessLevel, partnerName, ... }] }`
  - Filtering: Client-side (all deals fetched, then filtered in React state)
  - Search: Client-side (case-insensitive match on title, description, partner)

#### Deal Detail Page (`/deals/[slug]`)
- **GET** `/deals?slug=aws-cloud-credits`
  - Query param: `slug` (unique deal identifier)
  - Success: `{ deals: [{ ...deal }] }` (array with single item)
  - Error: Empty array if not found
  - Used for: Display deal details and claim eligibility check

- **POST** `/claims` (when user clicks "Claim Deal Now")
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ dealId }`
  - Success: `{ claim: { id, userId, dealId, status: 'pending', createdAt } }`
  - Errors:
    - 401: Not authenticated
    - 403: Verification required (locked deal)
    - 409: Already claimed
    - 404: Deal not found

#### Dashboard Page (`/dashboard`)
- **GET** `/protected/me` (on page load)
  - Headers: `Authorization: Bearer <token>`
  - Success: `{ user: { id, email, name, isVerified, createdAt } }`
  - Used for: Display profile card

- **GET** `/claims/me` (on page load)
  - Headers: `Authorization: Bearer <token>`
  - Success: `{ claims: [{ id, status, createdAt, dealId: { ...full deal object } }] }`
  - Populated: Deal information included via MongoDB populate
  - Used for: Display claimed deals list with status badges

#### Logout (Any page with auth)
- **Frontend only** — No API call
- Action: Remove token from localStorage, clear AuthContext state
- Redirect: Push to `/login`

---

## UI/Animation Decisions

### What Was Implemented

**1. Page Transitions**
- **What:** Fade + slide animation when navigating between routes
- **Why:** Provides continuity and polish, makes app feel like native application
- **How:** `PageTransition.tsx` wrapper with Framer Motion's `AnimatePresence`
- **Accessibility:** Detects `prefers-reduced-motion` via `useMotion` hook, disables if user prefers

**2. Micro-interactions**
- **Buttons:** Scale up (1.02x) on hover, scale down (0.98x) on press
- **Cards:** Lift 4px + enhanced shadow on hover
- **Inputs:** Scale up (1.01x) on focus, blue ring for accessibility
- **Why:** Provides immediate feedback, makes UI feel responsive and tactile

**3. Loading States**
- **Skeleton screens:** Shimmer animation while fetching data
- **Why:** Prevents jarring layout shifts, maintains perceived performance
- **Where:** Dashboard (3 skeleton cards while loading claims)

**4. Status Indicators**
- **Badges:** Color-coded by status (green=approved, yellow=pending, red=rejected)
- **Animations:** Scale-in animation on mount (0.9x → 1x)
- **Why:** Visual hierarchy, immediate understanding of claim status

**5. Success Feedback**
- **Modal:** Animated checkmark with spring physics
- **Why:** Celebrates successful action, clear confirmation
- **Interaction:** "Go to Dashboard" or "Browse More Deals" CTAs

**6. Empty States**
- **Dashboard:** Animated gift icon + "No Claims Yet" message
- **Why:** Guides user action, prevents confusion on empty data

**7. Locked Deal UX**
- **Visual treatment:** Dark overlay with icon on locked deals
- **Hover state:** Card still lifts, but lock icon scales
- **Why:** Clear differentiation, premium feel for locked content

### Design System

**Colors:**
- Primary: Blue 600 (`#2563eb`)
- Secondary: Purple 600 (`#9333ea`)
- Success: Green 500 (`#22c55e`)
- Warning: Yellow 500 (`#eab308`)
- Error: Red 500 (`#ef4444`)

**Typography:**
- Font: Inter (variable font)
- Headings: Bold, gradient text for emphasis
- Body: Regular weight, gray-900 for high contrast

**Spacing:**
- Base unit: 4px (Tailwind's default)
- Consistent padding/margin scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

**Animations:**
- Duration: 200ms (interactions), 300ms (page transitions)
- Easing: `ease-in-out` for smooth feel
- Spring physics: Used for success modal (bouncy, playful)

**Accessibility:**
- Keyboard navigation: All interactive elements focusable
- Focus indicators: Blue ring (2px solid)
- Color contrast: WCAG AA compliant
- Reduced motion: Respects OS setting, disables animations

### Why These Choices

**Framer Motion over CSS animations:**
- Better animation orchestration (stagger, sequence)
- Gesture support (hover, tap, drag)
- AnimatePresence for route transitions
- Easy to make accessible (conditional props)

**Tailwind CSS v4:**
- Utility-first for rapid development
- Design consistency through constraints
- Small bundle size with tree-shaking
- Easy theming with CSS variables

**Component-driven architecture:**
- Reusable UI components (`Button`, `Card`, `Input`, etc.)
- Consistent API (variants, sizes)
- Easy to test and maintain
- Design system enforcement

### 4. Audit Logs (Medium Priority)
```typescript
{
  userId: ObjectId,
  action: 'CLAIM_CREATED' | 'CLAIM_APPROVED' | 'LOGIN' | 'LOGOUT',
  metadata: { dealId, ipAddress, userAgent },
  createdAt: Date
}
```

### 5. Enhanced Rate Limiting (Medium Priority)
```typescript
{
  '/claims': '10 per hour per user',
  '/deals': '100 per hour per user',
  '/auth/login': '5 per 15min per IP',
  '/auth/register': '3 per hour per IP'
}

```

### 6. Server-Side Filtering & Pagination (Medium Priority)
```typescript

{
  deals: [...],
  pagination: {
    currentPage: 1,
    totalPages: 5,
    totalDeals: 97,
    hasNext: true,
    hasPrev: false
  }
}

```

### 7. Monitoring & Alerting (Low Priority)
```typescript

- Error rates (500 errors spike)
- Performance metrics (slow endpoints)
- User actions (claims per day)
- Auth events (failed logins, suspicious activity)

- High error rate (>1%)
- Slow responses (>2s p95)
- Failed login spike (potential attack)
```

### 8. Admin Panel (Low Priority)
```typescript
- Manage deals (create, edit, delete, toggle active)
- Review claims (approve, reject, view details)
- User management (verify, ban, view activity)
- Analytics dashboard (claims over time, popular deals)

```

### 9. Email Notifications (Low Priority)
```typescript
- Welcome email on registration
- Deal claimed (confirmation)
- Claim approved/rejected (status update)
- New deals matching user interests

```

### 10. CI/CD Pipeline (Low Priority)
```typescript
- Run tests on PR
- Lint and type-check
- Build and deploy to staging
- Run E2E tests
- Deploy to production on merge to main
```

---

## Run Locally

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB (local or MongoDB Atlas)

### 1. Clone and Install
```bash
git clone <repo-url>
cd startup-benefits-platform
npm install
```

### 2. Configure Environment

**Backend** (`apps/api/.env`):
```bash
MONGODB_URI=mongodb://localhost:27017/startup-benefits
JWT_SECRET=your-super-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

**Frontend** (`apps/web/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Seed Database
```bash
npm run seed
```

**Creates:**
- 20+ deals across 7 categories
- 2 test users:
  - `test@example.com` / `hashme` (unverified)
  - `verified@example.com` / `hashme` (verified)

### 4. Start Servers
```bash
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health check: http://localhost:5000/health

### 5. Test the Flow

1. **Register:** http://localhost:3000/register → Create account
2. **Browse deals:** http://localhost:3000/deals → Search/filter
3. **Claim public deal:** Click any public deal → "Claim Deal Now"
4. **Try locked deal:** Filter to "Locked" → See "Verification Required"
5. **Verify user:** 
   ```bash
   cd apps/api
   ./test-verification.sh
   ```
6. **Claim locked deal:** Refresh page → Now can claim
7. **Check dashboard:** http://localhost:3000/dashboard → See claimed deals

**Total time to test:** < 5 minutes

---

## Testing

### API Testing
```bash
cd apps/api

./test-auth.sh
./test-deals.sh
./test-claims.sh
./test-verification.sh
```
## Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion (animations)

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt (password hashing)
- Zod (validation)
- Helmet (security)
