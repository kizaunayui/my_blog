import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  const headerClass =
    'sticky top-0 z-50 -mx-4 flex w-[calc(100%+2rem)] items-center justify-between border-b border-gray-200/90 bg-white/95 px-4 py-4 shadow-lg shadow-gray-900/10 backdrop-blur-2xl dark:border-gray-700/80 dark:bg-gray-950/90 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6'

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between transition duration-300 hover:scale-[1.02]">
          <div className="mr-3 rounded-2xl bg-white/90 p-1.5 shadow-sm ring-1 ring-gray-200/90 dark:bg-gray-900/90 dark:ring-gray-700">
            <Logo />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 bg-gradient-to-r from-gray-950 via-primary-600 to-teal-500 bg-clip-text text-2xl font-black text-transparent sm:block dark:from-white dark:via-primary-300 dark:to-teal-300">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-3 leading-5 sm:-mr-2 sm:space-x-4">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-2 overflow-x-auto rounded-full border border-gray-300/90 bg-white/95 p-1 shadow-md shadow-gray-900/10 backdrop-blur-2xl sm:flex md:max-w-72 lg:max-w-96 dark:border-gray-600/90 dark:bg-gray-950/90">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm font-extrabold text-gray-950 opacity-100 transition hover:bg-primary-50 hover:text-primary-600 dark:text-gray-50 dark:hover:bg-primary-950/50 dark:hover:text-primary-200"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
