import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ContentPostList from '@/components/ContentPostList'

const category = '项目研究'

export const metadata = genPageMetadata({
  title: category,
  description: '记录医院物流机器人、多智能体协同调度、MARL、任务分配和协作优化方向的研究笔记。',
})

export default async function ResearchContentPage() {
  const posts = allCoreContent(sortPosts(allBlogs)).filter((post) => post.category === category)

  return (
    <ContentPostList
      posts={posts}
      title={category}
      description="这里记录医院院内物流机器人、多智能体协同调度、MARL、任务分配和协作优化方向的研究笔记。重点不是堆资料，而是沉淀问题建模、技术路线和阶段性结论。"
      emptyText="暂无项目研究内容。添加 category 为“项目研究”的 MDX 文章后，会自动显示在这里。"
    />
  )
}
