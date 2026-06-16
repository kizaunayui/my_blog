import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import Magnetic from './Magnetic'

const Header = () => {
  const basePath = process.env.BASE_PATH || ''

  return (
    <header className="header-elegant relative z-50 -mx-4 flex w-[calc(100%+2rem)] items-center justify-between bg-transparent px-4 py-5 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6">
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="group/logo flex items-center gap-3.5 transition-all duration-400">
          <Magnetic range={50} actionStrength={0.25}>
            <div className="header-avatar-ring relative cursor-pointer">
              <img
                src={`${basePath}/static/images/kieran-icon.jpg`}
                alt="Kieran"
                aria-hidden="true"
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
          </Magnetic>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="font-display hidden text-lg font-light tracking-[0.22em] text-white/90 uppercase transition-colors duration-300 group-hover/logo:text-white sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center leading-5 sm:-mr-2">
        <nav className="header-nav hidden items-center gap-x-1 sm:flex">
          {headerNavLinks.map((link) =>
            link.children ? (
              <div key={link.title} className="group relative">
                <Magnetic range={40} actionStrength={0.3}>
                  <Link
                    href={link.href}
                    className="header-nav-link font-heading inline-flex items-center gap-1 px-3.5 py-2 text-[11px] font-bold tracking-[0.2em] uppercase"
                  >
                    {link.title}
                    <span
                      aria-hidden="true"
                      className="text-[10px] leading-none opacity-60 transition-transform duration-300 group-hover:rotate-180"
                    >
                      ▾
                    </span>
                  </Link>
                </Magnetic>
                <div className="invisible absolute top-full left-1/2 min-w-56 -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="header-dropdown rounded-xl border border-white/15 bg-gray-900/85 p-1.5 shadow-2xl backdrop-blur-2xl">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="font-heading block rounded-lg px-3.5 py-2.5 text-xs font-semibold tracking-wider text-gray-300 uppercase transition-all duration-200 hover:bg-white/10 hover:pl-4.5 hover:text-white"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Magnetic key={link.title} range={40} actionStrength={0.3}>
                <Link
                  href={link.href}
                  className="header-nav-link font-heading px-3.5 py-2 text-[11px] font-bold tracking-[0.2em] uppercase"
                >
                  {link.title}
                </Link>
              </Magnetic>
            )
          )}
        </nav>
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
