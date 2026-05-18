# Accountant Hub

A marketplace-style web application where accounting professionals browse open jobs and submit competitive bids. Built as a full-stack assessment project demonstrating clean architecture, polished UI, and production-ready patterns.

---

## Features

- Browse and filter accounting jobs by title, category, budget range, and sort order
- Paginated job listing with loading skeletons and empty states
- Job detail page with full description, required skills, budget, and deadline
- Submit bid with proposed price, delivery time, cover letter, and experience summary
- Duplicate-bid prevention enforced at business logic, database, and UI levels
- Closed-job protection — bids rejected for jobs no longer accepting applications
- My Bids dashboard showing all submitted bids with status tracking
- Register, login, and logout with Sanctum token authentication
- Auth guards — authenticated users redirected away from login/register pages
- Guest prompt on job detail — guests see a login CTA instead of the bid form
- Responsive design across mobile, tablet, and desktop

---

## Bonus Features Implemented

- Dashboard page (My Bids) with pagination and empty state
- Job status handling (Open / Closed) with visual badges
- Multi-category filter with comma-separated URL encoding
- SPA progress bar (nextjs-toploader)
- Password strength meter on register
- Show/hide password toggle on login and register
- API Resources for clean, consistent response formatting
- Seeded demo data with realistic jobs, categories, and bids
- Feature tests for auth, jobs listing, job detail, bid submission, and my bids

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Next.js 16.2.6, React 19, TypeScript, Tailwind CSS v4 |
| Backend    | Laravel 11, PHP 8.2                             |
| Auth       | Laravel Sanctum (token-based)                   |
| Database   | MySQL                                           |
| Validation | Zod v4 (frontend), Laravel Form Requests (backend) |
| Forms      | React Hook Form                                 |

---

## Architecture Overview

### Backend

```
app/
├── Actions/
│   ├── Auth/          RegisterAccountantAction, LoginAccountantAction
│   ├── Jobs/          ListJobsAction, ShowJobAction
│   └── Bids/          SubmitBidAction, ListMyBidsAction
├── Enums/             JobStatus, BidStatus
├── Http/
│   ├── Controllers/   Thin controllers — delegate to Actions
│   ├── Requests/      RegisterRequest, LoginRequest, JobIndexRequest, SubmitBidRequest
│   └── Resources/     UserResource, JobListResource, JobDetailResource, BidResource, JobCategoryResource
├── Models/            User, Job, JobCategory, Bid
└── Queries/           JobQuery — handles search, filter, sort, pagination
```

Controllers receive requests, call Actions, and return Resources. All business logic lives in Actions. `JobQuery` is a dedicated query object for the jobs listing endpoint.

### Frontend

```
app/
├── page.tsx              Landing page
├── jobs/
│   ├── page.tsx          Jobs listing
│   └── [id]/page.tsx     Job detail
├── login/page.tsx
├── register/page.tsx
└── dashboard/page.tsx    My Bids
components/
├── auth/                 AuthProvider (context), LoginContent, RegisterContent
├── bids/                 BidForm, MyBidCard, MyBidsContent
├── home/                 GuestButtons (auth-conditional CTAs)
├── jobs/                 JobCard, JobFilters, JobDetail, JobsContent
├── layout/               Navbar, Footer, Container
└── ui/                   Button, Badge, Input, Textarea, Alert, Skeleton, EmptyState, Pagination, PasswordInput, PasswordStrength
lib/
├── api.ts                Fetch wrapper with bearer token injection
├── auth.ts               localStorage token helpers
└── formatters.ts         Currency, date, and relative-time formatters
types/                    user.ts, job.ts, bid.ts, api.ts
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

| Variable              | Description                              | Default                    |
|-----------------------|------------------------------------------|----------------------------|
| `APP_URL`             | Backend base URL                         | `http://localhost:8000`    |
| `DB_DATABASE`         | MySQL database name                      | `accountant_hub`           |
| `DB_USERNAME`         | MySQL username                           | `root`                     |
| `DB_PASSWORD`         | MySQL password                           | _(empty)_                  |
| `FRONTEND_URL`        | Frontend URL for CORS                    | `http://localhost:3000`    |
| `SANCTUM_STATEFUL_DOMAINS` | Sanctum stateful domains          | `localhost:3000`           |

### Frontend (`frontend/.env.local`)

| Variable              | Description                              | Default                          |
|-----------------------|------------------------------------------|----------------------------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL                     | `http://localhost:8000/api`      |

---

## API Endpoints

### Auth

| Method | Endpoint       | Auth     | Description          |
|--------|----------------|----------|----------------------|
| POST   | `/api/register`| —        | Register accountant  |
| POST   | `/api/login`   | —        | Login                |
| POST   | `/api/logout`  | Required | Logout               |
| GET    | `/api/me`      | Required | Current user         |

### Jobs

| Method | Endpoint          | Auth     | Description              |
|--------|-------------------|----------|--------------------------|
| GET    | `/api/jobs`       | —        | List jobs (with filters) |
| GET    | `/api/jobs/{id}`  | Optional | Job detail               |

**Job listing query params:**

| Param        | Type   | Description                        |
|--------------|--------|------------------------------------|
| `search`     | string | Filter by title                    |
| `category`   | string | Comma-separated category slugs     |
| `budget_min` | number | Minimum budget filter              |
| `budget_max` | number | Maximum budget filter              |
| `sort`       | string | `newest` or `highest_budget`       |
| `page`       | number | Page number                        |
| `per_page`   | number | Results per page (max 50)          |

### Categories

| Method | Endpoint          | Auth | Description       |
|--------|-------------------|------|-------------------|
| GET    | `/api/categories` | —    | List all categories |

### Bids

| Method | Endpoint               | Auth     | Description          |
|--------|------------------------|----------|----------------------|
| POST   | `/api/jobs/{id}/bids`  | Required | Submit a bid         |
| GET    | `/api/my-bids`         | Required | My submitted bids    |

---

## Demo Credentials

All demo accounts use the password: **`password`**

| Name            | Email                           |
|-----------------|---------------------------------|
| Demo Accountant | demo@accountant-hub.test        |
| Sarah Mitchell  | sarah@accountant-hub.test       |
| James Carter    | james@accountant-hub.test       |
| Priya Sharma    | priya@accountant-hub.test       |
| Thomas Nguyen   | thomas@accountant-hub.test      |

---

## Running Tests

```bash
cd backend
php artisan test
```

Test coverage includes:
- Auth: register, login, logout, duplicate email
- Jobs: listing, filters, pagination, job detail
- Bids: submit bid, duplicate bid prevention, closed job prevention
- My Bids: returns only the authenticated user's bids

---

## Deployment Notes

### Backend (VPS / Plesk / Laravel Hosting)

1. Upload `backend/` to your server
2. Set `APP_ENV=production` and `APP_DEBUG=false`
3. Generate app key: `php artisan key:generate`
4. Configure production database credentials
5. Run: `php artisan migrate --force`
6. Set `FRONTEND_URL` to your deployed frontend domain
7. Point your web server document root to `backend/public/`

### Frontend (Vercel)

1. Import the `frontend/` directory as a Vercel project
2. Set `NEXT_PUBLIC_API_URL` to your deployed backend API URL
3. Deploy — Vercel handles the build automatically

---

## Assumptions

- Authentication is accountant-only — there is no separate client/admin role
- Job creation and management is out of scope (handled via seeders for demo)
- Bid status (`pending` / `accepted` / `rejected`) is set by seeder; no admin UI for changing it
- File attachments are stored as filename strings (no actual file upload in this version)
- All monetary values are in USD
