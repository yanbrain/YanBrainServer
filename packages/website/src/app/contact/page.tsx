import { Container } from '@/components/ui/Container'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactInfo } from '@/components/contact/ContactInfo'

export default function ContactPage() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have questions about our products? We'd love to hear from you.
          </p>
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </Container>
  )
}
