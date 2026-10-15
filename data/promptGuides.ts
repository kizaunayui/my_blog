import { promptsData } from './promptsData'

export const promptExamples: Record<string, string> = Object.fromEntries(
  promptsData.map((item) => [item.title, item.example])
)
