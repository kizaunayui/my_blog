import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ContentPostList from '@/components/ContentPostList'

const category = '项目研究'

export const metadata = genPageMetadata({ title: category })

export default async function ResearchContentPage() {
  const posts = allCoreContent(sortPosts(allBlogs)).filter((post) => post.category === category)

  return (
    <ContentPostList
      posts={posts}
      title={category}
      description="这里用于记录项目研究内容和阶段性研究笔记，样式保持接近文章列表。"
      emptyText="暂无项目研究内容。后续添加 category 为“项目研究”的 MDX 文章后会显示在这里。"
    />
  )
}
