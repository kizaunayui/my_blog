import { slug } from 'github-slugger'
import type { PromptItem } from './promptsData'

export function getPromptSlug(item: Pick<PromptItem, 'slug'>) {
  return item.slug
}

export function getPromptLegacySlugs(item: Pick<PromptItem, 'legacyTitles'>) {
  return (item.legacyTitles ?? []).map((title) => slug(title))
}

export function findPromptBySlug(prompts: PromptItem[], requestedSlug: string) {
  const decodedSlug = decodeURIComponent(requestedSlug)

  return prompts.find((item) => {
    const itemSlug = getPromptSlug(item)
    return (
      itemSlug === decodedSlug ||
      item.title === decodedSlug ||
      getPromptLegacySlugs(item).includes(decodedSlug) ||
      item.legacyTitles?.includes(decodedSlug)
    )
  })
}
