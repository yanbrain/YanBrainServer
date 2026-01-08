export interface Product {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  heroDescription: string
  colors: {
    primary: string
    secondary: string
  }
  features: Feature[]
  cta: CTA
}

export interface Feature {
  icon: string
  title: string
  description: string
}

export interface CTA {
  title: string
  description: string
  buttonText: string
}
