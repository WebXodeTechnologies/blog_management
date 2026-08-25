export const siteConfig = {
  name: "Texora",
  description:
    "A modern developer publishing, community discussion, and real-time chat platform.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/your-org/texora",
    docs: "/docs",
  },
  categories: [
    { id: "ai", label: "Artificial Intelligence", slug: "ai" },
    { id: "tech", label: "Technology", slug: "tech" },
    { id: "ai-ml", label: "AI & Machine Learning", slug: "ai-ml" },
    { id: "dev", label: "Software Development", slug: "dev" },
    { id: "devops", label: "DevOps & SRE", slug: "devops" },
    { id: "cloud", label: "Cloud Computing", slug: "cloud" },
    { id: "business", label: "Tech Business & Startups", slug: "business" },
  ],
  limits: {
    maxBlogTitleLength: 120,
    maxExcerptLength: 300,
    maxTagsPerBlog: 5,
    maxUploadSizeBytes: 5 * 1024 * 1024, // 5MB
    defaultPageSize: 15,
  },
};
