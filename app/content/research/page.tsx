import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ArticleList from '@/components/ArticleList'

const category = '项目研究'

export const metadata = genPageMetadata({ title: category })

export default async function ResearchContentPage() {
  const posts = allCoreContent(sortPosts(allBlogs)).filter((post) => post.category === category)

  return (
    <ArticleList
      posts={posts}
      title={category}
      fixedCategory={category}
      description="用于展示医院院内物流机器人、多智能体协同调度、MARL、任务分配、通信机制和文献阅读等研究笔记。"
    />
  )
}
