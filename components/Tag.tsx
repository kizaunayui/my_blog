import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="border-primary-200/70 bg-primary-50/80 text-primary-700 hover:border-primary-300 hover:bg-primary-100 dark:border-primary-800/70 dark:bg-primary-950/30 dark:text-primary-300 dark:hover:border-primary-700 dark:hover:bg-primary-900/40 inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wide uppercase transition duration-200 hover:-translate-y-0.5"
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
