# Accountant Hub — AI Skills File

> Project: Accountant Hub  
> Stack: Next.js + Laravel API + MySQL + Laravel Sanctum  
> Goal: Build a polished full-stack assessment project with clean code, SOLID principles, practical design patterns, strong UI/UX, seeded demo data, deployment readiness, and a professional README.

---

## 1. Product Context

Accountant Hub is a small marketplace-style web application, similar in concept to Upwork, where companies post accounting jobs and accountants browse jobs, view details, and submit bids.

The application must prove that a solo full-stack developer can think through:
- Product requirements
- UI/UX
- Frontend implementation
- Backend implementation
- Database structure
- API design
- Authentication
- Deployment
- Clean code and business logic

---

## 2. Required Features

### 2.1 Jobs Listing Page

Create a page that displays available accounting jobs.

Each job card must show:
- Job title
- Company/client name
- Short description
- Budget range
- Deadline
- Job category
- Number of bids received
- Posted date
- Status: Open / Closed

Required filters:
- Search by job title
- Filter by category
- Filter by budget range
- Sort by newest
- Sort by highest budget

Expected UX:
- Clean responsive grid
- Clear job cards
- Status badges
- Empty state when no jobs match filters
- Loading state
- Pagination

---

### 2.2 Job Details Page

The job details page must show:
- Full job description
- Client/company information
- Required skills
- Expected delivery time
- Budget
- Attachments placeholder, if any
- Existing bids count
- Apply / Submit Bid button

Expected UX:
- Clear visual hierarchy
- Sticky or prominent bid CTA on desktop
- Disabled CTA when job is closed
- Login prompt when user is not authenticated
- Clear already-applied state when accountant already submitted a bid

---

### 2.3 Submit Bid Flow

Authenticated accountants must be able to submit a bid.

Bid form fields:
- Proposed price
- Estimated delivery time
- Cover letter / proposal message
- Relevant experience summary

Rules:
- Only authenticated accountants can submit bids.
- A user can submit only one bid per job.
- Closed jobs cannot receive bids.
- Submitted bid must be persisted in database.
- Show success message after submission.
- Show validation errors clearly.

Duplicate-bid prevention must exist in both:
1. Frontend UX layer
2. Backend validation/database layer

---

### 2.4 Authentication

Required:
- Register
- Login
- Logout
- Authenticated user endpoint

Only logged-in accountants can submit bids.

Use Laravel Sanctum token-based authentication for separated Next.js frontend and Laravel API backend.

---

## 3. Bonus Features To Implement

The project should include all bonus items from the assessment:

- Dashboard page showing my submitted bids
- Job status handling: Open / Closed
- Pagination for job listing
- Better filtering and sorting
- Reusable UI components
- API Resources / clean response formatting
- Deployment with live URL
- README with setup instructions
- Seeded demo data

Recommended additional polish:
- Form loading states
- Toast notifications
- Empty states
- Error boundaries / friendly error messages
- Skeleton loaders
- Responsive mobile navigation
- Consistent design tokens
- Demo test accountant account

---

## 4. Tech Stack

### Frontend

- Next.js App Router
- TypeScript
- React
- Bootstrap + SCSS or Tailwind CSS
- Axios or Fetch wrapper
- Cookie/local token handling
- Reusable components

Recommended frontend folders:

```txt
frontend/
├── app/
│   ├── page.tsx
│   ├── jobs/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── dashboard/
│       └── my-bids/page.tsx
│
├── components/
│   ├── layout/
│   ├── jobs/
│   ├── bids/
│   ├── auth/
│   └── ui/
│
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── formatters.ts
│
├── types/
│   ├── user.ts
│   ├── job.ts
│   ├── bid.ts
│   └── api.ts
│
└── styles/
```

### Backend

- Laravel API
- Laravel Sanctum
- MySQL
- Eloquent ORM
- Form Requests
- API Resources
- Seeders
- Migrations
- Practical service/action classes
- Tests where useful

Recommended backend folders:

```txt
backend/
├── app/
│   ├── Actions/
│   │   ├── Auth/
│   │   ├── Jobs/
│   │   └── Bids/
│   │
│   ├── Enums/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   ├── Requests/
│   │   └── Resources/
│   │
│   ├── Models/
│   ├── Queries/
│   └── Services/
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
│
└── routes/
    └── api.php
```

---

## 5. Backend Architecture Rules

### 5.1 Controllers Must Stay Thin

Controllers should:
- Receive request
- Authorize/check authentication where needed
- Call action/service/query class
- Return API resource/JSON response

Controllers should not contain:
- Complex business logic
- Long query-building code
- Duplicate validation logic

---

### 5.2 Use Form Requests

Use Form Request classes for validation:

Recommended requests:
- RegisterRequest
- LoginRequest
- JobIndexRequest
- SubmitBidRequest

Validation must be readable and reusable.

---

### 5.3 Use API Resources

Use Laravel API Resources for clean response formatting:

Recommended resources:
- UserResource
- JobCategoryResource
- JobListResource
- JobDetailResource
- BidResource

Benefits:
- Consistent JSON shape
- No leaking unnecessary DB fields
- Cleaner frontend integration

---

### 5.4 Use Action / Service Classes

Use practical action classes for business operations.

Recommended:
- `RegisterAccountantAction`
- `LoginAccountantAction`
- `ListJobsAction`
- `ShowJobAction`
- `SubmitBidAction`
- `ListMyBidsAction`

Business logic such as preventing duplicate bids belongs in `SubmitBidAction`, not inside the controller.

---

### 5.5 Use Query Object For Job Filtering

Create a dedicated query class to keep filters clean:

Recommended:
- `App\Queries\JobQuery`

Responsibilities:
- Search by title
- Filter by category
- Filter by budget range
- Sort newest
- Sort highest budget
- Include bids count
- Paginate

---

### 5.6 Database-Level Protection

The bids table must include a unique index:

```php
$table->unique(['user_id', 'job_id']);
```

This is mandatory to guarantee no duplicate bid can be submitted even if frontend validation fails.

---

## 6. SOLID Principles Applied

### Single Responsibility Principle

Each class should have one clear responsibility:
- Controller handles HTTP only
- Form Request validates input
- Action handles business operation
- Resource shapes response
- Model defines relationships
- Query object handles filtering/sorting

### Open/Closed Principle

Filtering/sorting should be extendable without rewriting controllers.

Example:
- Add new filters inside `JobQuery`
- Keep API route/controller stable

### Liskov Substitution Principle

Avoid inheritance-heavy design unless needed. Prefer composition and simple contracts.

### Interface Segregation Principle

Do not create large generic interfaces. Keep interfaces focused only if the project genuinely needs them.

### Dependency Inversion Principle

Actions/services may depend on abstractions only when useful. Do not over-engineer repository interfaces unless they add real value.

---

## 7. Practical Design Patterns

Use patterns where they improve clarity, not just to look advanced.

Recommended patterns:

### Action Pattern

Use for business operations:
- SubmitBidAction
- RegisterAccountantAction
- LoginAccountantAction

### Query Object Pattern

Use for complex listing filters:
- JobQuery

### Resource / Transformer Pattern

Use Laravel API Resources:
- JobResource
- BidResource

### Factory / Seeder Pattern

Use Laravel factories and seeders:
- Demo users
- Categories
- Jobs
- Bids

### Service Layer Pattern

Use only when logic grows beyond a single action.

Example:
- BidEligibilityService can check if a job is open and whether user already applied.

### Enum Pattern

Use enums/constants for:
- Job status: open, closed
- Bid status: pending, accepted, rejected

---

## 8. Suggested Database Schema

### users

```txt
id
name
email
password
created_at
updated_at
```

### job_categories

```txt
id
name
slug
created_at
updated_at
```

### jobs

```txt
id
category_id
title
company_name
short_description
description
budget_min
budget_max
deadline
expected_delivery_time
required_skills
attachments
status
created_at
updated_at
```

### bids

```txt
id
user_id
job_id
proposed_price
estimated_delivery_time
cover_letter
experience_summary
status
created_at
updated_at
unique(user_id, job_id)
```

Relationships:
- Job belongs to JobCategory
- Job has many Bids
- User has many Bids
- Bid belongs to User
- Bid belongs to Job

---

## 9. API Endpoints

### Auth

```txt
POST /api/register
POST /api/login
POST /api/logout
GET  /api/me
```

### Categories

```txt
GET /api/categories
```

### Jobs

```txt
GET /api/jobs
GET /api/jobs/{job}
```

Supported query params:

```txt
search
category
budget_min
budget_max
sort=newest|highest_budget
page
per_page
```

### Bids

```txt
POST /api/jobs/{job}/bids
GET  /api/my-bids
```

---

## 10. API Response Standards

Use consistent JSON:

### Success

```json
{
  "success": true,
  "message": "Bid submitted successfully.",
  "data": {}
}
```

### Validation Error

Use Laravel default validation error format or wrap consistently:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "proposed_price": ["The proposed price field is required."]
  }
}
```

### Business Error

```json
{
  "success": false,
  "message": "You have already submitted a bid for this job."
}
```

Recommended status codes:
- 200 OK
- 201 Created
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Validation Error
- 409 Conflict for duplicate bid/business conflict

---

## 11. Frontend UI/UX Direction

Colors:
- Black
- `#019a51`

Design style:
- Modern SaaS marketplace
- Clean, professional, trustworthy
- Strong spacing and typography
- Clear cards
- Consistent buttons and badges
- Excellent mobile responsiveness

Recommended sections:
- Hero section on home page
- Featured job categories
- Latest jobs preview
- Jobs listing page
- Job details page
- Submit bid modal or embedded form
- My bids dashboard

Core reusable components:
- Navbar
- Footer
- Button
- Input
- Select
- Textarea
- Badge
- JobCard
- JobFilters
- Pagination
- BidForm
- EmptyState
- LoadingSkeleton
- Alert/Toast
- ProtectedRoute or auth guard behavior

---

## 12. Frontend Auth Rules

Use a clear auth utility:
- Store token securely enough for assessment scope
- Attach token to API requests
- Redirect unauthenticated users from protected pages
- Show login prompt when trying to bid without auth
- Clear token on logout

Recommended:
- `lib/api.ts` for API client
- `lib/auth.ts` for auth helpers
- `AuthProvider` or simple state management if needed

---

## 13. Validation Rules

### Register

- name required
- email required, valid, unique
- password required, confirmed, min length

### Login

- email required
- password required

### Submit Bid

- proposed_price required, numeric, min 1
- estimated_delivery_time required
- cover_letter required, min length
- experience_summary required, min length

Business validation:
- user must be authenticated
- job must exist
- job must be open
- user must not already have a bid for the same job

---

## 14. Testing Expectations

Minimum backend feature tests:
- user can register
- user can login
- jobs can be listed
- job details can be viewed
- authenticated user can submit bid
- guest cannot submit bid
- user cannot submit duplicate bid
- user cannot bid on closed job
- user can view own bids

Minimum frontend checks:
- `npm run lint`
- `npm run build`

Minimum backend checks:
- `php artisan test`
- `php artisan route:list`
- `php artisan migrate:fresh --seed`
- `php artisan pint` if Pint is installed

---

## 15. Laravel Boost Usage Rules

When using an AI agent with Laravel Boost enabled:

1. Use Laravel Boost tools before changing Laravel code.
2. Inspect application info.
3. Inspect routes.
4. Inspect database schema when needed.
5. Search Laravel documentation through Boost before using framework APIs.
6. Use logs/errors from Boost when debugging.
7. Prefer Laravel best practices discovered from the project context.
8. Do not guess package versions.
9. Do not create files blindly without checking existing structure.
10. Use Artisan commands through Boost where appropriate.

---

## 16. Implementation Phases

### Phase 0 — Repository Analysis

Do not write code yet.

Return:
- Existing structure analysis
- Missing requirements
- Proposed architecture
- Database plan
- API plan
- Frontend plan
- Risks and assumptions
- Phase-by-phase implementation plan

### Phase 1 — Backend Foundation

- Create migrations
- Create models
- Create enums/constants
- Create factories
- Create seeders
- Configure Sanctum

### Phase 2 — Auth API

- Register
- Login
- Logout
- Me
- Auth resources
- Auth tests

### Phase 3 — Jobs API

- Categories endpoint
- Jobs listing endpoint
- Job details endpoint
- Filters
- Sorting
- Pagination
- Resources

### Phase 4 — Bids API

- Submit bid
- Prevent duplicate bids
- Prevent bidding on closed jobs
- My bids endpoint
- Tests

### Phase 5 — Frontend Foundation

- Next.js layout
- Theme/design tokens
- API client
- Auth handling
- Shared UI components

### Phase 6 — Jobs UI

- Home page
- Jobs listing
- Filters
- Pagination
- Job cards
- Empty/loading states

### Phase 7 — Job Details + Submit Bid

- Job details page
- Bid form
- Auth-aware CTA
- Success/error messages
- Already-applied state
- Closed-job state

### Phase 8 — Dashboard

- My submitted bids dashboard
- Bid cards/table
- Status badges
- Responsive layout

### Phase 9 — Polish

- Responsive QA
- UX polish
- Accessibility basics
- Code cleanup
- Error handling
- Loading states
- README
- Seeded credentials

### Phase 10 — Deployment

- Deploy frontend
- Deploy backend
- Configure environment variables
- Configure CORS
- Test live flow
- Update README with live URLs

---

## 17. Definition of Done

The project is complete only when:

- All required assessment features are implemented.
- All bonus features are implemented.
- Duplicate bids are impossible at database and application level.
- Auth flow works.
- Listing filters and sorting work.
- Dashboard works.
- UI is responsive and polished.
- Seeded demo data exists.
- Test accountant credentials exist.
- README is complete.
- Live demo is deployed.
- GitHub repository is clean.
- No obvious console errors.
- No broken API calls.
- Code is readable and organized.
