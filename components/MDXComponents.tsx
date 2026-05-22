import { Children, isValidElement } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

const figureCaptions: Record<string, string> = {
  'rl-note-01.png': '图 1 回报与状态价值的关系',
  'rl-note-02.png': '图 2 状态价值函数的形式定义',
  'rl-note-03.png': '图 3 状态价值的计算逻辑与示例',
  'rl-note-04.png': '图 4 Bellman 方程的矩阵形式',
  'rl-note-05.png': '图 5 Bellman 方程的分量展开形式',
  'rl-note-06.png': '图 6 状态价值与动作价值的关系',
  'rl-note-07.png': '图 7 Bellman 方程的推导与构成',
  'rl-note-08.png': '图 8 策略评估的两种求解方法',
  'rl-note-09.png': '图 9 动作价值函数的形式定义',
  'rl-note-10.png': '图 10 动作价值与状态价值的转换关系',
  'rl-note-11.png': '图 11 Bellman 最优方程',
  'rl-note-12.png': '图 12 价值迭代的基本思想',
  'rl-note-13.png': '图 13 价值迭代的更新过程',
  'rl-note-14.png': '图 14 价值函数迭代示例',
  'rl-note-15.png': '图 15 由价值函数导出最优策略',
  'rl-note-16.png': '图 16 Policy Iteration、Value Iteration 与 Truncated Policy Iteration 对比',
  'rl-note-17.png': '图 17 Monte Carlo 估计方法',
  'rl-note-18.png': '图 18 一个 Episode 中状态—动作序列的表达',
  'rl-note-19.png': '图 19 ε-Greedy 策略的动作选择概率',
  'rl-note-20.png': '图 20 增量式均值估计方法',
  'rl-note-21.png': '图 21 增量式更新公式',
  'rl-note-22.png': '图 22 Robbins-Monro 随机逼近算法',
  'rl-note-23.png': '图 23 Robbins-Monro 更新形式',
  'rl-note-24.png': '图 24 TD 方法的状态价值更新公式',
  'rl-note-25.png': '图 25 TD Target 与 TD Error',
  'rl-note-26.png': '图 26 TD 方法与 Monte Carlo 方法对比',
  'rl-note-27.png': '图 27 Sarsa 算法的数据结构',
  'rl-note-28.png': '图 28 Sarsa 的动作价值更新公式',
  'rl-note-29.png': '图 29 Expected Sarsa 更新公式',
  'rl-note-30.png': '图 30 n-step Sarsa 的回报估计方式',
  'rl-note-31.png': '图 31 Q-Learning 更新公式',
  'rl-note-32.png': '图 32 Q-Learning 算法步骤',
  'rl-note-33.png': '图 33 Q-Learning 的策略更新过程',
  'rl-note-34.png': '图 34 Q-Learning 对应的 Bellman 最优方程',
  'rl-note-35.png': '图 35 TD 类算法的目标值对比',
  'rl-note-36.png': '图 36 TD、Sarsa、Expected Sarsa 与 Q-Learning 的 Target 差异',
  'rl-note-37.png': '图 37 价值函数近似的基本框架',
  'rl-note-38.png': '图 38 线性特征与 TD-linear 近似',
  'rl-note-39.png': '图 39 Sarsa 与函数近似的结合方式',
  'rl-note-40.png': '图 40 DQN 的目标函数与损失函数',
  'rl-note-41.png': '图 41 DQN 中目标网络的引入',
  'rl-note-42.png': '图 42 DQN 双网络结构与参数更新',
  'rl-note-43.png': '图 43 经验回放机制',
  'rl-note-44.png': '图 44 DQN 训练流程',
  'rl-note-45.png': '图 45 策略的表格形式与函数形式',
  'rl-note-46.png': '图 46 Average Reward 的定义',
  'rl-note-47.png': '图 47 状态分布下的平均奖励分解',
  'rl-note-48.png': '图 48 状态—动作—奖励的期望关系',
  'rl-note-49.png': '图 49 策略梯度的统一表达式',
  'rl-note-50.png': '图 50 REINFORCE 算法框架',
  'rl-note-51.png': '图 51 REINFORCE 参数更新公式',
  'rl-note-52.png': '图 52 Actor-Critic 算法结构',
  'rl-note-53.png': '图 53 QAC 基础算法',
  'rl-note-54.png': '图 54 A2C 中 Baseline 与 Advantage 的引入',
  'rl-note-55.png': '图 55 A2C 算法更新流程',
  'rl-note-56.png': '图 56 Actor-Critic 结合重要性采样的 Off-policy 改进',
}

function getImageInfo(children: ReactNode): { alt: string | null; src: string | null } {
  let alt: string | null = null
  let src: string | null = null

  Children.forEach(children, (child) => {
    if ((alt && src) || !isValidElement(child)) return

    const props = child.props as { alt?: unknown; src?: unknown; children?: ReactNode }

    if (!alt && typeof props.alt === 'string' && props.alt.trim()) {
      alt = props.alt.trim()
    }

    if (!src && typeof props.src === 'string' && props.src.trim()) {
      src = props.src.trim()
    }

    if (props.children) {
      const nested = getImageInfo(props.children)
      alt = alt || nested.alt
      src = src || nested.src
    }
  })

  return { alt, src }
}

function getCaptionFromSrc(src: string | null): string | null {
  if (!src) return null

  const fileName = src.split('/').pop()
  if (!fileName) return null

  return figureCaptions[fileName] ?? null
}

function hasFigcaption(children: ReactNode): boolean {
  let hasCaption = false

  Children.forEach(children, (child) => {
    if (hasCaption || !isValidElement(child)) return

    if (child.type === 'figcaption') {
      hasCaption = true
      return
    }

    const props = child.props as { children?: ReactNode }
    if (props.children) {
      hasCaption = hasFigcaption(props.children)
    }
  })

  return hasCaption
}

function Figure({ children, ...props }: HTMLAttributes<HTMLElement> & { children?: ReactNode }) {
  const { alt, src } = getImageInfo(children)
  const caption = getCaptionFromSrc(src) ?? alt
  const shouldShowCaption = typeof caption === 'string' && caption.trim() && !hasFigcaption(children)

  return (
    <figure {...props}>
      {children}
      {shouldShowCaption ? (
        <figcaption className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  figure: Figure,
  BlogNewsletterForm,
}
