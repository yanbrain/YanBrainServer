import { notFound } from 'next/navigation'
import { ProductHero } from '@/components/products/ProductHero'
import { ProductFeatures } from '@/components/products/ProductFeatures'
import { ProductCTA } from '@/components/products/ProductCTA'
import { ProductGallery } from '@/components/products/ProductGallery'
import { Container } from '@/components/ui/container'
import { getProductBySlug } from '@/config/products'

const product = getProductBySlug('yan-avatar')

export default function YanAvatarPage() {
  if (!product) notFound()
  
  return (
    <>
      <Container className="py-20">
        <ProductHero product={product} isPortrait />
      </Container>

      <Container className="space-y-20 py-20">
        <ProductFeatures product={product} />
      </Container>
      
      <Container className="py-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Gallery</h2>
        <ProductGallery productSlug={product.slug} imageCount={5} isPortrait />
      </Container>
      
      <Container className="py-20">
        <ProductCTA product={product} />
      </Container>
    </>
  )
}
