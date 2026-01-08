import { notFound } from 'next/navigation'
import { ProductHero } from '@/components/products/ProductHero'
import { ProductFeatures } from '@/components/products/ProductFeatures'
import { ProductCTA } from '@/components/products/ProductCTA'
import { ProductGallery } from '@/components/products/ProductGallery'
import { Container } from '@/components/ui/Container'
import { BeforeAfterComparison } from '@/components/ui/BeforeAfterComparison'
import { getProductBySlug } from '@/config/products'
import { getGalleryImages } from '@/lib/gallery'

const product = getProductBySlug('yan-photobooth')

export default async function YanPhotoboothPage() {
  if (!product) notFound()

  const galleryImages = await getGalleryImages(product.slug)
  
  return (
    <>
      <Container className="py-20">
        <ProductHero product={product}>
          <BeforeAfterComparison
            productSlug={product.slug}
            aspectRatio="video"
          />
        </ProductHero>
      </Container>

      <Container className="space-y-20 py-20">
        <ProductFeatures product={product} />
      </Container>
      
      <Container className="py-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Gallery</h2>
        <ProductGallery images={galleryImages} />
      </Container>
      
      <Container className="py-20">
        <ProductCTA product={product} />
      </Container>
    </>
  )
}
