import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="inline-flex items-center rounded-full border border-slate-200/40 bg-white/10 dark:border-cyan-200/25 dark:bg-slate-900/45 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-100 transition duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-600 dark:hover:border-cyan-200/50 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-100 shadow-sm"
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
