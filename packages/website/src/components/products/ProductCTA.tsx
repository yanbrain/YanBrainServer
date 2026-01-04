import { Button } from '@/components/ui/Button'
import { Product } from '@/types'

export function ProductCTA({ product }: { product: Product }) {
  return (
    <section className="border-t border-border text-center">
      <div className="py-16">
        <h2 className="mb-4 text-3xl font-bold">{product.cta.title}</h2>
        <p className="mb-8 text-base text-muted-foreground">
          {product.cta.description}
        </p>
        <Button 
          size="lg" 
          style={{ backgroundColor: product.colors.primary }} 
          className="text-white hover:opacity-90"
        >
          {product.cta.buttonText}
        </Button>
      </div>
    </section>
  )
}
