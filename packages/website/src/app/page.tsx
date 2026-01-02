import { Hero } from '@/components/home/Hero'
import { OurClientsScroll } from '@/components/home/OurClientsScroll'
import { ProductsGrid } from '@/components/home/ProductsGrid'
import { Container } from '@/components/ui/container'

export default function HomePage() {
  return (
    <>
      <div className="overflow-hidden">
        <Container><Hero /></Container>
      </div>
      <OurClientsScroll />
      <Container className="py-20"><ProductsGrid /></Container>
    </>
  )
}
