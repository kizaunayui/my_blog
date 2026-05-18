import { allBlogs } from 'contentlayer/generated'
import { redirect } from 'next/navigation'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE)
  return Array.from({ length: totalPages }, (_, index) => ({ page: (index + 1).toString() }))
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  redirect(`/articles/page/${params.page}`)
}
