
---

# 4. `final.md`

I would make this your **master specification**, not just another architecture document.

```md
# Blog Management SaaS — Master Project Specification

## Project Status

Planning

## Architecture

Multi-Tenant Modular Monolith

---

# Technology Stack

## Application

- Next.js App Router
- React
- Tailwind CSS

## Database

- MongoDB Atlas

## Authentication

- Google OAuth
- Email/Password
- GitHub OAuth — Future

## Authorization

- Multi-Tenant RBAC

## Editor

- Tiptap

## Storage

Current:

- Cloudinary

Future:

- AWS S3
- CloudFront

## Cache

- Redis

## Realtime

- Socket.io
- Redis Adapter

## Background Jobs

- BullMQ
- Redis

## Payments

- Razorpay
- Razorpay Webhooks

## Monitoring

- Sentry

## Testing

- Playwright

## Infrastructure

- Docker
- Docker Compose
- Nginx
- AWS EC2

## CI/CD

- GitHub Actions

---

# Product Architecture

```text
                         PLATFORM
                            │
              ┌─────────────┴─────────────┐
              │                           │
            USERS                       TENANTS
                                          │
                              ┌───────────┼───────────┐
                              │           │           │
                            BLOGS      COMMUNITY    EVENTS
                              │           │           │
                              └───────────┼───────────┘
                                          │
                                     SUBSCRIPTION

```

---


## Application Layers

```text
Next.js App Router
        ↓
API / Server Actions
        ↓
Validation
        ↓
Authentication
        ↓
Tenant Resolution
        ↓
RBAC
        ↓
Subscription Entitlement
        ↓
Service Layer
        ↓
Repository Layer
        ↓
MongoDB

```

---

## Core Modules
```text
auth
users
tenants
memberships
rbac
blogs
categories
tags
comments
communities
discussions
chat
events
subscriptions
payments
notifications
analytics
moderation
audit-logs
```
---

## Frontend Areas

```text
Marketing
Public Platform
Authentication
Tenant Dashboard
Platform Admin
```

---

## Tenant Roles

```text
OWNER
ADMIN
EDITOR
AUTHOR
MODERATOR
MEMBER
``` 

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

Alternative:

PENDING_REVIEW
 ↓
REJECTED
```
---

## Development Roadmap
Phase 1 — Foundation

- Initialize Next.js
- Configure Tailwind
- Configure ESLint
- Configure environment variables
- Setup Git
- Create documentation
- Create project architecture

---

## Phase 2 — Authentication

- User model
- Google OAuth
- Email/password
- Session management
- Profile
- Email verification
- Password reset

---

## Phase 3 — Users and Tenants

- Tenant model
- Tenant creation
- Tenant slug
- Membership model
- Tenant switching
- Tenant context

---

## Phase 4 — Multi-Tenancy

- Tenant resolution
- Tenant isolation
- Tenant-aware repositories
- Tenant-aware services
- Tenant access middleware

---

## Phase 5 — RBAC

Implement:

- OWNER
- ADMIN
- EDITOR
- AUTHOR
- MODERATOR
- MEMBER
- Implement permission checks.

---

## Phase 6 — Blog CMS

- Blog model
- Categories
- Tags
- Tiptap editor
- Draft system
- Image upload
- SEO metadata
- Preview
- Submit for approval
- Admin approval
- Publishing
- Blog analytics

--- 

## Phase 7 — Public Platform

- Blog discovery
- Blog search
- Categories
- Author profiles
- Comments
- Sharing
- Bookmarks

---

## Phase 8 — Subscriptions

- Plans
- Entitlements
- Razorpay integration
- Checkout
- Webhooks
- Subscription lifecycle
- Payment records
- Invoice records
- Usage limits

---

## Phase 9 — Community

- Communities
- Discussions
- Comments
- Replies
- Voting
- Reports
- Moderation
- Events

---

## Phase 10 — Redis

- Learn and implement Redis connection
- Cache
- TTL
- Cache invalidation
- Rate limiting
- Pub/Sub

## Phase 11 — Realtime

- Socket.io
- Notifications
- Chat
- Presence
- Redis Adapter

## Phase 12 — Background Jobs

- BullMQ
- Redis queues
- Workers
- Email jobs
- Notification jobs
- Analytics jobs
- Scheduled publishing
- Webhook jobs

## Phase 13 — Testing

- Playwright tests:
- Authentication
- Tenant creation
- Tenant switching
- RBAC
- Blog creation
- Blog approval
- Blog publishing
- Subscription
- Webhooks
- Tenant isolation
- Platform admin

## Phase 14 — Docker

- Create:
```text
- docker-compose.yml
- docker-compose.dev.yml
- docker-compose.prod.yml
```

Containers:
```text
- nginx
- nextjs
- worker
- redis
```

## Phase 15 — Nginx

Implement:

- Reverse proxy
- HTTPS
- Request routing
- Static asset handling
- Security headers
- Rate limiting where appropriate

--- 

## Phase 16 — Monitoring

Integrate Sentry.

Track:

- Errors
- Exceptions
- Performance
- API failures
- Background job failures

## Phase 17 — CI/CD
GitHub Actions pipeline:

```text

Push
 ↓
Install
 ↓
Lint
 ↓
Test
 ↓
Build
 ↓
Docker Build
 ↓
Deploy
```

## Phase 18 — AWS

Initial:

```text
AWS EC2
Docker
Nginx
Next.js
Redis
Worker
```

External:
```text
MongoDB Atlas
Cloudinary
Razorpay
Sentry
```

## Phase 19 — Performance

Measure before optimizing.

Investigate:

```text
- Database queries
- MongoDB indexes
- Redis caching
- API latency
- Next.js rendering
- Image optimization
- Bundle size
- Nginx configuration
- Background jobs

Phase 20 — Scaling

Future:

```text

Single EC2
 ↓
Multiple Application Instances
 ↓
Load Balancer
 ↓
Managed Redis
 ↓
Dedicated Workers
 ↓
CDN
 ↓
Service Extraction if Required

```
---

## Non-Negotiable Architecture Rules

- Tenant isolation is mandatory.
- Every tenant-owned resource must contain tenantId.
- Tenant ID must never be trusted from the client for authorization.
- Authentication must be server-validated.
- Authorization must be server-side.
- Subscription entitlements must be server-side.
- Razorpay webhooks are the payment source of truth.
- Webhooks must be idempotent.
- API routes must remain thin.
- Business logic belongs inside modules/services.
- Database access belongs inside repositories.
- Sensitive credentials must never be committed.
- Environment variables must be used for secrets.
- Do not introduce microservices prematurely.
- Do not add infrastructure technology without a real use case.
- Every major feature should have tests.
- Tenant isolation must have automated tests.
- Do not modify unrelated modules when implementing a feature.
- Existing architecture must not be changed without documenting the reason.
- Performance optimization must be based on measurements.


---

## AI Development Rule

AI coding assistants must read:
```text

docs/01-PROJECT-OVERVIEW.md
docs/02-ARCHITECTURE.md
docs/03-SUBSCRIPTIONS.md
docs/final.md
```


before implementing major features.

The AI must:

```text
Understand existing architecture.
Inspect existing code.
Propose an implementation plan.
Avoid unnecessary architecture changes.
Modify only required files.
Follow existing coding conventions.
Add tests where appropriate.
Update documentation when architecture changes.
Never expose secrets.
Never bypass authorization.
Never bypass tenant isolation.
```
---

