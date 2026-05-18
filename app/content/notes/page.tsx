import { genPageMetadata } from 'app/seo'
import NotesLibrary from '@/components/NotesLibrary'
import { notesData } from '@/data/notesData'

export const metadata = genPageMetadata({ title: '课程复习笔记' })

export default function NotesContentPage() {
  return <NotesLibrary notes={notesData} />
}
