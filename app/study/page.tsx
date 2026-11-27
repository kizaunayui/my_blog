import { genPageMetadata } from 'app/seo'
import StudyRoom from './StudyRoom'

export const metadata = genPageMetadata({
  title: '自习室',
  description: 'Kieran Space 的自习室。选一张博客背景，开始专注计时，记录今天的学习时间。',
  alternates: { canonical: '/study/' },
})

export default function StudyPage() {
  return <StudyRoom basePath={process.env.BASE_PATH || ''} />
}
