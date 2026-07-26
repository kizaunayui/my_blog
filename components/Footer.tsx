import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="site-footer mt-12 mb-8 sm:mt-20 sm:mb-10">
      <div className="footer-colophon flex flex-col gap-6 pt-7 sm:flex-row sm:items-end sm:justify-between sm:pt-8">
        <div>
          <div className="font-display text-sm font-light tracking-[0.22em] text-white/85 uppercase">
            {siteMetadata.headerTitle}
          </div>
          <div className="font-heading mt-2 text-[9px] font-semibold tracking-[0.3em] text-white/35 uppercase">
            VOL. 01 / DIGITAL GARDEN
          </div>
        </div>
        <div className="font-heading flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-semibold tracking-[0.22em] text-white/55 uppercase">
          <SocialIcon kind="github" href={siteMetadata.github} size={5} />
          <Link href="/feed.xml" className="transition-colors hover:text-white">
            RSS
          </Link>
          <span className="text-white/40">
            © {new Date().getFullYear()} {siteMetadata.author}
          </span>
        </div>
      </div>
    </footer>
  )
}
