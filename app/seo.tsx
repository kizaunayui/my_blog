import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

type PageSEOProps = {
  title: string
  description?: string
  image?: string
} & Omit<Metadata, 'title' | 'description' | 'openGraph' | 'twitter'>

export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  const resolvedDescription = description || siteMetadata.description
  const resolvedImages = image ? [image] : [siteMetadata.socialBanner]

  return {
    title,
    description: resolvedDescription,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: resolvedDescription,
      url: './',
      siteName: siteMetadata.title,
      images: resolvedImages,
      locale: 'zh_CN',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: resolvedImages,
    },
    ...rest,
  }
}
