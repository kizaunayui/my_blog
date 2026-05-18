import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ArticleList from '@/components/ArticleList'

export const metadata = genPageMetadata({ title: '文章' })

export default async function ArticlesPage() {
  const posts = allCoreContent(sortPosts(allBlogs))

  return (
    <ArticleList
      posts={posts}
      title="文章"
      description="这里汇总博客中的全部文章，可按所属栏目、标签筛选，也可以搜索标题和摘要。"
    />
  )
}
