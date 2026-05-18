import { redirect } from 'next/navigation'

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  redirect(`/articles/page/${params.page}`)
}
