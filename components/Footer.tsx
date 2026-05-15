import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="site-footer mt-16 mb-8">
      <div className="footer-glass-panel mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] border border-white/20 bg-white/16 px-6 py-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl sm:px-8">
        <div className="mb-4 flex flex-wrap justify-center gap-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
          <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={6} />
          <SocialIcon kind="x" href={siteMetadata.x} size={6} />
          <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
          <SocialIcon kind="threads" href={siteMetadata.threads} size={6} />
          <SocialIcon kind="medium" href={siteMetadata.medium} size={6} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm font-bold text-white/88 drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/" className="text-pink-100 hover:text-white">
            {siteMetadata.title}
          </Link>
        </div>
      </div>
    </footer>
  )
}
