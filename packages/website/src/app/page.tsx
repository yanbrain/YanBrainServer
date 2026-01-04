import { Hero } from '@/components/home/Hero'
import { OurClientsScroll } from '@/components/home/OurClientsScroll'
import { ProductsGrid } from '@/components/home/ProductsGrid'
import { Container } from '@/components/ui/container'
import { getClientLogos } from '@/lib/clients'

export default async function HomePage() {
  const clients = await getClientLogos()

  return (
    <>
      <div className="overflow-hidden">
        <Container><Hero /></Container>
      </div>
      <OurClientsScroll clients={clients} />
      <Container className="py-20"><ProductsGrid /></Container>
    </>
  )
}
