# Accountant Hub — Master Prompt For Codex / Claude

You are a senior solo full-stack engineer and product-minded builder.

I am building a full-stack assessment project called **Accountant Hub**.

The project is a small marketplace-style web app, similar to Upwork, where companies post accounting jobs and accountants can browse jobs, view job details, and submit bids.

## Stack

Use this stack:

- Frontend: Next.js App Router + TypeScript
- Backend: Laravel REST API
- Database: MySQL
- Authentication: Laravel Sanctum
- Styling: Bootstrap + SCSS or Tailwind CSS, depending on the existing project setup
- Deployment target:
  - Next.js frontend on Vercel
  - Laravel backend + MySQL on VPS / Plesk / Laravel hosting

## Very Important

I want this project to be built like a professional assessment product, not a quick CRUD.

You must follow:

- Clean code
- SOLID principles
- Practical design patterns
- Thin controllers
- Form Requests
- API Resources
- Action classes or service classes for business logic
- Query object for filtering/sorting jobs
- Strong validation
- Proper error handling
- Reusable frontend components
- Responsive design
- Polished UI/UX
- Seeded demo data
- Complete README

## Use Laravel Boost

Before making backend changes, use Laravel Boost MCP tools when available.

Use Laravel Boost to:
- Inspect application info
- Inspect routes
- Inspect database schema
- Search Laravel documentation
- Run/check Artisan commands
- Read logs/errors when debugging
- Avoid guessing Laravel/package APIs

Do not hallucinate Laravel APIs. If Laravel Boost docs/tools are available, use them.

## Source Of Truth

Read this skills file first if available:

```txt
.skills/accountant-hub.md
```

or:

```txt
ACCOUNTANT_HUB_SKILLS.md
```

Follow it as the project rules.

---

# Assessment Requirements

Build a web application called **Accountant Hub**.

The platform should allow accountants to find accounting jobs and submit bids to complete those jobs.

The assessment evaluates:

- Product thinking
- UI/UX quality
- Frontend implementation
- Backend implementation
- Database design
- API design
- Deployment quality
- Clean code
- Business logic correctness
- Attention to detail
- Ability to work independently as a solo developer

---

# Required Features

## 1. Jobs Listing Page

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

The page must include filters:

- Search by job title
- Filter by category
- Filter by budget range
- Sort by newest
- Sort by highest budget

Also implement:

- Pagination
- Loading state
- Empty state
- Responsive layout

---

## 2. Job Details Page

When the accountant clicks a job, show a detailed job page.

The page must include:

- Full job description
- Client/company information
- Required skills
- Expected delivery time
- Budget
- Attachments placeholder, if any
- Existing bids count
- Apply / Submit Bid button

UX rules:

- If guest user: show "Login to submit a bid"
- If authenticated and job open: allow bid submission
- If job closed: disable bid submission
- If user already submitted a bid: show already-applied state

---

## 3. Submit Bid Flow

Authenticated accountants can apply for a job by submitting a bid.

Bid form fields:

- Proposed price
- Estimated delivery time
- Cover letter / proposal message
- Relevant experience summary

After submitting:

- Save bid in database
- Show success message
- Update bids count / already-applied state where possible

Business rules:

- Only logged-in accountants can submit bids
- Same accountant cannot submit more than one bid for the same job
- Closed jobs cannot receive bids

Duplicate-bid prevention must be enforced by:

1. Backend business logic
2. Database unique constraint on `user_id + job_id`
3. Frontend UX state

---

## 4. Authentication

Create simple accountant authentication:

- Register
- Login
- Logout
- Current authenticated user endpoint

Use Laravel Sanctum token-based authentication because the frontend and backend are separated.

---

# Bonus Features — Must Implement

Implement all bonus features:

- Dashboard page showing my submitted bids
- Job status handling: Open / Closed
- Pagination for job listing
- Better filtering and sorting
- Reusable UI components
- API Resources / clean response formatting
- Deployment-ready setup
- README with setup instructions
- Seeded demo data

---

# Database Requirements

Use these core entities:

- Users
- Jobs
- Job Categories
- Bids

Relationships:

- A job belongs to a category
- A job has many bids
- A user/accountant can submit many bids
- A user can submit only one bid per job

Suggested tables:

## users

- id
- name
- email
- password
- timestamps

## job_categories

- id
- name
- slug
- timestamps

## jobs

- id
- category_id
- title
- company_name
- short_description
- description
- budget_min
- budget_max
- deadline
- expected_delivery_time
- required_skills
- attachments
- status: open / closed
- timestamps

## bids

- id
- user_id
- job_id
- proposed_price
- estimated_delivery_time
- cover_letter
- experience_summary
- status: pending / accepted / rejected
- timestamps
- unique index: user_id + job_id

---

# Required API Endpoints

## Auth

```txt
POST /api/register
POST /api/login
POST /api/logout
GET  /api/me
```

## Categories

```txt
GET /api/categories
```

## Jobs

```txt
GET /api/jobs
GET /api/jobs/{job}
```

`GET /api/jobs` must support query params:

```txt
search
category
budget_min
budget_max
sort=newest|highest_budget
page
per_page
```

## Bids

```txt
POST /api/jobs/{job}/bids
GET  /api/my-bids
```

---

# Backend Architecture Requirements

Use this approach:

## Controllers

Controllers must be thin.

They should:
- Receive request
- Call action/service/query
- Return resource/JSON response

They should not contain complex business logic.

## Form Requests

Create Form Request classes for:

- RegisterRequest
- LoginRequest
- JobIndexRequest
- SubmitBidRequest

## API Resources

Create resources for:

- UserResource
- JobCategoryResource
- JobListResource
- JobDetailResource
- BidResource

## Actions / Services

Create focused action classes:

- RegisterAccountantAction
- LoginAccountantAction
- ListJobsAction
- ShowJobAction
- SubmitBidAction
- ListMyBidsAction

Business logic for bid submission must be inside `SubmitBidAction`, not inside the controller.

## Query Object

Create:

```txt
App\Queries\JobQuery
```

It should handle:

- Search
- Category filter
- Budget filters
- Sorting
- Bids count
- Pagination

## Enums / Constants

Use enums or constants for:

- Job status: open, closed
- Bid status: pending, accepted, rejected

## Database-Level Rule

The bids table must include:

```php
$table->unique(['user_id', 'job_id']);
```

This is mandatory.

---

# Frontend Requirements

Use a clean Next.js structure.

Suggested structure:

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
└── styles/
```

Required pages:

- Home page
- Jobs listing page
- Job details page
- Login page
- Register page
- My submitted bids dashboard

Required UI components:

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

---

# UI/UX Requirements

Use these colors:

- Black
- `#019a51`

Design direction:

- Modern
- Clean
- Professional
- Marketplace/SaaS style
- Strong spacing
- Clear typography
- Responsive on mobile, tablet, and desktop
- High-quality job cards
- Smooth bid submission flow
- Good validation messages
- Good empty states

Do not produce a plain CRUD design.

The UI should feel like a polished mini product.

---

# Testing / Quality Requirements

Backend:

- Run migrations and seeders
- Add feature tests where practical
- Test auth
- Test jobs listing
- Test job details
- Test submit bid
- Test duplicate bid prevention
- Test closed job bid prevention
- Test my bids endpoint

Frontend:

- Ensure TypeScript has no major errors
- Ensure build passes
- Ensure responsive UI
- Ensure API errors are handled

Commands to run when available:

```bash
php artisan migrate:fresh --seed
php artisan test
php artisan route:list
php artisan pint
npm run lint
npm run build
```

Do not claim the project works unless these checks pass or you clearly report what could not be run.

---

# README Requirements

Create a professional README including:

- Project overview
- Features
- Bonus features implemented
- Tech stack
- Architecture overview
- Setup instructions
- Backend setup
- Frontend setup
- Environment variables
- Database migration/seeding
- API endpoints
- Test accountant login credentials
- Deployment notes
- Assumptions made

---

# Workflow Instructions

## Phase 0 — Analyze First

Do not write code yet.

First, analyze the repository and return:

1. Current repo structure
2. Existing frontend/backend status
3. Missing assessment requirements
4. Proposed architecture
5. Database plan
6. API plan
7. UI/UX plan
8. Suggested implementation phases
9. Risks or assumptions
10. Exact files you plan to create/update in Phase 1

Wait for approval before implementing Phase 1.

## After Approval

Implement one phase at a time.

For each phase:

1. State the goal
2. List files to create/update
3. Make the changes
4. Run relevant checks
5. Summarize what was completed
6. Mention any issues or next steps

Do not jump across phases unless necessary.

---

# Final Product Standard

The final project must be good enough to submit as an assessment.

It must include:

- Clean Laravel API
- Clean Next.js frontend
- MySQL database
- Sanctum auth
- Jobs listing
- Job details
- Submit bid
- Duplicate-bid prevention
- My bids dashboard
- Filtering
- Sorting
- Pagination
- Seeded demo data
- Responsive modern design
- Clean README
- Deployment-ready configuration

Focus on correctness, polish, and clarity.
