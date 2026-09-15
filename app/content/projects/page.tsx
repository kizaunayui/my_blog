import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ContentPostList from '@/components/ContentPostList'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
export const metadata = genPageMetadata({ title: '项目与作品' })
export default function ProjectsPage() {
  const posts = allCoreContent(sortPosts(allBlogs)).filter(
    (post) => !post.draft && ['作品展示', '项目研究'].includes(post.category || '')
  )
  return (
    <>
      <section className="border-b border-white/10 py-8">
        <p className="editorial-kicker">Featured Project</p>
        <h2 className="mt-3 font-serif text-3xl text-white">医院物流机器人</h2>
        <p className="mt-4 leading-8 text-slate-200">
          围绕院内运输场景，串联路径规划、协同调度软件和多智能体强化学习笔记。
        </p>
        <Link
          href="/articles/hospital-logistics-overview"
          className="mt-4 inline-block text-cyan-200"
        >
          查看项目总览 →
        </Link>
      </section>
      <ContentPostList
        posts={posts}
        title="项目与作品"
        description="软件、研究笔记与阶段性成果。"
        emptyText="项目内容正在整理中。"
      />
    </>
  )
}
