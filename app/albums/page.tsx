import AlbumShelf from '@/components/AlbumShelf'
import { albums } from '@/data/albumsData'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'The Albums That Compose Me',
  description: '音乐是以专辑为单位的，在这里记录一些我现在或者曾经甚爱的专辑。',
  alternates: { canonical: '/albums/' },
})

export default function AlbumsPage() {
  return <AlbumShelf albums={albums} />
}
