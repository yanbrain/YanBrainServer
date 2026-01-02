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
        title: 'Professional Avatar Customization',
        description: 'We design a unique 3D avatar that represents your brand identity and connects with your customers.',
      },
      {
        icon: 'FileText',
        title: 'Knowledge Base Integration',
        description: 'Upload PDFs, images, DOCX files, and more. Your avatar creates embeddings from your documents and answers questions with accurate, context-aware responses.',
      },
      {
        icon: 'Rocket',
        title: 'Deploy Anywhere',
        description: 'Perfect for customer support, sales assistance, and interactive product demonstrations.',
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
        title: 'Intuitive Canvas',
        description: 'Draw freely with professional brush tools. Your creativity leads, AI enhances.',
      },
      {
        icon: 'Wand2',
        title: 'Instant Transformation',
        description: 'Watch your rough sketches transform into polished, professional artwork in real-time.',
      },
      {
        icon: 'Palette',
        title: 'Endless Possibilities',
        description: 'From concept art to finished illustrations. Perfect for designers, artists, and creative professionals.',
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
        description: 'Simple, intuitive photo capture directly from any webcam. No complicated setup required.',
      },
      {
        icon: 'Image',
        title: 'Artistic AI Generation',
        description: 'Advanced AI converts your photos into stunning artistic styles. From professional portraits to creative interpretations.',
      },
      {
        icon: 'Share2',
        title: 'Perfect for Any Occasion',
        description: 'Weddings, corporate events, parties, and marketing activations. Create shareable AI art instantly.',
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
