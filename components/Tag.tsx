import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="font-heading inline-flex items-center rounded-full border border-white/15 bg-transparent px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-slate-200 uppercase transition duration-300 hover:border-cyan-200/45 hover:text-cyan-100"
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
