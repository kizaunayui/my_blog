import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'

const Header = () => {
  const basePath = process.env.BASE_PATH || ''

  return (
    <header className="relative z-50 -mx-4 flex w-[calc(100%+2rem)] items-center justify-between bg-transparent px-4 py-4 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6">
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between transition duration-300 hover:scale-[1.02]">
          <div className="mr-3.5 rounded-full p-0.5 border border-white/20 bg-white/10 shadow-sm backdrop-blur-sm">
            <img
              src={`${basePath}/static/images/kieran-icon.jpg`}
              alt="Kieran"
              aria-hidden="true"
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden text-lg font-light tracking-[0.22em] text-white sm:block uppercase font-display">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-3 leading-5 sm:-mr-2 sm:space-x-4">
        <nav className="no-scrollbar hidden items-center gap-x-1 overflow-visible rounded-full border p-1 shadow-md backdrop-blur-2xl sm:flex">
          {headerNavLinks.map((link) =>
            link.children ? (
              <div key={link.title} className="group relative">
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] font-heading opacity-100 transition hover:bg-white/15 hover:text-pink-100"
                >
                  {link.title}
                  <span aria-hidden="true" className="text-[10px] leading-none opacity-80">
                    ▾
                  </span>
                </Link>
                <div className="invisible absolute left-1/2 top-full min-w-56 -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded-xl border border-white/20 bg-gray-900/90 p-1.5 shadow-xl backdrop-blur-xl">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider font-heading text-gray-200 transition hover:bg-white/10 hover:text-white"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.title}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] font-heading opacity-100 transition hover:bg-white/15 hover:text-pink-100"
              >
                {link.title}
              </Link>
            )
          )}
        </nav>
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
