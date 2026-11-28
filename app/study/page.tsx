import { genPageMetadata } from 'app/seo'
import StudyRoom from './StudyRoom'

export const metadata = genPageMetadata({
  title: '自习室',
  description: 'Kieran Space 的自习室。背景自动轮换，开始计时就能学习。',
  alternates: { canonical: '/study/' },
})

export default function StudyPage() {
  return <StudyRoom basePath={process.env.BASE_PATH || ''} />
}
