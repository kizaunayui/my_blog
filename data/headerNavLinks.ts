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
  { href: '/content/prompts', title: 'Prompt' },
  { href: '/about', title: '关于我' },
]

export default headerNavLinks
