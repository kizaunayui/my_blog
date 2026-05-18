import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import ArticleList from '@/components/ArticleList'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE)
  return Array.from({ length: totalPages }, (_, index) => ({ page: (index + 1).toString() }))
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const pageNumber = parseInt(params.page, 10)
  const posts = allCoreContent(sortPosts(allBlogs))
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }

  return (
    <ArticleList
      posts={posts}
      title={`文章 · 第 ${pageNumber} 页`}
      description="这里汇总博客中的全部文章，可按所属栏目、标签筛选，也可以搜索标题和摘要。"
    />
  )
}
