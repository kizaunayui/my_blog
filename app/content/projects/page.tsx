import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ContentPostList from '@/components/ContentPostList'
import { genPageMetadata } from 'app/seo'
export const metadata = genPageMetadata({ title: '项目与作品' })
export default function ProjectsPage() {
  const posts = allCoreContent(sortPosts(allBlogs)).filter(
    (post) => !post.draft && ['作品展示', '项目研究'].includes(post.category || '')
  )
  return (
    <ContentPostList
      posts={posts}
      title="项目与作品"
      description="软件、研究笔记与阶段性成果。"
      emptyText="项目内容正在整理中。"
    />
  )
}
