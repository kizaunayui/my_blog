import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ContentPostList from '@/components/ContentPostList'

const category = '作品展示'

export const metadata = genPageMetadata({ title: category })

export default async function WorksContentPage() {
  const posts = allCoreContent(sortPosts(allBlogs)).filter((post) => post.category === category)

  return (
    <ContentPostList
      posts={posts}
      title={category}
      description="这里用于展示个人作品和成果，样式保持接近文章列表。"
      emptyText="暂无作品展示内容。后续添加 category 为“作品展示”的 MDX 文章后会显示在这里。"
    />
  )
}
