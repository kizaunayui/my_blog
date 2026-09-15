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
    title: '项目与作品',
    href: '/content/projects',
    category: '作品展示',
    description: '从软件演示到研究笔记，集中查看项目背景、实现过程与阶段性成果。',
    accent: 'from-cyan-500/80 to-sky-400/70',
  },
] as const

export type ContentSection = (typeof contentSections)[number]
export type ContentCategory = ContentSection['category']
