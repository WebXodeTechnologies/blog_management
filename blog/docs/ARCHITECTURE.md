---

# 2. `02-ARCHITECTURE.md`

This should be more technical.

````md
# Blog Management SaaS — Architecture

## 1. Architecture Style

The application uses a:

> Multi-Tenant Modular Monolith

The application is initially deployed as a single Next.js application.

The codebase is divided into independent business modules.

Each module owns its:

- Models
- Repository
- Service
- Validation
- Permissions
- Constants
- Business rules

---

# 2. High-Level Architecture

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
                ┌────────────────────┐
                │      NEXT.JS       │
                │  MODULAR MONOLITH  │
                └─────────┬──────────┘
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
   MongoDB              Redis            External APIs
     Atlas                │                  │
                          │                  ├── Razorpay
                          │                  ├── Cloudinary
                          │                  └── Sentry
                          │
                    ┌─────┴─────┐
                    │           │
                  Cache       BullMQ
                                │
                              Worker
```
````

---

## 3. Frontend Architecture

Next.js App Router is used.

```text
app/
│
├── (marketing)/
├── (public)/
├── (auth)/
├── dashboard/
│   └── [tenantSlug]/
├── platform-admin/
└── api/

```

Responsibilities:

Marketing

Public SaaS marketing pages.

Public

Public blogs, authors, communities and events.

Auth

Authentication and account recovery.

Dashboard

Tenant-level SaaS application.

Platform Admin

Global platform administration.

API

Thin HTTP controllers.

Business logic must not be implemented directly inside route handlers.

---

## 4. Business Module Architecture

```text

modules/
│
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

Example

```text
modules/blogs/

├── blog.model.js
├── blog.repository.js
├── blog.service.js
├── blog.validation.js
├── blog.permissions.js
├── blog.constants.js
└── index.js

```

---

## 5. Request Flow

Every protected request should follow

```text

Request
  ↓
Authentication
  ↓
Tenant Resolution
  ↓
Membership Validation
  ↓
RBAC Permission Check
  ↓
Subscription Entitlement Check
  ↓
Input Validation
  ↓
Business Service
  ↓
Repository
  ↓
Database

```

---

6. Tenant Isolation

Every tenant-owned database resource must contain:

```text

{
  tenantId: ObjectId
}

```

Tenant ID must be derived from trusted server-side context.

Do not trust:

```text
tenantId
```

provided directly by the browser for authorization.

The backend must resolve the active tenant from the authenticated user's membership and validated tenant context.

---

## 7. RBAC

Initial roles:

```text
OWNER
ADMIN
EDITOR
AUTHOR
MODERATOR
MEMBER
```

Permissions should be explicit.

```text
Example:

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

Authorization should be performed server-side.

Frontend role checks are only for UI visibility.

---

## 8. Data Access Architecture

```text
Route
 ↓
Service
 ↓
Repository
 ↓
MongoDB
```

Repositories are responsible for database access.

Services are responsible for business logic.

Routes are responsible for HTTP concerns.

---

## 9. Redis Architecture

```text
Redis will initially support:

Cache
Rate Limiting
Pub/Sub
BullMQ
Socket.io Adapter

Potential cache targets:

Trending blogs
Popular blogs
Tenant configuration
Public categories
Frequently accessed metadata
```

Cache invalidation must be explicitly implemented.

---

## 10. Real-Time Architecture

```text

Client
  ↓
Socket.io
  ↓
Next.js / Socket Server
  ↓
Redis Adapter
  ↓
Multiple Application Instances
```

Redis Adapter allows Socket.io events to work correctly when multiple application instances exist.

---

## 11. Background Processing

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

Jobs include:

- Emails
- Notifications
- Analytics
- Scheduled publishing
- Webhooks
- Cleanup

---

## 12. Payment Architecture

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

The Razorpay webhook is the source of truth.

Never activate a subscription solely because the frontend reports a successful payment.

---

## 13. Storage Architecture

```text

Current:

Application
 ↓
Cloudinary
```

Future:

```text

Application
 ↓
S3
 ↓
CloudFront
```

Storage provider access must be isolated inside:

```text

lib/cloudinary/
```

or an abstraction layer so migration to S3 does not affect business modules.

## 14. Deployment Architecture

Initial:

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

For future production scaling, Redis should be moved to a managed service such as ElastiCache or another managed Redis provider.

---

## 15. CI/CD

```text
Developer
   ↓
Git Push
   ↓
GitHub
   ↓
GitHub Actions
   ↓
Lint
   ↓
Tests
   ↓
Build
   ↓
Docker Image
   ↓
Deployment
```

Pull requests should run:

```text

Lint
Tests
Build validation
Playwright tests where appropriate
```

---

## 16. Scaling Strategy

Stage 1:

```text
Single EC2
+
Docker Compose
```

Stage 2:

```text
Multiple Next.js containers
+
Load Balancer
+
Managed Redis
```

Stage 3:

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

Stage 4:

Extract services only when justified by:

Performance
Team ownership
Deployment independence
Scaling requirements
Failure isolation

---
