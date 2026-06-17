import { slug } from 'github-slugger'
import type { PromptItem } from './promptsData'

export function getPromptSlug(item: Pick<PromptItem, 'title'>) {
  return slug(item.title)
}

export function findPromptBySlug(prompts: PromptItem[], requestedSlug: string) {
  const decodedSlug = decodeURIComponent(requestedSlug)

  return prompts.find((item) => {
    const itemSlug = getPromptSlug(item)
    return itemSlug === decodedSlug || item.title === decodedSlug
  })
}
