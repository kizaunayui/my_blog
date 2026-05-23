interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: '基于多智能体协同调度的医院院内物流机器人系统',
    description:
      '国家级大学生创新创业训练计划项目。研究多智能体路径规划（MAPF）、多智能体强化学习（MARL）在医院物流场景下的协同调度方案，涉及 Dec-POMDP 建模、冲突搜索算法（CBS）及策略优化。',
    imgSrc: '/static/images/avatar.png',
    href: '/content/research',
  },
  {
    title: 'Kieran Space 个人博客',
    description:
      '基于 Next.js + Tailwind CSS + Contentlayer 搭建的个人博客，记录学习笔记、项目研究、Prompt 模板和随笔。部署于 Vercel，支持暗色模式、标签筛选和 Giscus 评论。',
    imgSrc: '/static/images/logo.png',
    href: 'https://oyzy666.com',
  },
  {
    title: 'Prompt 模板库',
    description:
      '整理学习、科研、写作和开发中常用的 Prompt 模板，包括论文降AI率、文献深度分析、实验报告生成、复习笔记整理等可复用结构。',
    imgSrc: '/static/images/avatar.png',
    href: '/content/prompts',
  },
]

export default projectsData
