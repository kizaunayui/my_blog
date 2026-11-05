export type Album = {
  id: string
  title: string
  artist: string
  cover: string
  coverPosition?: string
  accent: string
  year?: string
  note?: string
  url?: string
  demo?: boolean
}

// Temporary artwork from the blog's existing image library.
// Replace these entries with the real albums; the shelf supports any collection size.
export const albums: Album[] = [
  {
    id: 'blue-hour',
    title: 'Blue Hour',
    artist: '临时封面 01',
    cover: '/static/images/taeyeon_gravity.webp',
    coverPosition: '72% center',
    accent: '#6576bf',
    note: '把时间留给喜欢的声音。',
    demo: true,
  },
  {
    id: 'underwater',
    title: 'Underwater',
    artist: '临时封面 02',
    cover: '/static/images/anmi_aquarium.webp',
    coverPosition: '50% center',
    accent: '#6babb9',
    note: '有些旋律，值得一遍遍回来。',
    demo: true,
  },
]
