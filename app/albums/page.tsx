import AlbumShelf from '@/components/AlbumShelf'
import { albums } from '@/data/albumsData'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: '专辑',
  description: '一些喜欢的专辑，一些反复回来的时刻。我的私人唱片架。',
  alternates: { canonical: '/albums/' },
})

export default function AlbumsPage() {
  return <AlbumShelf albums={albums} />
}
