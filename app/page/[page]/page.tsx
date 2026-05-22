import { allBlogs } from 'contentlayer/generated'
import { sortPosts } from 'pliny/utils/contentlayer'
import { notFound } from 'next/navigation'
import { genPageMetadata } from 'app/seo'
import Main from '../../Main'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: '首页文章' })

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE)
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    page: `${i + 2}`,
  }))
}

export default async function HomePage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const pageNumber = Number.parseInt(page, 10)
  const posts = sortPosts(allBlogs)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  if (pageNumber <= 1 || pageNumber > totalPages || Number.isNaN(pageNumber)) {
    return notFound()
  }

  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages,
  }

  return <Main posts={posts} initialDisplayPosts={initialDisplayPosts} pagination={pagination} />
}
