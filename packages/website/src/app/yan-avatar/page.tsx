import { notFound } from 'next/navigation'
import { ProductHero } from '@/components/products/ProductHero'
import { ProductFeatures } from '@/components/products/ProductFeatures'
import { ProductCTA } from '@/components/products/ProductCTA'
import { ProductGallery } from '@/components/products/ProductGallery'
import { Container } from '@/components/ui/Container'
import { GlowingCard } from '@/components/ui/GlowingCard'
import { getProductBySlug } from '@/config/products'
import { getGalleryImages } from '@/lib/gallery'
import Image from 'next/image'

const product = getProductBySlug('yan-avatar')

export default async function YanAvatarPage() {
  if (!product) notFound()

  const galleryImages = await getGalleryImages(product.slug)
  
  return (
    <>
      <Container className="py-20">
        <ProductHero product={product} isPortrait>
          <GlowingCard
            primaryColor={product.colors.primary}
            secondaryColor={product.colors.secondary || 'hsl(25, 95%, 53%)'}
            isPortrait
          >
            <Image
              src="/images/products/yan-avatar/hero/yan-avatar_product-hero.webp"
              alt="Yan Avatar Product Preview"
              fill
              className="object-cover"
            />
          </GlowingCard>
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
