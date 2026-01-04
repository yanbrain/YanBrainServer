import { notFound } from 'next/navigation'
import { ProductHero } from '@/components/products/ProductHero'
import { ProductFeatures } from '@/components/products/ProductFeatures'
import { ProductCTA } from '@/components/products/ProductCTA'
import { VerticalGallery } from '@/components/products/VerticalGallery'
import { Container } from '@/components/ui/Container'
import { getProductBySlug } from '@/config/products'
import { getGalleryImages } from '@/lib/gallery'

const product = getProductBySlug('yan-avatar')

export default async function YanAvatarPage() {
  if (!product) notFound()

  const galleryImages = await getGalleryImages(product.slug)
  
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
        <VerticalGallery images={galleryImages} />
      </Container>
      
      <Container className="py-20">
        <ProductCTA product={product} />
      </Container>
    </>
  )
}
