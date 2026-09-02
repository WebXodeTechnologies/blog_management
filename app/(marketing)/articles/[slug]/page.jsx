import connectDB from "@/lib/mongodb/db";
import { Blog } from "@/modules/blogs";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Heart, ArrowLeft, Calendar } from "lucide-react";
import SmoothScrollProvider from "@/components/homepage/SmoothScrollProvider";
import ArticleInteractions from "@/components/articles/ArticleInteractions";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  await connectDB();
  const blog = await Blog.findOne({ slug, status: "published" }).populate(
    "authorId",
    "name avatar"
  );
  if (!blog) return { title: "Article Not Found" };

  return {
    title: `${blog.title} | Texora`,
    description:
      blog.excerpt ||
      "Explore technical insights and architectural deep dives.",
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [
        blog.coverImage ||
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
      ],
    },
  };
}

export default async function PublicArticleDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  await connectDB();

  const blog = await Blog.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { views: 1 } },
    { returnDocument: "after" }
  ).populate("authorId", "name email avatar bio");

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

  return (
    <SmoothScrollProvider>
      <article className="min-h-screen bg-slate-50 text-slate-900 font-sans pt-12 pb-32 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Articles Library
            </Link>
          </div>

          {/* Article Header */}
          <header className="space-y-6 mb-10 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                {blog.category || "Architecture"}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" /> {readTimeMin} min read
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" /> {formattedDate}
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                {blog.excerpt}
              </p>
            )}

            {/* Author Profile Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700">
                  {blog.authorId?.avatar ? (
                    <Image
                      src={blog.authorId.avatar}
                      alt={blog.authorId.name || "Author"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{blog.authorId?.name?.[0] || "T"}</span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {blog.authorId?.name || "Technical Author"}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {blog.authorId?.bio || "Engineering Contributor"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-slate-400" /> {blog.views || 0}{" "}
                  views
                </span>
                <span className="flex items-center gap-1 text-rose-500 font-medium">
                  <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />{" "}
                  {blog.likes || 0}
                </span>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-sm border border-slate-200/80 bg-white">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Rendered Content Body */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-2xs">
            <div
              className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-2xl leading-relaxed text-slate-700 text-sm sm:text-base space-y-4"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Live Engagement Toolbar */}
            <ArticleInteractions
              articleId={blog._id.toString()}
              initialLikes={blog.likes || 0}
              initialCommentsCount={blog.commentsCount || 0}
            />
          </div>
        </div>
      </article>
    </SmoothScrollProvider>
  );
}
