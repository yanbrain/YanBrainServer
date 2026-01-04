import { Hero } from '@/components/home/Hero'
import { OurClientsScroll } from '@/components/home/OurClientsScroll'
import { ProductsGrid } from '@/components/home/ProductsGrid'
import { Container } from '@/components/ui/container'

export default function HomePage() {
  return (
    <>
      <div className="overflow-hidden pt-10 sm:pt-14">
        <Container><Hero /></Container>
      </div>
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: 'Designed for dark environments',
                description: 'Optimized contrast and typography keep every display clear on stage, in stores, or at live events.'
              },
              {
                title: 'Responsive by default',
                description: 'Layouts scale beautifully from mobile kiosks to 8K LED walls with consistent performance.'
              },
              {
                title: 'Built for momentum',
                description: 'Launch campaigns faster with modular products, shared analytics, and centralized control.'
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <OurClientsScroll />
      <Container className="py-20" id="products"><ProductsGrid /></Container>
    </>
  )
}
