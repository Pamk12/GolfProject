# ⛳ Digital Heroes — Golf Charity Platform

> **A cryptographic prize-draw platform where monthly golf scores fund global charities.**

![Platform](https://img.shields.io/badge/Platform-Next.js%2015-black?style=flat-square&logo=next.js)
![DB](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase)
![Payments](https://img.shields.io/badge/Payments-Stripe-635BFF?style=flat-square&logo=stripe)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## 📦 Monorepo Structure

```
GolfProject/
├── golf-charity-app/       # Public-facing Next.js application (Port 3000)
│   ├── src/app/(public)/   # Landing page, charities list
│   ├── src/app/(auth)/     # Login, Register flows
│   ├── src/app/user/       # Authenticated user dashboard, profile, proof upload
│   ├── src/components/     # ScoreEntryForm, UploadProofForm, CharityUpgradeForm, Navbar
│   └── src/app/actions/    # Server Actions: scores, verification, userSettings
│
└── golf-admin-app/         # Standalone Admin Microservice (Port 3001)
    ├── src/app/(dashboard)/ # Layout, SYS_METRICS, USER_REGISTRY, RNG_ROUTING, AUDIT_LOGS
    └── src/app/actions/     # Server Actions: admin, draws
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────┐        ┌──────────────────────────┐
│   golf-charity-app      │        │    golf-admin-app         │
│   (User Interface)      │        │   (Admin Microservice)    │
│                         │        │                           │
│  Landing / FAQ / Tiers  │        │  SYS_METRICS              │
│  Auth (Register/Login)  │──────▶│  USER_REGISTRY (Accordion)│
│  User Dashboard         │  Shared│  RNG_ROUTING (Draws)      │
│  Score Entry (1–45)     │Supabase│  AUDIT_LOGS               │
│  Proof Upload           │        │  CHARITY_REGISTRY         │
│  Profile (Plan Badge)   │        │                           │
└────────────┬────────────┘        └──────────────┬───────────┘
             │                                     │
             └──────────────┬──────────────────────┘
                            ▼
               ┌────────────────────────┐
               │      Supabase          │
               │  Auth / PostgreSQL     │
               │  Storage (proof imgs)  │
               │  RLS Policies          │
               └────────────────────────┘
```

---

## 🎯 Core Features

### User Platform (`golf-charity-app`)
| Feature | Description |
|---|---|
| **Registration** | Email/password with charity selection and plan choice (Demo/Monthly/Yearly) |
| **Score Entry** | Submit 1–5 golf scores (values 1–45), with Rolling 5 rule (newest replaces oldest) |
| **Charity Yield Slider** | Drag to allocate 10%–100% of subscription to charity |
| **Draw Status** | Dashboard shows match tier (T1/T2/T3) against the latest published draw |
| **Proof Upload** | Winners submit scorecard images — blocked for Demo users with clear message |
| **Profile** | Shows subscription plan badge (DEMO / MONTHLY / YEARLY) |
| **Copy Protection** | `user-select: none` + `-webkit-touch-callout: none` applied globally |

### Admin Console (`golf-admin-app`)
| Module | Description |
|---|---|
| **SYS_METRICS** | Real-time analytics: total users, prize pool, charity yields, system status |
| **USER_REGISTRY** | Accordion list with expandable rows showing Participant ID, plan, yield, MOD/DELETE actions |
| **RNG_ROUTING** | Execute draws (Simulation or Live), custom styled dropdowns, 3-tier result breakdown |
| **AUDIT_LOGS** | Verification queue with Rolling 5 vector analysis and approve/reject actions |
| **CHARITY_REGISTRY** | View and manage all charity routing nodes |

---

## 🎲 Prize Draw Algorithm

Each month, the RNG engine generates **5 unique integers (1–45)**. User scores are matched against the winning set:

| Tier | Match | Pool Share | Notes |
|---|---|---|---|
| 🥇 **Tier 1 — Jackpot** | 5 / 5 | **40%** | Rolls over if no paid winner |
| 🥈 **Tier 2** | 4 / 5 | **35%** | Split equally among paid winners |
| 🥉 **Tier 3** | 3 / 5 | **25%** | Split equally among paid winners |

**Key rules:**
- Only **Monthly** and **Yearly** subscribers are payout-eligible
- **Demo** accounts track predictions but receive **no payouts**
- Jackpot (Tier 1) rolls over to next month if no paid winner matches all 5
- Supports two modes: `STANDARD (RNG)` and `WEIGHTED (ALGORITHMIC)` — weighted picks the most frequently submitted scores

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 15** (App Router, Server Actions) |
| Language | **TypeScript** |
| Styling | **TailwindCSS v4** |
| Icons | **Lucide React** |
| Database | **Supabase (PostgreSQL)** |
| Auth | **Supabase Auth** (JWT sessions) |
| Storage | **Supabase Storage** (proof-images bucket) |
| Payments | **Stripe** (Checkout sessions) |
| Email | **Resend** (Transactional notifications) |

---

## 🗄️ Database Schema

### Key Tables

```sql
-- Users: subscription state and charity allocation
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  subscription_status TEXT,           -- 'active' | 'inactive'
  subscription_tier TEXT,             -- 'demo' | 'monthly' | 'yearly'
  charity_contribution_percentage INT, -- 10–100
  selected_charity UUID REFERENCES charities(id)
);

-- Scores: the Rolling 5 vector per user
CREATE TABLE scores (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  score INT NOT NULL,                 -- 1–45 (Stableford range)
  play_date DATE NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'pending'       -- 'pending' | 'approved' | 'rejected' | 'flagged'
);

-- Draws: monthly draw execution records
CREATE TABLE draws (
  id UUID PRIMARY KEY,
  draw_month DATE NOT NULL,
  winning_numbers INT[],              -- 5 unique integers 1–45
  prize_pool NUMERIC,
  rollover_amount NUMERIC DEFAULT 0,
  calculated_splits JSONB,            -- {tiers: {monthly, yearly, demo}, payouts: {...}}
  winning_user_ids UUID[],
  status TEXT                         -- 'simulation' | 'published'
);

-- Charities: routing destinations
CREATE TABLE charities (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  featured BOOLEAN DEFAULT FALSE
);
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (get your URL and anon key from the Supabase dashboard)
- A Stripe account (for payment checkout sessions)

### 1. Clone the Repository

```bash
git clone https://github.com/Pamk12/GolfProject.git
cd GolfProject
```

### 2. Set Up the Charity App

```bash
cd golf-charity-app
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev  # Runs on http://localhost:3000
```

### 3. Set Up the Admin App

```bash
cd ../golf-admin-app
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

```bash
npm run dev  # Runs on http://localhost:3001
```

### 4. Apply Database Migrations

Run in Supabase SQL Editor:
```sql
-- Add subscription tier column
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'demo';

-- RLS bypass for admin reads (run once)
CREATE POLICY "Admin Full Access" ON scores FOR ALL USING (true);
```

---

## 📱 Mobile Responsiveness

Both apps are built **mobile-first**:

- **Admin**: Off-canvas hamburger nav slides from the **right** edge, sidebar uses `sticky` + `md:h-screen` with `items-stretch` for gap-free layouts
- **Charity**: Navbar hamburger, responsive score forms, accordion dropdowns in admin
- All tables use `overflow-x-auto` wrappers to prevent viewport clipping

---

## 🔐 Security

- **Admin App**: Hardcoded root-only authentication (standalone microservice)
- **Supabase RLS**: Row-Level Security on all tables; admin operations require service role key or RLS bypass policy
- **Demo Gate**: Proof submission blocked at both UI and logic level for demo tier users
- **Copy Protection**: `user-select: none` + touch callout disabled on the public charity app

---

## 📄 License

MIT © 2026 Digital Heroes Golf Charity Platform
