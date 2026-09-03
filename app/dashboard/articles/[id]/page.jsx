import connectDB from "@/lib/mongodb/db";
import { Blog } from "@/modules/blogs";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Heart, ArrowLeft, Calendar, Edit } from "lucide-react";
import SmoothScrollProvider from "@/components/homepage/SmoothScrollProvider";
import ArticleInteractions from "@/components/articles/ArticleInteractions";
import ArticleBackground from "@/components/articles/ArticleBackground";

export default async function DashboardArticleDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  await connectDB();
  const blog = await Blog.findById(id).populate(
    "authorId",
    "name email avatar bio"
  );

  if (!blog) {
    notFound();
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const wordCount = blog.content
    ? blog.content.replace(/<[^>]*>/g, " ").split(/\s+/).length
    : 0;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const serializedBlog = JSON.parse(JSON.stringify(blog));

  return (
    <SmoothScrollProvider>
      <ArticleBackground>
        <article className="min-h-screen pt-12 pb-32 px-6 sm:px-12 font-sans">
          <div className="max-w-4xl mx-auto">
            {/* Back & Management Actions Bar */}
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/dashboard/articles"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Workspace Articles
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/articles/${blog._id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition border border-indigo-200"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit Article
                </Link>
              </div>
            </div>

            {/* Article Header */}
            <header className="space-y-6 mb-10 bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-2xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold capitalize">
                  {blog.status || "Draft"}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {blog.category || "Architecture"}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" /> {readTimeMin} min read
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5" /> {formattedDate}
                </span>
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-950 tracking-tight leading-tight">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                  {blog.excerpt}
                </p>
              )}
            </header>

            {/* Cover Image */}
            {blog.coverImage && (
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-sm border border-slate-200/80 bg-white">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Content Body */}
            <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-2xs">
              <div
                className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-2xl leading-relaxed text-slate-700 text-sm sm:text-base space-y-4"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Live Engagement Toolbar */}
              <ArticleInteractions
                articleId={blog._id.toString()}
                initialPost={serializedBlog}
              />
            </div>
          </div>
        </article>
      </ArticleBackground>
    </SmoothScrollProvider>
  );
}
