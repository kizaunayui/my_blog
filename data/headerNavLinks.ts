import { contentSections } from './contentSections'

type HeaderNavChild = {
  href: string
  title: string
}

type HeaderNavLink = HeaderNavChild & {
  children?: readonly HeaderNavChild[]
}

const headerNavLinks: HeaderNavLink[] = [
  { href: '/', title: '首页' },
  { href: '/articles', title: '文章' },
  { href: '/content', title: '内容中心', children: contentSections },
  { href: '/about', title: '关于我' },
]

export default headerNavLinks
