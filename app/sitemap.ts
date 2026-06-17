import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { getPromptSlug } from '@/data/promptSlugs'
import { promptsData } from '@/data/promptsData'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/articles/${post.slug}/`,
      lastModified: post.lastmod || post.date,
    }))

  const promptRoutes = promptsData.map((prompt) => ({
    url: `${siteUrl}/content/${getPromptSlug(prompt)}/`,
    lastModified: prompt.updatedAt,
  }))

  const routes = [
    '',
    'articles',
    'tags',
    'about',
    'content/prompts',
    'content/works',
    'content/research',
  ].map((route) => ({
    url: route ? `${siteUrl}/${route}/` : `${siteUrl}/`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes, ...promptRoutes]
}
