import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/mongodb/db";
import { Blog } from "@/modules/blogs";
import { Clock, Eye, Heart, Sparkles, ArrowUpRight, User } from "lucide-react";

export const metadata = {
  title: "Published Technical Articles | Texora",
  description:
    "Explore deep-dive technical engineering articles, architecture notes, and developer guides.",
};

async function getPublishedArticles() {
  try {
    await connectDB();
    const blogs = await Blog.find({ status: "published" })
      .populate("authorId", "name avatar")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error("Error fetching published articles:", error);
    return [];
  }
}

export default async function PublicArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 select-none">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 pt-12 pb-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Open Engineering Library</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
            Published Technical Papers &amp; Guides
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Read verified system designs, microservice benchmarks, AI/ML models,
            and developer notes published by technical contributors.
          </p>
        </div>
      </section>

      {/* Main Articles Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-12">
        {articles.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              No articles published yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Check back soon for new technical papers or log in to create the
              first story.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const wordCount = article.content
                ? article.content.replace(/<[^>]*>/g, " ").split(/\s+/).length
                : 0;
              const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

              return (
                <article
                  key={article._id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group hover:border-indigo-300 relative"
                >
                  <div>
                    {/* Cover Banner */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-indigo-50/50 border border-indigo-100">
                      <Image
                        src={
                          article.coverImage ||
                          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"
                        }
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-700/90 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20">
                        {article.category || "Architecture"}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {readTimeMin} min read
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    {/* Title & Excerpt */}
                    <h2 className="font-heading font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2 leading-snug">
                      <Link href={`/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
                      {article.excerpt || "Read full story..."}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden relative">
                        {article.authorId?.avatar ? (
                          <Image
                            src={article.authorId.avatar}
                            alt={article.authorId.name || "Author"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-28">
                        {article.authorId?.name || "Technical Author"}
                      </span>
                    </div>

                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition border border-indigo-200"
                    >
                      <span>Read</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
