import Link from '@/components/Link'

export default function NotFound() {
  return (
    <section className="not-found-page flex min-h-[calc(100vh-12rem)] items-center py-12 sm:py-16">
      <div className="editorial-masthead w-full border-b border-white/10 px-1 py-10 sm:py-14">
        <div className="grid items-end gap-8 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-12">
          <div className="not-found-index font-display text-7xl font-light tracking-[0.08em] text-white/18 sm:text-8xl">
            404
          </div>
          <div>
            <p className="editorial-kicker editorial-kicker--pink">Lost Signal · 页面未找到</p>
            <h1 className="editorial-title mt-3">这一页暂时走丢了</h1>
            <p className="editorial-summary mt-5">
              可能是链接已经更新，也可能这段内容还没有被写进档案。你可以返回首页，或者继续浏览文章。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/"
                className="editorial-action editorial-action--primary px-6 py-3 text-xs"
              >
                返回首页
              </Link>
              <Link
                href="/articles"
                className="editorial-action editorial-action--quiet px-6 py-3 text-xs"
              >
                浏览文章
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
