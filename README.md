# Accountant Hub

A marketplace-style web application where businesses post accounting jobs and qualified accountants submit competitive bids. Built as a full-stack assessment project demonstrating clean architecture, role-based access control, and production-ready patterns.

---

## Live Demo

- **Frontend (Vercel):** https://accountant-hub.vercel.app
- **Backend API (Plesk):** https://accountant-hub.khantarish.com/api

### Quick reviewer guide

1. Open the frontend URL.
2. Click **Sign In** → enter `demo@accountant-hub.test` / `password`, choose **"I'm an Accountant"** → bid on any open job.
3. Sign out, sign back in with the same email but choose **"I'm Hiring"** → post a job, see incoming bids, accept/reject them.
4. Or, from the navbar dropdown, **Switch Role** without logging out.

### Demo credentials

All demo accounts share the password: **`password`**. Role is chosen at login, so any account can be used as either an accountant or a client.

| Name            | Email                           | Seeded role |
|-----------------|---------------------------------|-------------|
| Demo User       | demo@accountant-hub.test        | Accountant  |
| Sarah Mitchell  | sarah@accountant-hub.test       | Accountant  |
| James Carter    | james@accountant-hub.test       | Accountant  |
| Priya Sharma    | priya@accountant-hub.test       | Accountant  |
| Thomas Nguyen   | thomas@accountant-hub.test      | Accountant  |
| Alex Morgan     | alex@accountant-hub.test        | Client      |
| Jordan Lee      | jordan@accountant-hub.test      | Client      |
| Chris Evans     | chris@accountant-hub.test       | Client      |

> The "Seeded role" column reflects who owns existing seeded jobs/bids. Login is independent — you can sign in as either role with any account.

---

## Features

### Core
- Browse and filter accounting jobs by title, category, budget range, date range, and sort order
- Paginated job listing with loading skeletons and empty states
- Job detail page with full description, required skills, budget, deadline, and file attachments
- Submit bid with proposed price, delivery time, cover letter, and experience summary
- Duplicate-bid prevention enforced at business logic, database, and UI levels
- Closed-job protection — bids rejected for jobs no longer accepting applications

### Role-Based Sessions
- Users register once with no role; role is chosen at login ("Sign in as Accountant" or "Sign in as Client")
- Role is stored as a Sanctum token ability — not on the user account
- Switch role at any time without signing out; old token is revoked and a new one issued
- Accountants can browse jobs and bid; they cannot post jobs
- Clients can post and manage their own jobs; they cannot bid

### Client Features
- Post, edit, and delete jobs
- Attach files to jobs (upload, download, delete); original filenames preserved
- View all bids on each job; accept or reject individual bids
- Accepting a bid automatically closes the job and rejects all other pending bids

### Accountant Features
- My Bids dashboard showing all submitted bids with status (pending / accepted / rejected)
- Paginated bid list with empty state

### UI & Auth
- Navbar hover dropdown: Profile, Switch Role, Sign Out
- Profile page showing current user details and active role
- Auth guards — authenticated users redirected away from login/register pages
- Guest prompt on job detail — guests see a login CTA instead of the bid form
- Responsive design across mobile, tablet, and desktop
- SPA progress bar, password strength meter, show/hide password toggle

---

## Tech Stack

| Layer      | Technology                                         |
|------------|----------------------------------------------------|
| Frontend   | Next.js 16.2.6, React 19, TypeScript, Tailwind CSS v4 |
| Backend    | Laravel 11, PHP 8.2                                |
| Auth       | Laravel Sanctum (token-based, role as token ability) |
| Database   | MySQL                                              |
| Validation | Zod v4 (frontend), Laravel Form Requests (backend) |
| Forms      | React Hook Form with standardSchemaResolver        |

---

## Architecture Overview

### Backend

```
app/
├── Actions/
│   ├── Auth/          RegisterAccountantAction, LoginAccountantAction
│   ├── Jobs/          ListJobsAction, ShowJobAction, UploadJobAttachmentAction, DeleteJobAttachmentAction
│   └── Bids/          SubmitBidAction, ListMyBidsAction, UpdateBidStatusAction
├── Enums/             JobStatus, BidStatus, UserRole
├── Http/
│   ├── Controllers/   Thin controllers — delegate to Actions
│   ├── Middleware/    EnsureRole — checks Sanctum token ability
│   ├── Requests/      RegisterRequest, LoginRequest, JobIndexRequest, SubmitBidRequest
│   └── Resources/     UserResource, JobListResource, JobDetailResource, BidResource, JobCategoryResource
├── Models/            User, Job, JobCategory, Bid
└── Queries/           JobQuery — handles search, filter, sort, pagination
```

Controllers receive requests, call Actions, and return Resources. Role is enforced via `EnsureRole` middleware which calls `$user->tokenCan($role)`. `JobQuery` is a dedicated query object for the jobs listing endpoint.

### Frontend

```
app/
├── page.tsx                  Landing page
├── jobs/
│   ├── page.tsx              Jobs listing
│   └── [id]/page.tsx         Job detail
├── login/page.tsx
├── register/page.tsx
├── dashboard/page.tsx        My Bids (accountant)
├── profile/page.tsx          Profile page
└── client/
    └── jobs/
        ├── page.tsx          My Jobs (client)
        ├── new/page.tsx      Post a job
        └── [id]/
            ├── page.tsx      Client job detail + bid list
            └── edit/page.tsx Edit job + manage attachments
components/
├── auth/                     AuthProvider (context), LoginContent, RegisterContent
├── bids/                     BidForm, MyBidCard, MyBidsContent
├── client/                   PostJobForm, AttachmentDropzone, ClientJobDetail
├── home/                     HomeContent, GuestButtons
├── jobs/                     JobCard, JobFilters, JobDetail, JobsContent
├── layout/                   Navbar (with dropdown), Footer, Container
└── ui/                       Button, Badge, Input, Textarea, Alert, Skeleton, EmptyState, Pagination, PasswordInput, PasswordStrength
lib/
├── api.ts                    Fetch wrapper with bearer token injection and FormData support
├── auth.ts                   localStorage token helpers
└── formatters.ts             Currency, date, and relative-time formatters
types/                        user.ts, job.ts, bid.ts, api.ts
```

---

## Setup Instructions

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 20+
- MySQL

---

### Backend Setup

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
```

Configure your database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=accountant_hub
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations and seed demo data:

```bash
php artisan migrate:fresh --seed
php artisan storage:link
```

Start the development server:

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`.

---

### Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable                   | Description                              | Default                    |
|----------------------------|------------------------------------------|----------------------------|
| `APP_URL`                  | Backend base URL                         | `http://localhost:8000`    |
| `DB_DATABASE`              | MySQL database name                      | `accountant_hub`           |
| `DB_USERNAME`              | MySQL username                           | `root`                     |
| `DB_PASSWORD`              | MySQL password                           | _(empty)_                  |
| `FRONTEND_URL`             | Frontend URL for CORS                    | `http://localhost:3000`    |
| `SANCTUM_STATEFUL_DOMAINS` | Sanctum stateful domains                 | `localhost:3000`           |

### Frontend (`frontend/.env.local`)

| Variable              | Description              | Default                          |
|-----------------------|--------------------------|----------------------------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL     | `http://localhost:8000/api`      |

---

## API Endpoints

### Auth

| Method | Endpoint              | Auth     | Description                                              |
|--------|-----------------------|----------|----------------------------------------------------------|
| POST   | `/api/register`       | —        | Create account (no token returned — login separately)    |
| POST   | `/api/login`          | —        | Login; requires `role: "accountant"` or `"client"`       |
| POST   | `/api/switch-role`    | Required | Swap role; revokes current token, issues new one         |
| POST   | `/api/logout`         | Required | Revoke current token                                     |
| GET    | `/api/me`             | Required | Current user (role read from token ability)              |

### Jobs (Public)

| Method | Endpoint           | Auth     | Description              |
|--------|--------------------|----------|--------------------------|
| GET    | `/api/jobs`        | —        | List jobs (with filters) |
| GET    | `/api/jobs/years`  | —        | Available posting years  |
| GET    | `/api/jobs/{id}`   | Optional | Job detail + attachments |

**Job listing query params:**

| Param        | Type   | Description                                            |
|--------------|--------|--------------------------------------------------------|
| `search`     | string | Filter by title                                        |
| `category`   | string | Comma-separated category slugs                         |
| `budget_min` | number | Minimum budget filter                                  |
| `budget_max` | number | Maximum budget filter                                  |
| `status`     | string | `open` (default), `closed`, or `all`                   |
| `date_from`  | string | From month, format: `YYYY-MM`                          |
| `date_to`    | string | To month, format: `YYYY-MM`                            |
| `sort`       | string | `newest` or `highest_budget`                           |
| `page`       | number | Page number                                            |
| `per_page`   | number | Results per page (max 50)                              |

### Categories

| Method | Endpoint          | Auth | Description         |
|--------|-------------------|------|---------------------|
| GET    | `/api/categories` | —    | List all categories |

### Accountant — Bids

Requires a token with ability `accountant`.

| Method | Endpoint              | Auth     | Description        |
|--------|-----------------------|----------|--------------------|
| POST   | `/api/jobs/{id}/bids` | Required | Submit a bid       |
| GET    | `/api/my-bids`        | Required | My submitted bids  |

### Client — Jobs

Requires a token with ability `client`. All routes prefixed with `/client`.

| Method | Endpoint                           | Auth     | Description                        |
|--------|------------------------------------|----------|------------------------------------|
| GET    | `/api/client/jobs`                 | Required | List owned jobs                    |
| POST   | `/api/client/jobs`                 | Required | Create a new job                   |
| GET    | `/api/client/jobs/{id}`            | Required | Job detail (owned)                 |
| PATCH  | `/api/client/jobs/{id}`            | Required | Update a job                       |
| DELETE | `/api/client/jobs/{id}`            | Required | Delete a job                       |
| POST   | `/api/client/jobs/{id}/attachments`| Required | Upload a file attachment           |
| DELETE | `/api/client/jobs/{id}/attachments`| Required | Delete a file attachment           |

### Client — Bid Management

Requires a token with ability `client`.

| Method | Endpoint                              | Auth     | Description                                               |
|--------|---------------------------------------|----------|-----------------------------------------------------------|
| GET    | `/api/client/jobs/{id}/bids`          | Required | List all bids on a job                                    |
| PATCH  | `/api/client/jobs/{id}/bids/{bidId}`  | Required | Accept or reject a bid (`status: accepted` or `rejected`) |

> Accepting a bid closes the job and automatically rejects all other pending bids.

---

## Running Tests

```bash
cd backend
php artisan test
```

**45 feature tests / 164 assertions covering:**
- **Auth** — register validation, duplicate email, login with required role, wrong password, logout, `/me`, token-issued-with-role-ability
- **Jobs** — listing structure, search, multi-category filter, budget range, sort by newest/highest budget, pagination, status filter default-to-open / closed-only / all, invalid sort & status rejection, detail endpoint, 404 on missing
- **Bids** — submit (success / guest blocked / closed job / duplicate / validation / 404), my-bids list scoped to current user, empty state, auth required
- **Job detail** — includes `user_has_bid` for authenticated users, omits for guests

---

## Deployment Notes

### Backend (VPS / Plesk / Laravel Hosting)

1. Upload `backend/` to your server
2. Set `APP_ENV=production` and `APP_DEBUG=false`
3. Generate app key: `php artisan key:generate`
4. Configure production database credentials
5. Run: `php artisan migrate --force`
6. Run: `php artisan storage:link` (required for file attachment public URLs)
7. Set `FRONTEND_URL` to your deployed frontend domain
8. Point your web server document root to `backend/public/`

### Frontend (Vercel)

1. Import the `frontend/` directory as a Vercel project
2. Set `NEXT_PUBLIC_API_URL` to your deployed backend API URL
3. Deploy — Vercel handles the build automatically

---

## Assumptions & Design Decisions

These are the non-obvious choices made while building, called out for the reviewer.

### Role is a token ability, not a user column

The brief required only accountant authentication and treated clients as out-of-scope. To make the live demo demonstrable end-to-end (post a job → bid on it → accept the bid), I built a lightweight client side as well. Rather than adding a `role` column to users (which would lock each account to one side), the role is stored as a **Sanctum token ability**: it's chosen at login, can be switched any time via `POST /api/switch-role`, and middleware (`role:accountant` / `role:client`) checks `$user->tokenCan($role)`. This means the same demo email can sign in as either role for testing.

### Browse-jobs listing defaults to open-only

Closed jobs are hidden by default on `GET /api/jobs` to match standard marketplace behavior. Pass `status=closed` or `status=all` to opt-in. Closed jobs remain reachable directly by ID (`GET /api/jobs/{id}`) and via the client's "My Jobs" page.

### Accepting a bid is transactional

`PATCH /api/client/jobs/{id}/bids/{bidId}` with `status=accepted` does three writes: mark the bid accepted, set the job to closed, reject all other pending bids on that job. All three run inside `DB::transaction` so partial state is impossible.

### Duplicate-bid prevention is three-layered

The brief required preventing duplicate bids. I enforce this at:
1. **Database** — unique index on `(user_id, job_id)` on the `bids` table
2. **Business logic** — `BidEligibilityService` checks before insert
3. **Frontend UX** — `user_has_bid` flag from the job detail endpoint flips the bid form to a "Bid Submitted" state

The DB constraint catches the race condition between the service check and the insert — the action catches `UniqueConstraintViolationException` and returns a clean 409.

### Attachments

The brief mentioned an "attachments placeholder, if any". I implemented real uploads with drag-and-drop. Uploaded filenames are **slugified and given a random suffix** to prevent collisions and path-traversal (e.g. `invoice.pdf` becomes `invoice-a3b7c2d9.pdf`). The original filename isn't preserved in storage but is reflected in the displayed name.

### Bid cannot target own job

An accountant cannot bid on a job they posted as a client (since the same user account can switch roles). Enforced in `BidEligibilityService` (409 from API) and in the UI (bid form replaced with a "This is your job" card).

### Closed jobs cannot be edited

`JobPolicy::update` returns false when `$job->status === Closed`. The PATCH endpoint then 403s. Frontend `/edit` page also redirects away.

### DB-agnostic queries

`/api/jobs/years` originally used MySQL's `YEAR()` function which breaks on SQLite (used by tests and local dev). It now pulls `created_at` and maps to years in PHP so it works on any driver.

### CORS

Only the origin in `FRONTEND_URL` (production `.env`) is allowed. No wildcard. Multiple comma-separated origins are supported.

### What I deliberately did **not** build

- Password reset / email verification — not in the brief
- Admin panel — not in the brief
- Real-time bid notifications — not in the brief
- Payment processing — not in the brief
- User profile editing beyond viewing — not in the brief

---

## Submission Checklist

- [x] GitHub repository — see repo URL
- [x] Live demo URL — https://accountant-hub.vercel.app
- [x] Test credentials — see [Live Demo](#live-demo) section above
- [x] README — this file
- [x] Tech stack documented
- [x] Setup instructions for both backend and frontend
- [x] API endpoints documented + Postman collection (`Accountant-Hub.postman_collection.json`)
- [x] Assumptions documented (above)
- [x] Seeded demo data (3 clients, 5 accountants, 30 jobs, sample bids)
- [x] 45 backend feature tests passing
