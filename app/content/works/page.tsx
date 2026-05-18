import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ArticleList from '@/components/ArticleList'

const category = '作品展示'

export const metadata = genPageMetadata({ title: category })

export default async function WorksContentPage() {
  const posts = allCoreContent(sortPosts(allBlogs)).filter((post) => post.category === category)

  return (
    <ArticleList
      posts={posts}
      title={category}
      fixedCategory={category}
      description="用于展示个人博客、软件著作权、PPT / 文档作品、GitHub 项目、AI 辅助创作案例和小工具。"
    />
  )
}
