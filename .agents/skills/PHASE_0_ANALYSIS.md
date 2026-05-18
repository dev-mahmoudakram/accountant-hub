# Accountant Hub — Phase 0 Repository Analysis

> Status: Phase 0 — analysis only. No code written yet.
> Stack confirmed: Next.js 14 (App Router, TS) + **Tailwind CSS** · **Laravel 11** + Sanctum + MySQL · Monorepo (`backend/` + `frontend/`) · `category` filter by **slug**.

---

## 1. Current Repo Structure

```
accountant-hub/
├── .agents/skills/ACCOUNTANT_HUB_SKILLS.md   # project rules (skills file)
├── .git/
├── ACCOUNTANT_HUB_MASTER_PROMPT.md           # master prompt
├── LARAVEL_BOOST_SETUP_NOTES.md              # Boost setup notes
└── README.md                                 # placeholder ("# accountant-hub")
```

Git: clean initial commit `e9d20fb`. Branch: `main`. No `backend/`, no `frontend/`, no `.env`, no CI, no MCP config.

---

## 2. Existing Frontend / Backend Status

- **Backend:** does not exist. No `composer.json`, no Laravel skeleton, no `vendor/`, no `artisan`, no migrations, no MySQL config.
- **Frontend:** does not exist. No `package.json`, no Next.js app, no Tailwind/Bootstrap config.
- **Auth:** not configured. Sanctum not installed.
- **Database:** not configured. No connection, no migrations.
- **Tooling:** no Pint, no PHPUnit/Pest setup, no ESLint/Prettier, no MCP config for Laravel Boost.

Green-field repo with only specification documents.

> **Laravel Boost note:** There is no Laravel app yet, so there is no Boost MCP server to query in Phase 0. Boost will be installed as part of Phase 1, and from Phase 2 onward every Laravel-specific change must consult Boost (`application-info`, `list-routes`, `database-schema`, `search-docs`, `tinker`, `read-log-entries`) before writing code.

---

## 3. Missing Assessment Requirements

**Infrastructure / scaffolding**
- Laravel 11 app under `backend/`
- Next.js 14+ (App Router, TS) app under `frontend/`
- MySQL connection + `.env.example` for both apps
- Laravel Sanctum (token guard — SPA on different origin)
- CORS config for `frontend → backend`
- Laravel Boost installation + MCP config (`.mcp.json`)
- Pint + Pest/PHPUnit; ESLint + Prettier + tsconfig strict

**Domain layer**
- Models: `User`, `JobCategory`, `Job`, `Bid`
- Migrations including `bids.unique(['user_id','job_id'])`
- Enums: `JobStatus`, `BidStatus`
- Factories + seeders (demo users, categories, jobs, bids)
- Test accountant credentials seeded

**API layer**
- Form Requests: `RegisterRequest`, `LoginRequest`, `JobIndexRequest`, `SubmitBidRequest`
- Resources: `UserResource`, `JobCategoryResource`, `JobListResource`, `JobDetailResource`, `BidResource`
- Actions: `RegisterAccountantAction`, `LoginAccountantAction`, `ListJobsAction`, `ShowJobAction`, `SubmitBidAction`, `ListMyBidsAction`
- Query object: `App\Queries\JobQuery`
- Service: `BidEligibilityService`
- Controllers (thin): `AuthController`, `CategoryController`, `JobController`, `BidController`, `MyBidController`
- Routes per spec
- Consistent JSON envelope + 409 for duplicate bids
- Feature tests (auth, jobs listing/filters, job details, submit bid, duplicate bid, closed-job bid, my bids)

**Frontend layer**
- App Router pages: `/`, `/jobs`, `/jobs/[id]`, `/login`, `/register`, `/dashboard/my-bids`
- Auth provider, token storage, fetch wrapper with interceptors
- Reusable components: `Navbar`, `Footer`, `Button`, `Input`, `Select`, `Textarea`, `Badge`, `JobCard`, `JobFilters`, `Pagination`, `BidForm`, `EmptyState`, `LoadingSkeleton`, `Alert/Toast`, route guard
- Design tokens for black + `#019a51`
- Responsive layout (mobile/tablet/desktop)
- Loading/empty/error states everywhere
- Validation parity with backend rules

**Docs / delivery**
- Full README (overview, setup, env vars, endpoints, test creds, deployment, assumptions)
- Deployment notes (Vercel frontend, VPS/Plesk backend, env wiring, CORS, Sanctum stateful domains)

---

## 4. Proposed Architecture

**Repo layout (monorepo):**
```
accountant-hub/
├── backend/     # Laravel 11 API (PHP 8.3)
├── frontend/    # Next.js 14 App Router (TS)
├── .agents/     # skills + prompts (existing)
├── .mcp.json    # Boost MCP config
└── README.md    # top-level overview pointing into the two apps
```

**Backend (Laravel 11) layered design:**
```
HTTP layer
  Controllers/Api/*      (thin, dispatch only)
  Requests/*             (validation)
  Resources/*            (response shaping)
Application layer
  Actions/Auth/*         (Register, Login)
  Actions/Jobs/*         (ListJobs, ShowJob)
  Actions/Bids/*         (SubmitBid, ListMyBids)
  Services/BidEligibilityService
  Queries/JobQuery
Domain layer
  Models/*               (User, Job, JobCategory, Bid)
  Enums/JobStatus, BidStatus
Persistence
  database/migrations, seeders, factories
```

Patterns used: **Action**, **Query Object**, **Resource (Transformer)**, **Enum**, **Service** (only where logic spans actions, e.g. `BidEligibilityService`). No repositories — Eloquent is the data abstraction.

**Frontend (Next.js):**
- App Router; server components for read-only pages (jobs listing/details), client components for forms and auth-aware UI.
- `lib/api.ts` — fetch wrapper, adds bearer token, normalizes error envelope.
- `lib/auth.ts` — token in `localStorage` + a small `AuthContext` for client components; server components rely on cookies or pass token explicitly.
- **Tailwind CSS** with CSS variables for brand tokens.
- Forms via `react-hook-form` + `zod` for type-safe validation that mirrors backend.

---

## 5. Database Plan

- **users** — `id`, `name varchar(120)`, `email varchar(190) unique`, `email_verified_at`, `password`, `remember_token`, timestamps.
- **personal_access_tokens** — default Sanctum.
- **job_categories** — `id`, `name varchar(120)`, `slug varchar(140) unique`, timestamps.
- **jobs** — `id`, `category_id FK→job_categories`, `title varchar(180)`, `company_name varchar(140)`, `short_description varchar(255)`, `description text`, `budget_min decimal(12,2)`, `budget_max decimal(12,2)`, `deadline date`, `expected_delivery_time varchar(60)`, `required_skills json`, `attachments json nullable`, `status enum('open','closed') default 'open'`, timestamps. Indexes: `(status, created_at)`, `(category_id)`.
- **bids** — `id`, `user_id FK→users onDelete cascade`, `job_id FK→jobs onDelete cascade`, `proposed_price decimal(12,2)`, `estimated_delivery_time varchar(60)`, `cover_letter text`, `experience_summary text`, `status enum('pending','accepted','rejected') default 'pending'`, timestamps, **`unique(user_id, job_id)`**.

**Seed plan**
- 1 demo accountant: `demo@accountant-hub.test` / `password`
- 4 additional users
- 6 categories: Bookkeeping, Tax Preparation, Audit, Payroll, Financial Reporting, Advisory
- ~30 jobs (80% open / 20% closed), varied budgets/dates
- ~50 bids distributed across jobs and users (respecting unique constraint), so `bids_count` is interesting

---

## 6. API Plan

All under `routes/api.php`, JSON. Sanctum `auth:sanctum` middleware where marked.

| Method | Path | Auth | Action | Resource |
|---|---|---|---|---|
| POST | `/api/register` | – | `RegisterAccountantAction` | `UserResource` + token |
| POST | `/api/login` | – | `LoginAccountantAction` | `UserResource` + token |
| POST | `/api/logout` | ✓ | revoke current token | `{success:true}` |
| GET  | `/api/me` | ✓ | return current user | `UserResource` |
| GET  | `/api/categories` | – | list categories | `JobCategoryResource` |
| GET  | `/api/jobs` | – | `ListJobsAction` via `JobQuery` | `JobListResource` (paginated) |
| GET  | `/api/jobs/{job}` | – | `ShowJobAction` | `JobDetailResource` |
| POST | `/api/jobs/{job}/bids` | ✓ | `SubmitBidAction` | `BidResource` (201) |
| GET  | `/api/my-bids` | ✓ | `ListMyBidsAction` | `BidResource` (paginated) |

**Filters on `/api/jobs`:** `search`, `category` (**slug**), `budget_min`, `budget_max`, `sort=newest|highest_budget`, `page`, `per_page` (capped at 50).

**Status codes:** 200/201 success, 401 unauth, 403 forbidden, 404 not found, 409 duplicate bid / closed job (business conflict), 422 validation.

**Response envelope:**
- success: `{success, message, data}`
- validation: Laravel default `{message, errors}`
- business error: `{success:false, message, code}`

---

## 7. Frontend Plan

**Pages (App Router)**
- `/` — hero + featured categories + latest 6 jobs (server fetch).
- `/jobs` — server-rendered listing using search params for filters; client `JobFilters` updates URL; pagination via `?page=`.
- `/jobs/[id]` — server-rendered detail; client `BidForm` mounted with auth-aware CTA (login prompt / disabled-closed / already-applied / open form).
- `/login`, `/register` — client forms, redirect on success.
- `/dashboard/my-bids` — protected; client-rendered list of user's bids with status badges.

**Shared components**
- `components/ui/*` — `Button`, `Input`, `Select`, `Textarea`, `Badge`, `Alert`, `Skeleton`, `EmptyState`, `Pagination`.
- `components/jobs/*` — `JobCard`, `JobFilters`, `JobDetailHeader`.
- `components/bids/*` — `BidForm`, `MyBidCard`, `BidStatusBadge`.
- `components/layout/*` — `Navbar` (auth-aware), `Footer`, `Container`.
- `components/auth/*` — `AuthProvider`, `RequireAuth`, `GuestOnly`.

**Design tokens (Tailwind)**
- `--color-brand: #019a51`
- `--color-ink: #0a0a0a`
- Inter font
- Card-based jobs grid (1/2/3 columns at sm/md/lg)
- Status badge: open = brand green, closed = gray
- Toasts via `sonner`

---

## 8. Risks and Assumptions

**Assumptions**
1. Single role: every registered user is an accountant (no company role for posting jobs — jobs come from seeders).
2. `attachments` is a placeholder (JSON column, no upload pipeline) per spec.
3. `required_skills` stored as JSON array of strings.
4. Sanctum **token** mode (not SPA cookie mode), because the frontend will run on Vercel (different origin than VPS). Bearer header from frontend.
5. MySQL 8 locally and in prod.
6. Node 20 LTS, PHP 8.3, Laravel 11.
7. **Tailwind** over Bootstrap+SCSS (confirmed by user).
8. `category` filter accepts the category **slug** (confirmed by user).
9. Frontend stores Sanctum token in `localStorage` (acceptable for assessment scope; documented tradeoff vs. httpOnly cookie).
10. No real email verification flow (out of scope).

**Risks**
- **CORS + Sanctum config drift** between local and Vercel/VPS — easy to break. Pin `FRONTEND_URL` env on backend and validate early.
- **Deployment of MySQL on Plesk** may require shared-hosting tweaks — addressed in README only.
- **`bids_count` performance** — `withCount` per-page is fine for the assessment dataset; a counter cache would be over-engineering.
- **Duplicate-bid race condition** — covered by DB unique index; backend catches `QueryException` 23000 and returns 409.
- **Time zone for `deadline`/`created_at`** — store UTC, format client-side.
- **Laravel Boost MCP on Windows** — document both `.codex/config.toml` and `.mcp.json` for cross-tool support.

---

## 9. Implementation Phases (Roadmap)

| Phase | Goal |
|---|---|
| **0** | Repository analysis (this document). |
| **1** | Backend foundation: Laravel 11 scaffold, Boost, Sanctum, models, migrations, enums, factories, seeders. |
| **2** | Auth API: register, login, logout, me. Form requests, action classes, `UserResource`, tests. |
| **3** | Jobs API: categories endpoint, jobs listing with `JobQuery`, job details, resources, filters/sort/pagination, tests. |
| **4** | Bids API: submit bid, `BidEligibilityService`, duplicate/closed-job prevention, my-bids endpoint, tests. |
| **5** | Frontend foundation: Next.js scaffold, Tailwind tokens, `lib/api.ts`, `lib/auth.ts`, shared UI components, layout. |
| **6** | Jobs UI: home, listing, filters, pagination, job cards, empty/loading states. |
| **7** | Job details + submit bid UI: detail page, `BidForm`, auth-aware CTA, success/error/already-applied/closed states. |
| **8** | Dashboard: my submitted bids page, bid cards, status badges, responsive layout. |
| **9** | Polish: responsive QA, a11y basics, error handling, README, seeded credentials. |
| **10** | Deployment: Vercel frontend, VPS/Plesk backend, env vars, CORS, live URL in README. |

---

## 10. Phase 1 — Files to Create / Update

**Goal of Phase 1:** scaffold Laravel 11 under `backend/`, install Boost + Sanctum, define the domain model, migrate, seed. No API endpoints yet (Phase 2). At the end, `php artisan migrate:fresh --seed` produces a working DB with demo data.

**Bootstrap (run, not author):**
- `composer create-project laravel/laravel backend "^11.0"`
- `composer require laravel/sanctum`
- `composer require laravel/boost --dev`
- `php artisan install:api`
- `php artisan boost:install`

**Files to create:**
- `backend/.env.example` — DB, `APP_URL`, `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS` left blank for token mode.
- `backend/app/Enums/JobStatus.php` — `Open`, `Closed` (string-backed).
- `backend/app/Enums/BidStatus.php` — `Pending`, `Accepted`, `Rejected`.
- `backend/app/Models/JobCategory.php` — `hasMany(Job::class)`.
- `backend/app/Models/Job.php` — `belongsTo(JobCategory)`, `hasMany(Bid)`, casts for `required_skills`/`attachments`/`status`/`deadline`.
- `backend/app/Models/Bid.php` — `belongsTo(User)`, `belongsTo(Job)`, `status` cast to enum.
- `backend/app/Models/User.php` — **update**: add `HasApiTokens`, `hasMany(Bid)`.
- `backend/database/migrations/xxxx_create_job_categories_table.php`
- `backend/database/migrations/xxxx_create_jobs_table.php`
- `backend/database/migrations/xxxx_create_bids_table.php` — includes `$table->unique(['user_id','job_id']);`.
- `backend/database/factories/JobCategoryFactory.php`
- `backend/database/factories/JobFactory.php` — realistic accounting titles, varied budgets/dates, 80% open / 20% closed.
- `backend/database/factories/BidFactory.php`
- `backend/database/seeders/JobCategorySeeder.php` — 6 fixed categories.
- `backend/database/seeders/JobSeeder.php` — ~30 jobs.
- `backend/database/seeders/BidSeeder.php` — ~50 bids respecting unique constraint.
- `backend/database/seeders/DatabaseSeeder.php` — **update**: seed demo accountant + 4 other users + call category/job/bid seeders.
- `backend/config/cors.php` — **update**: allow `FRONTEND_URL`.
- `backend/config/sanctum.php` — **update**: token guard config.

**Files to create at repo root:**
- `.mcp.json` — register Laravel Boost MCP server pointing at `backend/`.
- `.gitignore` — **update** to ignore `backend/vendor`, `backend/.env`, `frontend/node_modules`, `frontend/.env*`, `frontend/.next`.

**Phase 1 acceptance checks:**
- `php artisan migrate:fresh --seed` succeeds.
- `php artisan route:list` shows only default Sanctum routes (expected — API routes added in Phase 2).
- `php artisan pint` clean.
- Boost MCP responds to `application-info`.

---

## 11. Open Decisions (Locked from User)

| Question | Answer |
|---|---|
| Styling stack | **Tailwind CSS** |
| Laravel version | **Laravel 11** |
| `category` filter | **By slug** |
| Repo shape | **Monorepo (`backend/` + `frontend/`)** |

---

*Awaiting approval to proceed with Phase 1.*
