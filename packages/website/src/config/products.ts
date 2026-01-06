export const PRODUCTS = [
  {
    id: 'yan-avatar',
    name: 'Yan Avatar',
    slug: 'yan-avatar',
    tagline: 'Your Intelligent Business Assistant',
    description: 'Create custom AI avatars that understand your business',
    heroDescription: 'Create custom AI avatars that understand your business. Upload documents, PDFs, images, and let your avatar answer customer questions with deep knowledge of your products and services.',
    colors: { primary: '#DC2678', secondary: '#78DC26' },
    features: [
      {
        icon: 'Sparkles',
        title: 'Knowledge Base Integration',
        description: 'Upload documents, images, spreadsheets, and more. Your avatar instantly understands your entire knowledge base and responds with precise, context-aware answers.',
      },
      {
        icon: 'FileText',
        title: 'Multilingual Support',
        description: 'One avatar. Many languages. Seamless communication.',
      },
      {
        icon: 'Rocket',
        title: 'Customise',
        description: 'Create avatars that look, feel, and speak like your brand.',
      },
    ],
    cta: {
      title: 'Ready to transform customer engagement?',
      description: 'Deploy your intelligent avatar assistant today.',
      buttonText: 'Download for Windows',
    },
  },
  {
    id: 'yan-draw',
    name: 'Yan Draw',
    slug: 'yan-draw',
    tagline: 'From Sketch to Masterpiece',
    description: 'Transform your sketches into professional artwork with AI',
    heroDescription: 'Draw anything on screen and watch AI transform your sketch into a professional masterpiece. The future of digital art creation.',
    colors: { primary: '#2678DC', secondary: '#DCA626' },
    features: [
      {
        icon: 'Paintbrush',
        title: 'Simple Canvas',
        description: 'Draw freely with intuitive, easy-to-use tools.',
      },
      {
        icon: 'Wand2',
        title: 'Styles',
        description: 'Choose from a range of preset styles or create your own.',
      },
      {
        icon: 'Palette',
        title: 'Deliver',
        description: 'Print or email your creation instantly.',
      },
    ],
    cta: {
      title: 'Start creating today',
      description: 'Transform your sketches into professional artwork with AI.',
      buttonText: 'Download for Windows',
    },
  },
  {
    id: 'yan-photobooth',
    name: 'Yan Photobooth',
    slug: 'yan-photobooth',
    tagline: 'AI-Powered Photo Transformation',
    description: 'Transform photos into stunning AI-generated art',
    heroDescription: 'Take a photo on your webcam and watch it transform into stunning AI-generated art. Perfect for events, marketing, and memorable experiences.',
    colors: { primary: '#7826DC', secondary: '#26DC78' },
    features: [
      {
        icon: 'Camera',
        title: 'Webcam Photo Capture',
        description: 'Simple, intuitive photo capture directly from any webcam or DSLR.',
      },
      {
        icon: 'Image',
        title: 'Styles',
        description: 'Choose from a range of preset styles or create your own.',
      },
      {
        icon: 'Share2',
        title: 'Deliver',
        description: 'Print or email your creation instantly.',
      },
    ],
    cta: {
      title: 'Make your next event unforgettable',
      description: 'Create stunning AI-generated photos that guests will love.',
      buttonText: 'Download for Windows',
    },
  },
]

export const getProductBySlug = (slug: string) => PRODUCTS.find(p => p.slug === slug)
