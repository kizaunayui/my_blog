import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="inline-flex items-center rounded-full border border-slate-200/40 bg-white/10 dark:border-white/10 dark:bg-slate-900/20 px-3 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300 transition duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-600 dark:hover:border-cyan-400/30 dark:hover:bg-cyan-400/5 dark:hover:text-cyan-400 shadow-sm"
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
