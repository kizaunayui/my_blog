export const contentSections = [
  {
    title: 'Prompt 模板库',
    href: '/content/prompts',
    category: 'Prompt 模板库',
    description:
      '收录学习、科研、写作、开发和内容生成中常用的 Prompt 模板，记录可复用结构、使用场景和实际效果。',
    accent: 'from-pink-500/80 to-sky-400/70',
  },
  {
    title: '作品展示',
    href: '/content/works',
    category: '作品展示',
    description:
      '展示个人博客、项目、文档、PPT、软件著作权及 AI 辅助创作成果，记录从想法到成品的过程。',
    accent: 'from-violet-500/80 to-fuchsia-400/70',
  },
  {
    title: '项目研究',
    href: '/content/research',
    category: '项目研究',
    description:
      '记录医院院内物流机器人、多智能体协同调度、MARL、任务分配和协作优化方向的研究笔记。',
    accent: 'from-amber-500/80 to-rose-400/70',
  },
] as const

export type ContentSection = (typeof contentSections)[number]
export type ContentCategory = ContentSection['category']

export const contentSectionByCategory = Object.fromEntries(
  contentSections.map((section) => [section.category, section])
) as Record<ContentCategory, ContentSection>
