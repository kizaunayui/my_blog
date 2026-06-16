import {
  Mail,
  Github,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  X,
  Mastodon,
  Threads,
  Instagram,
  Medium,
  Bluesky,
  Steam,
  Netease,
  Bangumi,
  Bilibili,
} from './icons'

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  x: X,
  mastodon: Mastodon,
  threads: Threads,
  instagram: Instagram,
  medium: Medium,
  bluesky: Bluesky,
  steam: Steam,
  netease: Netease,
  bangumi: Bangumi,
  bilibili: Bilibili,
}

type SocialIconProps = {
  kind: keyof typeof components
  href: string | undefined
  size?: number
}

const SocialIcon = ({ kind, href, size = 8 }: SocialIconProps) => {
  if (
    !href ||
    (kind === 'mail' && !/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(href))
  ) {
    return null
  }

  const SocialSvg = components[kind]
  const isMailLink = href.startsWith('mailto:')
  const iconSize = `${size * 0.25}rem`

  return (
    <a
      className="text-sm text-gray-500 transition hover:text-gray-600"
      target={isMailLink ? undefined : '_blank'}
      rel={isMailLink ? undefined : 'noopener noreferrer'}
      href={href}
      aria-label={kind}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className="hover:text-primary-500 dark:hover:text-primary-400 fill-current text-gray-700 transition dark:text-gray-200"
        style={{ width: iconSize, height: iconSize }}
      />
    </a>
  )
}

export default SocialIcon
