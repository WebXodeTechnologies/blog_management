                         NEXT.JS
                            │
        ┌───────────────────┼──────────────────┐
        │                   │                  │
        ▼                   ▼                  ▼
    MARKETING            PUBLIC              AUTH
        │                   │                  │
        │                   │                  │
        └───────────────────┼──────────────────┘
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
                 │          │          │
                 └──────────┼──────────┘
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