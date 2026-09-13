# ResumeCraft MERN — AI Resume Builder with Role-Based Access

Full-stack MERN SaaS resume builder powered by **OpenRouter** (multi-model AI routing), with **Admin & User roles**, subscription management, and 5 domain-specific professional templates.

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (custom, no third-party) |
| AI | OpenRouter (via OpenAI-compatible API, free-tier model routing) |
| Payments | Stripe |
| PDF Export | LaTeX (pdflatex) |

---

## 📁 Folder Structure

```
resumecraft-mern/
├── server/                    # Express backend
│   ├── models/
│   │   ├── User.js            # User model with roles + subscription
│   │   ├── Resume.js          # Resume model
│   │   └── Plan.js            # Admin-managed plan catalog
│   ├── routes/
│   │   ├── auth.js            # Register, login, logout, profile
│   │   ├── resumes.js         # Resume CRUD + download + duplicate
│   │   ├── ai.js              # OpenRouter AI generation endpoint
│   │   ├── subscriptions.js   # Stripe checkout + billing portal
│   │   ├── admin.js           # All admin endpoints
│   │   └── stripe.js          # Stripe webhook handler
│   ├── middleware/
│   │   └── auth.js            # JWT verify, requireRole, adminOnly, checkAICredits
│   └── index.js               # Express app entry point
│
├── client/                    # React frontend
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx      # Global auth state
│       ├── utils/
│       │   ├── api.js               # Axios instance with JWT interceptor
│       │   └── helpers.js           # cn(), debounce(), ATS calc, etc.
│       ├── pages/
│       │   ├── Landing.jsx          # Public landing page
│       │   ├── Login.jsx            # Login page
│       │   ├── Register.jsx         # Register page
│       │   ├── Pricing.jsx          # Pricing + Stripe checkout
│       │   ├── Templates.jsx        # Template gallery
│       │   ├── dashboard/
│       │   │   ├── Dashboard.jsx    # User dashboard overview
│       │   │   ├── Resumes.jsx      # All resumes management
│       │   │   ├── Builder.jsx      # Resume editor page
│       │   │   └── Settings.jsx     # Profile + billing settings
│       │   └── admin/
│       │       ├── AdminDashboard.jsx   # Stats + activity
│       │       ├── AdminUsers.jsx       # User list + quick actions
│       │       ├── AdminUserDetail.jsx  # Full user management
│       │       └── AdminPlans.jsx       # Plan pricing editor
│       ├── components/
│       │   ├── shared/
│       │   │   ├── DashboardLayout.jsx  # User sidebar layout
│       │   │   └── AdminLayout.jsx      # Admin dark sidebar layout
│       │   └── editor/
│       │       ├── EditorPanel.jsx      # All resume form sections
│       │       └── ResumePreview.jsx    # Live preview + TemplateSelector + ATSPanel
│       └── App.jsx                  # Router with role-based guards
│
└── package.json               # Root: concurrent dev script
```

---

## ⚡ Setup in 15 Minutes

### Step 1 — Install dependencies

```bash
# In the root folder
npm run install:all
```

This installs packages for root, server, and client.

### Step 2 — Set up MongoDB Atlas (Free)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → **Sign up free**
2. Create a **free M0 cluster** (choose any region)
3. Click **"Connect"** → **"Drivers"** → copy the connection string
4. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`
5. Replace `<password>` with your Atlas password and add `resumecraft` at the end:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/resumecraft?retryWrites=true&w=majority
   ```

### Step 3 — Get an OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai) and sign in / create an account
2. Go to [openrouter.ai/keys](https://openrouter.ai/keys) → **Create Key**
3. Copy the key (starts with `sk-or-...`)

> The default model is `openrouter/free` — OpenRouter's own router that picks a currently-available free model automatically, so this keeps working as their free-tier lineup changes. Set `OPENROUTER_MODEL` in `.env` to pin a specific model instead (e.g. `meta-llama/llama-3.1-8b-instruct:free`) — see [openrouter.ai/models?max_price=0](https://openrouter.ai/models?max_price=0) for the current free list.

### Step 4 — Set up Stripe (optional, for payments)

1. Go to [stripe.com](https://stripe.com) → Sign up
2. Enable **Test mode**
3. Get your keys from **Developers → API Keys**
4. Create a product "ResumeCraft Pro" with monthly ($9.99) and yearly ($79.99) prices
5. Set up a webhook pointing to `http://localhost:5000/api/stripe/webhook`



## 👤 Role System

### How roles work

| Feature | User | Admin |
|---|---|---|
| Create/edit resumes | ✅ | ✅ |
| AI writing | ✅ (limited) | ✅ |
| Access `/admin` panel | ❌ | ✅ |
| View all users | ❌ | ✅ |
| Grant subscriptions | ❌ | ✅ |
| Change user roles | ❌ | ✅ |
| Manage plan pricing | ❌ | ✅ |
| Activate/deactivate users | ❌ | ✅ |
| Delete users | ❌ | ✅ |

### First user = Admin

**The very first user to register becomes Admin automatically.**

So when you run the app for the first time:
1. Go to http://localhost:5173/register
2. Create your account
3. You'll be redirected to the **Admin Panel** at `/admin`

All subsequent registrations are regular `user` role.

### Admin can grant Pro to any user

In the Admin Panel → Users → click any user → change their Plan dropdown to "Pro" → Save.
This is an **admin-granted subscription** that works independently of Stripe.

---

## 🤖 AI Features (OpenRouter)

The app uses **OpenRouter** for:

| Action | What it does |
|---|---|
| `improve_summary` | Rewrites your professional summary |
| `generate_summary` | Creates a summary from your experience |
| `improve_bullets` | Transforms vague bullets into achievement-driven ones |
| `generate_bullets` | Creates bullets from a job description |
| `tailor_to_job` | Reshapes resume to match a job posting |
| `improve_skills` | Optimizes and groups your skills section |

AI credits per plan:
- **Free**: 5 credits/lifetime
- **Pro**: 100 credits/month (auto-resets)
- **Enterprise**: Unlimited

---

## 💳 Subscription Plans

| Feature | Free | Pro | Enterprise |
|---|---|---|---|
| Resumes | 2 | Unlimited | Unlimited |
| Templates | 2 (Modern, Classic) | All 6 | All 6 |
| AI Credits | 5 | 100/month | Unlimited |
| PDF Downloads | 3 | Unlimited | Unlimited |
| Watermark | Yes | No | No |
| ATS Analysis | Basic | Full | Full |

---

## 🚀 Deployment

### Backend (Railway/Render)

1. Push to GitHub
2. Create a new service on [railway.app](https://railway.app) or [render.com](https://render.com)
3. Point to the `server/` directory
4. Install TeX Live so the server has the `pdflatex` executable available
5. Add all environment variables
6. Set start command: `npm start` (runs `node --import ./instrument.mjs index.js`, which loads Sentry instrumentation if `SENTRY_DSN` is set — safe no-op otherwise)

### Frontend (Vercel/Netlify)

1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `client`
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add env variable: `VITE_API_URL=https://your-backend.railway.app`

Then update `client/src/utils/api.js` baseURL to your production backend URL.

---

---

## 🎯 Domains, Templates & Discovery Tools

Students pick one of 10 CS domains (SWE, Data Eng, AI/ML, DevOps, Cybersecurity, Embedded & Systems, Networking, Cloud & Distributed, DB & Storage, Computer Vision), each mapped to one of 5 real LaTeX layout families — not just color variants. Three tools help students who don't already know their domain:

| Tool | Route | How it works |
|---|---|---|
| Domain Quiz | `/quiz` | 8-question deterministic quiz, no AI needed, balanced across all 10 domains |
| Background → Domain | `/quiz` (2nd tab) | Paste your experience, an LLM (via OpenRouter) suggests the best-fit domain(s) — validated server-side against the real domain list before returning |
| Example Resumes | `/examples` | Browse a realistic example per domain, then "use as starting point" to clone it into your own editable resume |

## 🧪 Testing & CI

```bash
# Server
cd server && npm test              # everything (needs MongoDB download + pdflatex)
npm run test:unit                  # unit tests only — no network/DB required
npm run test:integration           # auth/resume routes — needs mongodb-memory-server

# Client
cd client && npm test
```

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs both suites plus a client production build and `npm audit` on every push/PR, with a Redis service container so the Redis-backed queue tests run too.

> Note: `mongodb-memory-server` downloads a real `mongod` binary on first run — this needs outbound internet access. It works out of the box in GitHub Actions and normal dev machines; heavily locked-down/offline environments should stick to `npm run test:unit`.

## 🏭 Production Readiness Notes

- **Email**: password reset and welcome emails use generic SMTP (`SMTP_HOST` etc. in `.env`) — works with Gmail, SendGrid, AWS SES, Mailtrap. If unset, emails are logged instead of sent, so local dev never breaks on missing credentials.
- **Error monitoring**: structured logs always go to `server/logs/*.log` and the console via Winston. Set `SENTRY_DSN` to also get exception alerting — fully optional, the app behaves identically either way.
- **LaTeX compile scaling**: single-instance deployments need no extra setup (in-process concurrency cap + bounded queue). Running multiple server instances? Set `REDIS_URL` to coordinate compiling through a shared BullMQ queue instead.
- **Dependency audits**: run `npm audit` in both `client/` and `server/` before each release; CI already checks this on every push.

---

## 🐛 Common Issues

**`npm run dev` fails — "concurrently not found"**
```bash
npm install  # in root folder
```

**MongoDB connection error**
- Check your IP is whitelisted in Atlas: Network Access → Add IP → 0.0.0.0/0

**OpenRouter API error**
- Make sure `OPENROUTER_API_KEY` is set in `server/.env`
- If using a pinned (non-`openrouter/free`) model, confirm it's still available and still free at [openrouter.ai/models](https://openrouter.ai/models) — free models occasionally get deprecated or rate-limited more aggressively than others
- Check your usage/limits at [openrouter.ai/activity](https://openrouter.ai/activity)

**Password reset email never arrives**
- Check `server/logs/combined.log` (or console output) for a line starting "Email not sent — SMTP not configured" — if you see it, set `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` in `.env`. Until then, reset emails are just logged, not sent.

**"Cannot POST /api/..."**
- Make sure the server is running on port 5000
- Vite proxy is configured in `client/vite.config.js`

**First user not becoming admin**
- Only works if the database is empty. If you already have users, go to MongoDB Atlas → browse your `users` collection → manually set `"role": "admin"` on your user document.
