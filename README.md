# 🚀 Texora

### A Multi-Tenant Blog Management & Developer Community SaaS Platform

Texora is a modern multi-tenant SaaS platform designed for developers, students, founders, engineers, designers, and technology communities to create, manage, publish, and discover technical content.

The platform combines a powerful blog management system with communities, discussions, events, subscriptions, real-time features, analytics, and tenant-level administration.

Texora is being built as a **production-oriented learning project**, with a strong focus on scalable architecture, multi-tenancy, security, testing, DevOps, and cloud deployment.

---

## ✨ Vision

The goal of Texora is to build a developer-focused platform where users can:

* ✍️ Write and publish technical blogs
* 📚 Discover technology content
* 👥 Join developer communities
* 💬 Participate in discussions
* 🔔 Receive real-time notifications
* 📅 Participate in events
* ⭐ Follow authors and content
* 📊 Track blog analytics
* 💳 Access subscription-based features
* 🏢 Create and manage organizations or tenants

The platform focuses primarily on technology topics such as:

* Web Development
* Software Engineering
* UI/UX
* Cloud Computing
* DevOps
* Artificial Intelligence
* Machine Learning
* Cybersecurity
* Databases
* Programming
* System Design
* Emerging Technologies

---

# 🏗 Architecture

Texora follows a:

> **Multi-Tenant Modular Monolith Architecture**

The application is initially deployed as a single application while maintaining strong boundaries between business modules.

Each module is designed to own its business logic and can potentially be extracted into an independent service in the future if scaling requirements justify it.

```text
                           USERS
                             │
                             ▼
                        CLOUDFLARE
                             │
                             ▼
                           NGINX
                             │
                             ▼
                ┌─────────────────────────┐
                │        NEXT.JS          │
                │    MODULAR MONOLITH     │
                └────────────┬────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
     MongoDB               Redis            External APIs
      Atlas                  │
                             │
                    ┌────────┴────────┐
                    │                 │
                  Cache             BullMQ
                                      │
                                    Worker
```

External services include:

* MongoDB Atlas
* Redis
* Cloudinary
* Razorpay
* Sentry

---

# 🧠 Architecture Principles

Texora follows several non-negotiable engineering principles.

### Tenant Isolation

Every tenant-owned resource must contain:

```text
tenantId
```

Tenant identity must always be resolved from trusted server-side context.

The application must never trust a `tenantId` directly from the client for authorization.

---

### Thin API Layer

API routes are responsible only for:

* HTTP concerns
* Request parsing
* Authentication entry points
* Validation orchestration
* Response formatting

Business logic must not live inside route handlers.

```text
Route
  ↓
Service
  ↓
Repository
  ↓
Database
```

---

### Server-Side Authorization

Authorization is always enforced on the server.

Frontend permission checks are only used to control UI visibility.

They are never considered a security boundary.

---

### Explicit Permissions

The application uses Role-Based Access Control with explicit permissions.

Example:

```text
BLOG_CREATE
BLOG_EDIT
BLOG_DELETE
BLOG_APPROVE
BLOG_PUBLISH

MEMBER_INVITE
MEMBER_REMOVE

COMMUNITY_CREATE
COMMUNITY_MODERATE

BILLING_VIEW
BILLING_MANAGE
```

---

# 🧩 Application Architecture

```text
                         NEXT.JS
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
    MARKETING             PUBLIC              AUTH
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
                     TENANT DASHBOARD
                            │
                ┌───────────┼───────────┐
                │           │           │
              BLOG      COMMUNITY    BILLING
                │           │           │
                └───────────┼───────────┘
                            │
                            ▼
                     PLATFORM ADMIN
                            │
                 ┌──────────┼──────────┐
                 │          │          │
              TENANTS     USERS     REVENUE
                            │
                            ▼
                          API
                            │
                            ▼
                    BUSINESS MODULES
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
             MongoDB      Redis      External
                                     Services
```

---

# 🛠 Technology Stack

## Application

* Next.js
* React
* Tailwind CSS
* Radix UI

## Database

* MongoDB Atlas
* Mongoose

## Authentication

* Email & Password
* Google OAuth


## Authorization

* Multi-Tenant RBAC
* Permission-based authorization

## Editor

* Tiptap

## State Management

* Zustand

## Data Fetching

* TanStack Query

## Storage

Current:

* Cloudinary

Future:

* AWS S3
* CloudFront



## Real-Time

* Socket.io


## Payments

* Razorpay
* Razorpay Webhooks

## Monitoring

* Sentry

## Testing

* Playwright

## Infrastructure

* Docker
* Docker Compose
* Nginx
* AWS EC2

## CI/CD

* GitHub Actions

---

# 📦 Core Modules

The application is organized into independent business modules.

```text
modules/

├── auth/
├── users/
├── tenants/
├── memberships/
├── rbac/
├── blogs/
├── categories/
├── tags/
├── comments/
├── communities/
├── discussions/
├── chat/
├── events/
├── subscriptions/
├── payments/
├── notifications/
├── analytics/
├── moderation/
└── audit-logs/
```

A typical module follows the structure:

```text
modules/blogs/

├── blog.model.ts
├── blog.repository.ts
├── blog.service.ts
├── blog.validation.ts
├── blog.permissions.ts
├── blog.constants.ts
└── index.ts
```

Each module owns:

* Models
* Repositories
* Services
* Validation
* Permissions
* Constants
* Business Rules

---

# 👥 Multi-Tenancy

Texora supports multiple tenants.

A single user can belong to multiple organizations.

Example:

```text
User
│
├── Webxode
│   └── OWNER
│
├── ABC College
│   └── AUTHOR
│
└── Developer Community
    └── MEMBER
```

Tenant-owned resources include:

```text
Blogs
Categories
Memberships
Communities
Discussions
Events
Subscriptions
Analytics
```

Every tenant-owned database resource must be isolated using:

```text
tenantId
```

---

# 🔐 Tenant Roles

Initial roles:

```text
ADMIN
AUTHOR
MODERATOR
MEMBER / USER
```

Roles map to explicit permissions.

Example responsibilities:

| Role      | Responsibility                |
| --------- | ----------------------------- |
| OWNER     | Full tenant control           |
| ADMIN     | Tenant administration         |
| EDITOR    | Content management            |
| AUTHOR    | Blog creation                 |
| MODERATOR | Community moderation          |
| MEMBER    | Basic community participation |

---

# ✍️ Blog Management

The core of Texora is the blog management system.

Features include:

* Create blogs
* Save drafts
* Edit content
* Rich text editing
* Image uploads
* Categories
* Tags
* SEO metadata
* Preview
* Autosave
* Submit for review
* Approval workflow
* Publishing
* Blog analytics

---

## Blog Lifecycle

```text
DRAFT
  ↓
PENDING_REVIEW
  ↓
APPROVED
  ↓
PUBLISHED
```

Alternative flow:

```text
PENDING_REVIEW
      ↓
   REJECTED
```

---

# 📝 Rich Text Editor

Texora uses:

```text
Tiptap
```

Planned capabilities include:

* Headings
* Paragraphs
* Lists
* Links
* Images
* Code Blocks
* Quotes
* Tables
* Embeds
* Markdown shortcuts
* Autosave
* Preview

---

# 🌍 Public Platform

Public users will be able to:

* Discover blogs
* Search content
* Browse categories
* Explore authors
* View author profiles
* Comment on blogs
* Share articles
* Bookmark content
* Discover communities
* Explore events

---

# 👥 Community System

The platform will include:

* Communities
* Discussions
* Comments
* Replies
* Voting
* Bookmarks
* Reports
* Moderation
* Events
* Notifications
* Real-time chat

---

# 💳 Subscription System

Texora uses Razorpay for subscription management.

The payment flow follows:

```text
User
  ↓
Frontend
  ↓
Razorpay Checkout
  ↓
Razorpay
  ↓
Webhook
  ↓
Backend
  ↓
Signature Verification
  ↓
Subscription Update
  ↓
Database
```

> Razorpay webhooks are the source of truth.

A subscription must never be activated solely because the frontend reports a successful payment.

Webhook processing must be:

* Verified
* Secure
* Idempotent
* Server-side

---



Potential cache targets include:

* Trending blogs
* Popular blogs
* Tenant configuration
* Public categories
* Frequently accessed metadata

Cache invalidation must always be explicitly handled.

---

# 🔴 Real-Time Features

Real-time functionality will use:

```text
Socket.io
+
Redis Adapter
```

Planned use cases:

* Notifications
* Chat
* Online presence
* Live discussions
* Real-time collaboration
* Live updates

Architecture:

```text
Client
  ↓
Socket.io
  ↓
Application Server
  ↓
Redis Adapter
  ↓
Multiple Application Instances
```

---

# ⚙️ Background Jobs

Background processing uses:

```text
BullMQ
+
Redis
```

Architecture:

```text
Application
    ↓
  BullMQ
    ↓
   Redis
    ↓
  Worker
    ↓
Job Processing
```

Background jobs may include:

* Email delivery
* Notifications
* Analytics processing
* Scheduled publishing
* Webhook processing
* Cleanup tasks

---

# 📊 Monitoring

Monitoring is handled using:

```text
Sentry
```

The application tracks:

* Exceptions
* Server errors
* Client errors
* API failures
* Performance issues
* Background job failures
* Important production events

---

# 🧪 Testing

Primary E2E testing framework:

```text
Playwright
```

Critical workflows include:

* Registration
* Login
* Tenant creation
* Tenant switching
* RBAC
* Blog creation
* Blog approval
* Blog publishing
* Subscription flow
* Razorpay webhooks
* Tenant isolation
* Platform admin access
* Community functionality

> Tenant isolation tests are considered critical security tests.

---

# 🐳 Docker Architecture

The application is containerized using Docker.

Planned services:

```text
docker-compose.yml

├── nginx
├── nextjs
├── worker
└── redis
```

Development and production environments will be separated.

```text
docker-compose.yml
docker-compose.dev.yml
docker-compose.prod.yml
```

---

# 🌐 Deployment Architecture

Initial production deployment:

```text
Internet
   ↓
Cloudflare
   ↓
AWS EC2
   ↓
Nginx
   ↓
Docker
   ↓
Next.js
```

External infrastructure:

```text
MongoDB Atlas
Cloudinary
Razorpay
Sentry
```

Redis initially runs inside the Docker environment.

For larger production deployments, Redis can be migrated to a managed service.

---

# 🔄 CI/CD Pipeline

The project uses GitHub Actions.

Deployment flow:

```text
Developer
   ↓
Git Push
   ↓
GitHub
   ↓
GitHub Actions
   ↓
Install Dependencies
   ↓
Lint
   ↓
Tests
   ↓
Build
   ↓
Docker Build
   ↓
Deploy
```

Pull requests should validate:

* Linting
* Tests
* Build
* Playwright E2E tests where appropriate

---

# 📈 Scaling Strategy

Texora follows an incremental scaling strategy.

## Stage 1

```text
Single EC2
+
Docker Compose
```

## Stage 2

```text
Multiple Application Instances
+
Load Balancer
+
Managed Redis
```

## Stage 3

```text
Application
+
Dedicated Workers
+
Managed Database
+
Managed Redis
+
CDN
```

## Stage 4

Services are extracted only when justified by:

* Performance requirements
* Team ownership
* Independent deployment
* Horizontal scaling
* Failure isolation

> Microservices are not introduced prematurely.

---

# 📁 Proposed Project Structure

```text
src/

├── app/
│   │
│   ├── (marketing)/
│   ├── (public)/
│   ├── (auth)/
│   ├── dashboard/
│   │   └── [tenantSlug]/
│   │
│   ├── platform-admin/
│   └── api/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── tenants/
│   ├── memberships/
│   ├── rbac/
│   ├── blogs/
│   ├── categories/
│   ├── tags/
│   ├── comments/
│   ├── communities/
│   ├── discussions/
│   ├── chat/
│   ├── events/
│   ├── subscriptions/
│   ├── payments/
│   ├── notifications/
│   ├── analytics/
│   ├── moderation/
│   └── audit-logs/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── lib/
│   ├── db/
│   ├── redis/
│   ├── cloudinary/
│   ├── auth/
│   └── utils/
│
├── config/
│
├── hooks/
│
├── stores/
│
└── types/
```

---

# 🚦 Development Roadmap

## Phase 1 — Foundation

* [ ] Initialize Next.js
* [ ] Configure TypeScript
* [ ] Configure Tailwind CSS
* [ ] Configure Radix UI
* [ ] Configure ESLint
* [ ] Configure environment variables
* [ ] Setup Git
* [ ] Create project documentation

## Phase 2 — Authentication

* [ ] User model
* [ ] Email/password authentication
* [ ] Google OAuth
* [ ] Session management
* [ ] Email verification
* [ ] Password reset
* [ ] User profiles

## Phase 3 — Users & Tenants

* [ ] Tenant model
* [ ] Tenant creation
* [ ] Tenant slug
* [ ] Membership model
* [ ] Tenant switching
* [ ] Tenant context

## Phase 4 — Multi-Tenancy

* [ ] Tenant resolution
* [ ] Tenant isolation
* [ ] Tenant-aware repositories
* [ ] Tenant-aware services
* [ ] Tenant access validation

## Phase 5 — RBAC

* [ ] Role definitions
* [ ] Permission definitions
* [ ] Server-side authorization
* [ ] Tenant membership validation

## Phase 6 — Blog CMS

* [ ] Blog model
* [ ] Categories
* [ ] Tags
* [ ] Tiptap editor
* [ ] Draft system
* [ ] Image uploads
* [ ] SEO metadata
* [ ] Preview
* [ ] Approval workflow
* [ ] Publishing
* [ ] Analytics

## Phase 7 — Public Platform

* [ ] Blog discovery
* [ ] Search
* [ ] Categories
* [ ] Author profiles
* [ ] Comments
* [ ] Sharing
* [ ] Bookmarks

## Phase 8 — Subscriptions

* [ ] Subscription plans
* [ ] Entitlements
* [ ] Razorpay integration
* [ ] Checkout
* [ ] Webhooks
* [ ] Subscription lifecycle
* [ ] Payment records
* [ ] Usage limits

## Phase 9 — Community

* [ ] Communities
* [ ] Discussions
* [ ] Comments
* [ ] Replies
* [ ] Voting
* [ ] Reports
* [ ] Moderation
* [ ] Events

## Phase 10 — Redis

* [ ] Redis connection
* [ ] Cache implementation
* [ ] TTL
* [ ] Cache invalidation
* [ ] Rate limiting
* [ ] Pub/Sub

## Phase 11 — Real-Time

* [ ] Socket.io
* [ ] Notifications
* [ ] Chat
* [ ] Presence
* [ ] Redis Adapter

## Phase 12 — Background Jobs

* [ ] BullMQ
* [ ] Redis queues
* [ ] Workers
* [ ] Email jobs
* [ ] Notification jobs
* [ ] Analytics jobs
* [ ] Scheduled publishing
* [ ] Webhook jobs

## Phase 13 — Testing

* [ ] Playwright setup
* [ ] Authentication tests
* [ ] Tenant tests
* [ ] RBAC tests
* [ ] Blog workflow tests
* [ ] Subscription tests
* [ ] Tenant isolation tests

## Phase 14 — Docker

* [ ] Dockerfile
* [ ] Docker Compose
* [ ] Development environment
* [ ] Production environment
* [ ] Worker container
* [ ] Redis container

## Phase 15 — Nginx

* [ ] Reverse proxy
* [ ] HTTPS
* [ ] Request routing
* [ ] Security headers
* [ ] Static asset handling

## Phase 16 — Monitoring

* [ ] Sentry integration
* [ ] Error tracking
* [ ] Performance monitoring
* [ ] Background job monitoring

## Phase 17 — CI/CD

* [ ] GitHub Actions
* [ ] Lint pipeline
* [ ] Test pipeline
* [ ] Build validation
* [ ] Docker build
* [ ] Deployment workflow

## Phase 18 — AWS

* [ ] EC2 deployment
* [ ] Docker deployment
* [ ] Nginx configuration
* [ ] Production environment configuration

---

# 🔐 Non-Negotiable Architecture Rules

The following rules apply throughout the project:

* Tenant isolation is mandatory.
* Every tenant-owned resource must contain `tenantId`.
* Tenant IDs must never be trusted directly from the client.
* Authentication must be validated server-side.
* Authorization must be enforced server-side.
* Subscription entitlements must be validated server-side.
* Razorpay webhooks are the payment source of truth.
* Webhooks must be idempotent.
* API routes must remain thin.
* Business logic belongs in services.
* Database access belongs in repositories.
* Sensitive credentials must never be committed.
* Environment variables must be used for secrets.
* Microservices must not be introduced prematurely.
* Infrastructure must solve a real problem.
* Major features should include tests.
* Tenant isolation must have automated tests.
* Unrelated modules should not be modified unnecessarily.
* Architecture changes must be documented.
* Performance optimization must be based on measurements.

---


# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

```text
Node.js
Docker
Docker Compose
Git
```

---

## Clone the Repository

```bash
git clone https://github.com/WebXodeTechnologies/blog_management.git
```

```bash
cd blog_management
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env.local` file.

```env
DATABASE_URL=

AUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=


```

> Never commit environment variables or secrets to GitHub.

---

## Start Development

```bash
npm run dev
```

---

# 🐳 Running with Docker

Development environment:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Production environment:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

---

# 📖 Documentation

Detailed documentation is available inside the `/docs` directory.

```text
docs/

├── 01-PROJECT-OVERVIEW.md
├── 02-ARCHITECTURE.md
├── 03-SUBSCRIPTIONS.md
└── final.md
```

The README provides a high-level overview.

The `/docs` directory contains the detailed engineering specifications.

---

# 🎯 Project Philosophy

Texora is intentionally being built as a **production-oriented engineering project**.

The goal is not to add technologies simply to make the project look complex.

Every technology must solve a real problem.

The development philosophy is:

```text
Build Correctly
      ↓
Measure
      ↓
Optimize
      ↓
Scale When Required
```

The application starts as a modular monolith.

It evolves only when real technical or business requirements justify additional complexity.

---

# 📌 Current Status

```text
🚧 Architecture & Foundation Development
```

Current focus:

* Project foundation
* Core architecture
* Authentication
* Multi-tenancy
* RBAC

---

# 🔮 Future Evolution

```text
Modular Monolith
        ↓
Horizontal Scaling
        ↓
Load Balancer
        ↓
Multiple Application Instances
        ↓
Dedicated Workers
        ↓
Managed Infrastructure
        ↓
Service Extraction When Required
```

Potential future services include:

* Notification Service
* Chat Service
* Analytics Service
* Search Service
* Media Processing Service

These services will only be extracted when there is a genuine architectural requirement.

---

# 👨‍💻 Author

**Akash S M**

Founder & Full Stack Developer

Building Texora as a production-oriented SaaS engineering project focused on:

* Modern Full Stack Development
* SaaS Architecture
* Multi-Tenancy
* Cloud Computing
* DevOps
* System Design
* Production Engineering

---

# 📄 License

This project is currently private and under active development.

---

### ⭐ If you find the project interesting, consider following its development journey.
