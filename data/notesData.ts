export type NoteItem = {
  title: string
  subject: string
  tags: string[]
  description: string
  updatedAt: string
  pdf?: string
  outline?: string[]
}

export const notesData: NoteItem[] = []
