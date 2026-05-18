import { contentSections } from './contentSections'

const headerNavLinks = [
  { href: '/', title: '首页' },
  { href: '/articles', title: '文章' },
  { href: '/content', title: '内容中心', children: contentSections },
  { href: '/about', title: '关于我' },
]

export default headerNavLinks
