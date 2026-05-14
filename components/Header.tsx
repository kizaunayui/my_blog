import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  const headerClass =
    'sticky top-0 z-50 -mx-4 flex w-[calc(100%+2rem)] items-center justify-between border-b border-gray-200/70 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-gray-800/70 dark:bg-gray-950/75 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6'

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between transition duration-300 hover:scale-[1.02]">
          <div className="mr-3 rounded-2xl bg-white/70 p-1.5 shadow-sm ring-1 ring-gray-200/80 dark:bg-gray-900/70 dark:ring-gray-800">
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
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-2 overflow-x-auto rounded-full border border-gray-200/80 bg-white/70 p-1 shadow-sm backdrop-blur sm:flex md:max-w-72 lg:max-w-96 dark:border-gray-800/80 dark:bg-gray-900/60">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 dark:text-gray-200 dark:hover:bg-primary-950/40 dark:hover:text-primary-300"
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
