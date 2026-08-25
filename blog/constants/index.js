// User and Membership Roles
export const ROLES = Object.freeze({
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  AUTHOR: "AUTHOR",
  MODERATOR: "MODERATOR",
  MEMBER: "MEMBER",
});

// Blog Lifecycle States
export const BLOG_STATUS = Object.freeze({
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
});

// Support & Moderation Ticket Status
export const TICKET_STATUS = Object.freeze({
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
});

export const TICKET_PRIORITY = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
});

// Redis Cache Key Patterns
export const CACHE_KEYS = Object.freeze({
  TRENDING_BLOGS: "cache:blogs:trending",
  POPULAR_BLOGS: "cache:blogs:popular",
  BLOG_BY_SLUG: (slug) => `cache:blog:${slug}`,
  TENANT_CONFIG: (slug) => `cache:tenant:${slug}`,
  USER_SESSION: (userId) => `cache:user:session:${userId}`,
});

// Cache Expiration TTLs (in seconds)
export const CACHE_TTL = Object.freeze({
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
});

// Socket Channel Events
export const SOCKET_EVENTS = Object.freeze({
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN_CHANNEL: "channel:join",
  LEAVE_CHANNEL: "channel:leave",
  NEW_MESSAGE: "chat:message:new",
  NEW_NOTIFICATION: "notification:new",
  TICKET_CREATED: "ticket:created",
  TICKET_UPDATED: "ticket:updated",
});
