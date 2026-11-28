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
  { href: '/content/projects', title: '项目与作品' },
  { href: '/albums', title: '专辑' },
  { href: '/study', title: '自习室' },
  { href: '/about', title: '关于我' },
]

export default headerNavLinks
