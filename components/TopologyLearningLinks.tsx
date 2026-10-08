import Link from '@/components/Link'
import series from '../lib/learningSeries/topology-optimization.json'

type Props = { topicId?: string; placement?: 'intro' | 'footer' }

const moduleHref = (href: string) => '#' + href.split('#')[1]

export default function TopologyLearningLinks({ topicId, placement = 'intro' }: Props) {
  const selected = topicId ? series.topics.find((topic) => topic.id === topicId) : undefined
  if (topicId && !selected) return null
  const index = selected ? series.topics.indexOf(selected) : -1
  const previous = index > 0 ? series.topics[index - 1] : undefined
  const next = selected ? series.topics[index + 1] : undefined
  const step = selected ? series.steps.find((item) => item.id === selected.step) : undefined

  return (
    <nav
      aria-label={
        selected
          ? placement === 'footer'
            ? '回到主线与继续阅读'
            : '本专题的学习关系'
          : '学习模块目录'
      }
      className="topology-learning-links not-prose my-8 rounded-2xl border border-cyan-400/25 bg-slate-950/90 p-5 text-sm leading-7 text-slate-200"
    >
      {!selected ? (
        <>
          <p className="m-0 font-semibold">学习模块 · 第一轮讲解已整理</p>
          <p className="mt-2 mb-4">
            按01—07顺序查看，也可以从主线疑问直接进入小节。所有模块都在本页。
          </p>
          {series.topics.map((topic) => {
            const topicStep = series.steps.find((item) => item.id === topic.step)!
            return (
              <div key={topic.id} className="border-t border-cyan-400/20 py-3">
                <p className="m-0">
                  <Link href={moduleHref(topic.href)}>
                    模块 {topic.id} · {topic.title}
                  </Link>
                </p>
                <p className="m-0 text-slate-300">
                  承接：{topic.id === '07' ? '贯穿六步的综合判断' : topicStep.label}；{' '}
                  <Link href={'#' + topic.returnAnchor}>回到主线疑问</Link>
                </p>
              </div>
            )
          })}
        </>
      ) : placement === 'intro' ? (
        <>
          <p className="m-0 font-semibold">模块 {selected.id} · 第一轮讲解已整理</p>
          <p className="mt-2 mb-0">
            承接主线：
            <Link href={'#' + (selected.id === '07' ? 'series-evaluation' : step!.anchor)}>
              {selected.id === '07' ? '六步主线的综合判断' : step!.label}
            </Link>
            。
          </p>
          <p className="m-0">
            从这里来：
            {selected.returnLinks.map((item, i) => (
              <span key={item.anchor}>
                {i > 0 ? ' · ' : ''}
                <Link href={'#' + item.anchor}>{item.label}</Link>
              </span>
            ))}
          </p>
          <p className="m-0">
            必要先读：
            {selected.requiresTopics.length === 0 ? (
              <Link href="#step-model">主线中的模型与符号</Link>
            ) : (
              selected.requiresTopics.map((id, i) => {
                const prerequisite = series.topics.find((item) => item.id === id)!
                return (
                  <span key={id}>
                    {i > 0 ? ' · ' : ''}
                    <Link href={moduleHref(prerequisite.href)}>
                      模块 {id}：{prerequisite.title}
                    </Link>
                  </span>
                )
              })
            )}
          </p>
        </>
      ) : (
        <>
          <p className="m-0 font-semibold">相关记录</p>
          <p className="mt-2 mb-0">
            <Link href={'#' + selected.returnAnchor}>回到主线对应疑问</Link> ·{' '}
            <Link href={'#' + selected.continueAnchor}>{selected.continueLabel}</Link>
          </p>
          <p className="m-0">
            {previous ? (
              <Link href={moduleHref(previous.href)}>
                上一个模块 · {previous.id}：{previous.title}
              </Link>
            ) : (
              <Link href="#step-structure">回到主线开头</Link>
            )}
          </p>
          <p className="m-0">
            {next ? (
              <Link href={moduleHref(next.href)}>
                下一个模块 · {next.id}：{next.title}
              </Link>
            ) : (
              <Link href="#series-evaluation">回到主线的综合判断</Link>
            )}
          </p>
        </>
      )}
    </nav>
  )
}
