import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="inline-flex items-center rounded-full border border-cyan-200/80 bg-cyan-50/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-800 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-100 dark:border-cyan-700/70 dark:bg-cyan-950/35 dark:text-cyan-200 dark:hover:border-cyan-500 dark:hover:bg-cyan-900/45"
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
