import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'

const Header = () => {
  const basePath = process.env.BASE_PATH || ''

  return (
    <header className="relative z-50 -mx-4 flex w-[calc(100%+2rem)] items-center justify-between border-b border-white/10 bg-transparent px-4 py-4 shadow-lg shadow-black/10 backdrop-blur-2xl sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6">
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between transition duration-300 hover:scale-[1.02]">
          <div className="mr-4 rounded-[18px] p-1 shadow-sm ring-1">
            <img
              src={`${basePath}/static/images/kieran-icon.jpg`}
              alt=""
              aria-hidden="true"
              className="h-12 w-12 rounded-[14px] object-cover"
            />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden bg-gradient-to-r from-white via-pink-200 to-sky-200 bg-clip-text text-2xl leading-normal font-black text-transparent sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-3 leading-5 sm:-mr-2 sm:space-x-4">
        <div className="no-scrollbar flex items-center gap-x-1.5 overflow-visible rounded-full border p-1 shadow-md backdrop-blur-2xl">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm font-bold opacity-100 transition hover:bg-white/15 hover:text-pink-100"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
