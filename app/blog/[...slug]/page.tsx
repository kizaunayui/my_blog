import { allBlogs } from 'contentlayer/generated'
import { redirect } from 'next/navigation'

export const generateStaticParams = async () => {
  return allBlogs.map((post) => ({ slug: post.slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  redirect(`/articles/${params.slug.map((part) => encodeURIComponent(part)).join('/')}`)
}
