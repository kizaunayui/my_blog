/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Kieran Space',
  author: 'Kieran',
  headerTitle: 'Kieran Space',
  description: 'Kieran Space：记录技术学习、项目实践和个人随笔的数字空间。',
  language: 'zh-cn',
  theme: 'system',
  siteUrl: 'https://oyzy666.com',
  siteRepo: 'https://github.com/kizaunayui/my_blog',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: '',
  github: 'https://github.com/kizaunayui',
  locale: 'zh-CN',
  stickyNav: false,
  analytics: {},
  newsletter: {
    provider: 'buttondown',
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'zh-CN',
    },
  },
}

module.exports = siteMetadata
