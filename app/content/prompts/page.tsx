import { genPageMetadata } from 'app/seo'
import PromptLibrary from '@/components/PromptLibrary'
import { promptsData } from '@/data/promptsData'

export const metadata = genPageMetadata({ title: 'Prompt Library' })

export default function PromptContentPage() {
  return <PromptLibrary prompts={promptsData} />
}
