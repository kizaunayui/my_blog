import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Personal Blog</p>
        <h1>记录想法、项目和长期学习。</h1>
        <p>
          这是一个轻量的博客模板：文章用 Markdown 管理，页面由 Next.js 静态生成，
          可以直接部署到 Vercel。
        </p>
      </section>

      <section className="post-list" aria-label="文章列表">
        {posts.map((post) => (
          <article className="post-card" key={post.slug}>
            <div className="post-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>{post.readingTime} 分钟阅读</span>
            </div>
            <h2>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.excerpt}</p>
            <div className="tag-row">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(date));
}
