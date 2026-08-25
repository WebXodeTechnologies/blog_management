# AI CODING RULES

## Project

Blog Management SaaS

Architecture:

> Multi-Tenant Modular Monolith

Primary Stack:

- Next.js App Router
- React
- Tailwind CSS
- MongoDB Atlas
- Redis
- Socket.io
- BullMQ
- Razorpay
- Cloudinary
- Docker
- Nginx
- AWS
- Sentry
- Playwright
- GitHub Actions

---

# 1. READ BEFORE CODING

Before implementing a feature, inspect:

```text
docs/01-PROJECT-OVERVIEW.md
docs/02-ARCHITECTURE.md
docs/03-SUBSCRIPTIONS.md
docs/final.md
```

Also inspect the existing code before creating new files.

Do not assume functionality does not already exist.

Reuse existing components, utilities, services and modules where appropriate.

---

## 2. ARCHITECTURE

The application is a:

Multi-Tenant Modular Monolith

Do not convert it to microservices unless explicitly requested.

Do not introduce unnecessary architecture or dependencies.

Do not duplicate business logic.

Keep business logic outside React components and API route handlers.

---

# 3. CODE ORGANIZATION

Use clear separation of responsibilities.

```text
Route / Controller
        ↓
Validation
        ↓
Service
        ↓
Repository
        ↓
Database
```

Use:

````text
modules/
``


for business domains.

Example:
```text

modules/
├── auth/
├── users/
├── tenants/
├── blogs/
├── comments/
├── communities/
├── subscriptions/
├── payments/
└── notifications/

````

---

## 4. MULTI-TENANCY

Tenant isolation is mandatory.

Every tenant-owned resource must contain:

```text
tenantId
```

Never trust tenantId directly from the client.

Resolve tenant access from:

```text

Authenticated User
        ↓
Membership
        ↓
Tenant
```

Every tenant-owned database query must enforce tenant isolation.

Example:

```text

Blog.findOne({
  _id: blogId,
  tenantId
})
```

Never allow Tenant A to access Tenant B data.

---

## 5. AUTHENTICATION

Supported authentication:

- Google OAuth
- Email/password

Future:

- GitHub OAuth

Never trust authentication information coming from the client.

Authentication must be verified server-side.

---

## 6. AUTHORIZATION / RBAC

Authorization must be handled on the server.

Initial roles:

```text
OWNER
ADMIN
EDITOR
AUTHOR
MODERATOR
MEMBER

```

Do not rely only on frontend role checks.

Every protected operation must verify:

```text

User
→ Tenant Membership
→ Role / Permission
→ Resource Access
```

---

## 7. BLOG WORKFLOW

Blog lifecycle:

```text
Draft
  ↓
Pending Approval
  ↓
Approved
  ↓
Published
```

Users can create and edit their allowed blogs.

Admin/moderator approval must happen server-side.

Do not allow users to bypass the approval workflow through API requests.

---

## 8. DATABASE

Use MongoDB Atlas.

Database access should be handled through repositories where practical.

Use indexes for important query patterns.

Tenant-owned collections should normally consider:

```text
tenantId
```

when designing indexes.

Use pagination for potentially large datasets.

Avoid unnecessary database queries.

---

## 9. SUBSCRIPTIONS

- Razorpay is the payment provider.
- Razorpay webhooks are the source of truth for payment state.
- Never activate a subscription only because the frontend reports payment success.

Webhook processing must:

- Verify the signature
- Validate the event
- Handle duplicate events safely
- Update subscription state

Never trust subscription status from the frontend.

---

## 10. REDIS

Redis is used for:

Caching
Socket.io adapter
BullMQ
Rate limiting where required

Before adding a cache, define:

```text

What is cached?
TTL?
Invalidation strategy?
Fallback if Redis is unavailable?

```

Do not cache everything unnecessarily.

---

## 11. REAL-TIME

Socket.io is used for real-time features such as:

- Notifications
- Chat
- Discussions
- Presence where required

Socket events must respect:

- Authentication
- Tenant membership
- Authorization

Never broadcast private tenant data to unauthorized users.

---

## 12. BACKGROUND JOBS

Use BullMQ for operations that do not need to block the request.

Examples:

- Emails
- Notifications
- Analytics processing
- Scheduled tasks
- Cleanup jobs

Jobs should be retryable where appropriate.

---

## 13. FILE STORAGE

Initial storage:

```text
Cloudinary
```

Future:

```text
AWS S3 + CloudFront
```

Keep storage logic separated from business logic so the provider can be changed later.

Validate uploaded files.

Never allow arbitrary unsafe file uploads.

---

## 14. FRONTEND

Use Server Components by default.

Use Client Components only when required.

Avoid unnecessary:

```text
"use client";
```

Keep React components focused on UI.

Do not place large business logic inside components.

Create reusable components instead of duplicating UI.

---

## 15. UI

Use:

```text
Next.js
Tailwind CSS
```

All user-facing pages should support:

```text
- Mobile
- Tablet
- Desktop
```

Provide appropriate:

```text
- Loading states
- Error states
- Empty states
- Form validation
- Success feedback
```

---

## 16. SECURITY

Never:

```text
- Hardcode secrets
- Expose API keys
- Trust client-side roles
- Trust client-side tenant IDs
- Trust client-side subscription status
- Bypass authorization
- Expose database errors
- Commit .env secrets
```

Use environment variables.

---

## 17. TESTING

Use Playwright for important end-to-end flows.

Prioritize:

```text

Authentication
Tenant creation
Tenant access
RBAC
Blog creation
Blog approval
Blog publishing
Comments
Subscriptions
Payment flow

```

Critical security flows must include tenant-isolation testing.

```text

Test:

Happy path
Validation failure
Authorization failure
Tenant isolation
Error handling
```

---

## 18. ERROR HANDLING

Handle errors properly.

Do not expose:

```text

- Stack traces
- Database errors
- API secrets
- Internal infrastructure details

```

to users.

Return clear user-facing errors and log useful technical information.

---

19. PERFORMANCE

Do not optimize blindly.

Consider:

```text
- MongoDB indexes
- Database queries
- Redis caching
- Image optimization
- API response size
- Pagination
- Next.js rendering strategy
```

Measure before introducing complicated optimizations.

---

## 20. DOCKER / AWS

Initial deployment:

```text

AWS EC2
    ↓
Docker
    ↓
Nginx
    ↓
Next.js

```

Keep infrastructure simple initially.

Do not introduce Kubernetes or microservices unless the project actually requires them.

---

## 21. DEFINITION OF DONE

A feature is complete only when:

```text
- Implementation works
- Validation exists
- Authorization exists
- Tenant isolation is verified
- Error handling exists
- Loading states exist where required
- UI is responsive
- Tests are added where appropriate
- Documentation is updated where required
- No unrelated code is modified
- Lint passes
- Tests pass
- Build passes when appropriate
- Git changes are reviewed
- A focused Git commit is created
```

---

## FINAL RULE

Prefer:

Simple
Correct
Secure
Maintainable
Testable
Scalable

Do not add complexity just because a technology exists in the project.

Follow the existing architecture unless there is a clear reason to change it.

---
