import { Mail, Phone, MapPin } from 'lucide-react'
import { SITE_CONFIG } from '@/config/site'

export function ContactInfo() {
  const info = [
    {
      icon: Mail,
      title: 'Email',
      content: SITE_CONFIG.email,
      href: `mailto:${SITE_CONFIG.email}`,
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      content: SITE_CONFIG.whatsapp,
      href: `https://wa.me/${SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`,
      external: true,
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'Dubai, United Arab Emirates',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Contact Information</h2>
        <p className="text-muted-foreground">
          Have a question or want to work together? Reach out to us and we'll respond as soon as possible.
        </p>
      </div>

      <div className="space-y-6">
        {info.map((item) => {
          const Icon = item.icon
          const Content = item.href ? (
            <a
              href={item.href}
              {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.content}
            </a>
          ) : (
            <p className="text-muted-foreground">{item.content}</p>
          )

          return (
            <div key={item.title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Icon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="mb-1 font-medium">{item.title}</h3>
                {Content}
              </div>
            </div>
          )
        })}
      </div>

      <div className="glass-panel p-6">
        <h3 className="mb-2 font-medium">Business Hours</h3>
        <p className="text-sm text-muted-foreground">
          Sunday - Thursday: 9:00 AM - 6:00 PM GST<br />
          Saturday: 10:00 AM - 4:00 PM GST<br />
          Friday: Closed
        </p>
      </div>
    </div>
  )
}
