import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ArticleList from '@/components/ArticleList'

const category = '课程复习笔记'

export const metadata = genPageMetadata({ title: category })

export default async function NotesContentPage() {
  const posts = allCoreContent(sortPosts(allBlogs)).filter((post) => post.category === category)

  return (
    <ArticleList
      posts={posts}
      title={category}
      fixedCategory={category}
      description="用于展示课程复习笔记，重点支持 PDF 下载和在线预览，方便考前快速浏览、下载和打印。"
    />
  )
}
