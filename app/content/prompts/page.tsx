import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ArticleList from '@/components/ArticleList'

const category = 'Prompt 模板库'

export const metadata = genPageMetadata({ title: category })

export default async function PromptContentPage() {
  const posts = allCoreContent(sortPosts(allBlogs)).filter((post) => post.category === category)

  return (
    <ArticleList
      posts={posts}
      title={category}
      fixedCategory={category}
      description="用于展示学习整理、论文科研、代码开发、PPT / 文档生成和 AI 工具使用相关的 Prompt 文章。"
    />
  )
}
