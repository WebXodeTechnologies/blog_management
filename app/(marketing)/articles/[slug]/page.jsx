import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/mongodb/db";
import { Blog } from "@/modules/blogs";
import { Tenant } from "@/modules/tenants";
import { Clock, Eye, ArrowLeft, Calendar, User } from "lucide-react";

async function getBlogPost(slug, tenantSlug) {
  await connectDB();
  let tenantId = null;
  if (tenantSlug) {
    const tenant = await Tenant.findOne({ slug: tenantSlug });
    if (tenant) tenantId = tenant._id;
  }

  const query = tenantId
    ? { slug, tenantId, status: "published" }
    : { slug, status: "published" };
  const blog = await Blog.findOne(query).populate(
    "authorId",
    "name email avatar bio"
  );

  if (!blog) return null;

  await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

  return JSON.parse(JSON.stringify(blog));
}

export default async function BlogPostPage({ params, searchParams }) {
  const { slug } = await params;
  const tenantSlug = searchParams?.tenantSlug || "general";

  const blog = await getBlogPost(slug, tenantSlug);

  if (!blog) {
    notFound();
  }

  const wordCount = blog.content
    ? blog.content.replace(/<[^>]*>/g, " ").split(/\s+/).length
    : 0;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="min-h-screen bg-white text-slate-900 font-sans pb-24">
      <div className="border-b border-slate-100 py-4 px-6 sm:px-12 flex items-center justify-between max-w-4xl mx-auto">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Link>
        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
          {blog.category || "Architecture"}
        </span>
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-10 sm:pt-16 space-y-8">
        <div className="space-y-4">
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {blog.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
                {blog.authorId?.avatar ? (
                  <Image
                    src={blog.authorId.avatar}
                    alt={blog.authorId.name || "Author"}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <span className="font-semibold text-slate-800">
                {blog.authorId?.name || "Technical Author"}
              </span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readTimeMin} min read
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {blog.views + 1} views
            </span>
          </div>
        </div>

        {blog.coverImage && (
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-md border border-slate-200">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-slate max-w-none text-slate-800 leading-relaxed space-y-6 pt-4 
            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mt-8 [&_h1]:mb-4
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-3
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-2
            [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6
            [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600
            [&_pre]:rounded-xl [&_pre]:bg-slate-950 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:my-6 [&_pre]:font-mono [&_pre]:text-sm
            [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-indigo-600 [&_code]:font-mono [&_code]:text-xs
            [&_img]:rounded-2xl [&_img]:my-6 [&_img]:border [&_img]:border-slate-200"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-8 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
              Tags:
            </span>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>
    </article>
  );
}
