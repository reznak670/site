import { getConcerts, getTracks } from '@/lib/store'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Members from '@/components/Members'
import TracksSection from '@/components/TracksSection'
import Shorts from '@/components/Shorts'
import Clip from '@/components/Clip'
import Concerts from '@/components/Concerts'
import Contacts from '@/components/Contacts'

export const revalidate = 60

export default async function HomePage() {
  const [tracks, concerts] = await Promise.all([getTracks(), getConcerts()])
  const sortedConcerts = concerts.slice().sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <Hero />
      <About />
      <Members />
      <TracksSection tracks={tracks} />
      <Shorts />
      <Clip />
      <Concerts concerts={sortedConcerts} />
      <Contacts />
    </>
  )
}
