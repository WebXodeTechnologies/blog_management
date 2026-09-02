// Standardized Categories Across Platform for Students, Tech People & Founders
export const CATEGORIES = [
  { id: "all", name: "All", targetAudience: "Everyone" },
  {
    id: "system-architecture",
    name: "System Architecture",
    targetAudience: "Tech People",
  },
  {
    id: "ai-data",
    name: "AI & Data Pipelines",
    targetAudience: "Tech People & Students",
  },
  {
    id: "web-dev",
    name: "Web Development",
    targetAudience: "Students & Tech People",
  },
  {
    id: "startups-scaling",
    name: "Startups & Scaling",
    targetAudience: "Founders",
  },
  { id: "founders-notes", name: "Founder's Notes", targetAudience: "Founders" },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

// Standardized Unsplash Placeholder Cover Images
export const UNSPLASH_IMAGES = {
  systemArchitecture:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
  aiData:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  webDev:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
  startupsScaling:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
  foundersNotes:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
  careerLearning:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
};

// Standardized Mock Publications with Unsplash Covers & Target Audience Specs
export const STANDARDIZED_ARTICLES = [
  {
    id: 1,
    slug: "mastering-nextjs-app-router",
    category: "System Architecture",
    targetAudience: "Tech People",
    title: "Mastering Next.js 16 App Router & Server Actions at Scale",
    excerpt:
      "A deep architectural dive into building resilient micro-frontends, ISR invalidation, and Redis caching strategies with React Server Components.",
    readTime: "5 min read",
    views: "3.8k",
    likes: 420,
    karma: "+1.2k Karma",
    image: UNSPLASH_IMAGES.systemArchitecture,
    author: {
      name: "Alex Rivera",
      avatar: "/avatars/user1.png",
      role: "Sr. System Architect",
    },
  },
  {
    id: 2,
    slug: "scaling-llm-infrastructure",
    category: "AI & Data Pipelines",
    targetAudience: "Tech People & Students",
    title: "Architecting Low-Latency AI Pipelines with Distributed Workers",
    excerpt:
      "How we reduced LLM inference latency by 65% using BullMQ worker queues, Redis stream processing, and custom token streaming pipelines.",
    readTime: "8 min read",
    views: "3.4k",
    likes: 680,
    karma: "+890 Karma",
    image: UNSPLASH_IMAGES.aiData,
    author: {
      name: "Tania Kapoor",
      avatar: "/avatars/user2.png",
      role: "AI Core Engineer",
    },
  },
  {
    id: 3,
    slug: "tailwind-glassmorphism-design-system",
    category: "Web Development",
    targetAudience: "Students & Tech People",
    title: "Crafting High-Craft Glassmorphic UI Design Systems in 2026",
    excerpt:
      "Techniques for building gorgeous frosted glass depth, subtle borders, micro-interactions, and flawless accessibility.",
    readTime: "4 min read",
    views: "4.1k",
    likes: 512,
    karma: "+650 Karma",
    image: UNSPLASH_IMAGES.webDev,
    author: {
      name: "David Chen",
      avatar: "/avatars/user3.png",
      role: "UI Lead",
    },
  },
  {
    id: 4,
    slug: "bootstrap-to-series-a-tech-saas",
    category: "Founder's Notes",
    targetAudience: "Founders",
    title: "From 0 to 50k Active Creators: Lessons in Technical SaaS Scale",
    excerpt:
      "The engineering trade-offs, developer community flywheel, and database partitioning decisions that fueled our scale.",
    readTime: "6 min read",
    views: "5.2k",
    likes: 930,
    karma: "+1.5k Karma",
    image: UNSPLASH_IMAGES.foundersNotes,
    author: {
      name: "Elena Rostova",
      avatar: "/avatars/user4.png",
      role: "Co-Founder & CEO",
    },
  },
  {
    id: 5,
    slug: "students-guide-to-system-design",
    category: "Career & Learning",
    targetAudience: "Students",
    title: "The Ultimate Student Guide to System Design & Technical Interviews",
    excerpt:
      "Step-by-step roadmap to understanding load balancers, database sharding, caching, and distributed systems fundamentals.",
    readTime: "7 min read",
    views: "6.1k",
    likes: 1120,
    karma: "+2.1k Karma",
    image: UNSPLASH_IMAGES.careerLearning,
    author: {
      name: "Alex Rivera",
      avatar: "/avatars/user1.png",
      role: "Sr. System Architect",
    },
  },
  {
    id: 6,
    slug: "scaling-saas-from-scratch",
    category: "Startups & Scaling",
    targetAudience: "Founders",
    title:
      "Zero to Product-Market Fit: Building a Multi-Tenant SaaS Architecture",
    excerpt:
      "How to design multi-tenant isolation, tenant analytics, custom domains, and automated SSL provisioning.",
    readTime: "9 min read",
    views: "4.7k",
    likes: 840,
    karma: "+1.8k Karma",
    image: UNSPLASH_IMAGES.startupsScaling,
    author: {
      name: "Elena Rostova",
      avatar: "/avatars/user4.png",
      role: "Co-Founder & CEO",
    },
  },
];
