import { sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import dynamic from 'next/dynamic'
const MusicPlayer = dynamic(() => import('@/components/MusicPlayer'), { ssr: false })

const POSTS_PER_PAGE = 5

export default async function Page() {
  const posts = sortPosts(allBlogs)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages,
  }

  return (
    <>
      <Main posts={posts} initialDisplayPosts={initialDisplayPosts} pagination={pagination} />
      <MusicPlayer />
    </>
  )
}
