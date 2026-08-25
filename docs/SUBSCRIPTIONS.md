---

# 3. `03-SUBSCRIPTIONS.md`

This one is important because your SaaS model depends on it.

````md
# Subscription Architecture

## 1. Payment Provider

Razorpay

Razorpay is responsible for payment processing.

The application is responsible for:

- Plans
- Entitlements
- Subscription state
- Usage limits
- Access control

---

# 2. Subscription Model

Initial plans:

```text
FREE
PRO
BUSINESS
```

````

These values are configurable and must not be hardcoded throughout the application.

## 3. Subscription Hierarchy

```text
Platform
   │
   ├── Plans
   │
   └── Tenants
          │
          └── Subscription
                 │
                 ├── Plan
                 ├── Status
                 ├── Billing Cycle
                 ├── Start Date
                 └── Renewal Date
```

---

## 4. Subscription Status

Supported states:

```text

TRIALING
ACTIVE
PAST_DUE
CANCELLED
EXPIRED
PAUSED
```

---

## 5. Entitlements

Subscription plans should define capabilities.

Example:

```text
FREE

- Limited blogs
- Limited storage
- Basic analytics
- Basic community features
```

```text
PRO

- More blogs
- More storage
- Advanced analytics
- Premium community features
- Increased limits
```

```text
BUSINESS

- High limits
- Advanced analytics
- Advanced moderation
- Team features
- Priority capabilities
```

---

## 6. Entitlement Checking

The application should not check plan names everywhere.

Avoid:

```text
if (subscription.plan === "PRO") {
   ...
}
```

Prefer:

```text

if (canUseFeature("ADVANCED_ANALYTICS")) {
   ...
}
```

This allows plans to change without rewriting application logic.

---

## 7. Payment Flow

```text
User selects plan
        ↓
Backend creates Razorpay order/subscription
        ↓
Frontend opens Razorpay checkout
        ↓
User completes payment
        ↓
Razorpay processes payment
        ↓
Razorpay sends webhook
        ↓
Backend verifies webhook signature
        ↓
Backend updates subscription
        ↓
Entitlements become active
```

---

## 8. Webhook Security

Every Razorpay webhook must:

- Validate request
- Verify Razorpay signature
- Validate event type
- Ensure event has not already been processed
- Update subscription state
- Record payment event
- Return successful response

Webhook processing must be idempotent.

---

## 9. Subscription Database

Potential collections:

```text

subscriptions
payments
payment_events
plans
```

---

## 10. Subscription Data

Example:

```text
{
  tenantId,
  planId,
  razorpaySubscriptionId,
  status,
  billingCycle,
  currentPeriodStart,
  currentPeriodEnd,
  cancelAtPeriodEnd,
  createdAt,
  updatedAt
}
```

---

## 11. Payment Event Idempotency

Every webhook event should have a unique external event ID.

Example:

```text

razorpayEventId

```

---

### Before processing:

```text
Has this event already been processed?
        │
    ┌───┴───┐
   YES      NO
    │        │
 Ignore    Process
```

This prevents duplicate webhook processing.

---

## 12. Subscription Access

Subscription checks must happen server-side.

Example:

```text

Request
 ↓
Authenticated User
 ↓
Tenant
 ↓
Membership
 ↓
Subscription
 ↓
Entitlement
 ↓
Permission
 ↓
Allow / Deny
```

---

## 13. Important Rule

The frontend is never trusted for:

```text
Payment status
Subscription status
User role
Tenant ownership
Permissions
Usage limits
```

These must be verified by the backend.

---
````
