import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "我的博客",
  description: "一个部署在 Vercel 上的个人博客"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <a className="brand" href="/">
              我的博客
            </a>
            <nav className="site-nav" aria-label="主导航">
              <a href="/">文章</a>
              <a href="https://vercel.com" target="_blank" rel="noreferrer">
                Vercel
              </a>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <span>© 2026 我的博客</span>
            <span>Built with Next.js</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
