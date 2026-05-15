import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  const headerClass =
    'sticky top-0 z-[9999] -mx-4 flex w-[calc(100%+2rem)] items-center justify-between border-b border-white/10 bg-transparent px-4 py-4 shadow-lg shadow-black/10 backdrop-blur-2xl sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6'

  return (
    <header
      className={headerClass}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        color: '#f8fafc',
        backgroundColor: 'rgba(2, 6, 23, 0.34)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        boxShadow: '0 18px 48px rgba(2, 6, 23, 0.18)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.22)',
        backdropFilter: 'blur(24px) saturate(1.22)',
      }}
    >
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between transition duration-300 hover:scale-[1.02]">
          <div
            className="mr-3 rounded-2xl p-1.5 shadow-sm ring-1"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.32)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              boxShadow: '0 10px 30px rgba(2, 6, 23, 0.18)',
            }}
          >
            <Logo />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 bg-gradient-to-r from-white via-pink-200 to-sky-200 bg-clip-text text-2xl font-black text-transparent sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-3 leading-5 sm:-mr-2 sm:space-x-4">
        <div
          className="no-scrollbar flex items-center gap-x-1.5 overflow-visible rounded-full border p-1 shadow-md backdrop-blur-2xl"
          style={{
            display: 'flex',
            visibility: 'visible',
            opacity: 1,
            backgroundColor: 'rgba(15, 23, 42, 0.36)',
            borderColor: 'rgba(255, 255, 255, 0.16)',
            boxShadow: '0 14px 36px rgba(2, 6, 23, 0.16)',
            position: 'relative',
            zIndex: 10000,
          }}
        >
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm font-bold opacity-100 transition hover:bg-white/15 hover:text-pink-100"
                style={{
                  color: 'rgba(255, 255, 255, 0.92)',
                  opacity: 1,
                  fontWeight: 800,
                  textShadow: '0 8px 24px rgba(0, 0, 0, 0.32)',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  zIndex: 10001,
                }}
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
