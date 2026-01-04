import { promises as fs } from 'fs'
import path from 'path'

export interface GalleryImage {
  src: string
  alt: string
  fileName: string
}

const imageExtensions = new Set(['.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif'])

export async function getGalleryImages(productSlug: string): Promise<GalleryImage[]> {
  const galleryDir = path.join(
    process.cwd(),
    'public',
    'images',
    'products',
    productSlug,
    'gallery'
  )

  try {
    const files = await fs.readdir(galleryDir)

    return files
      .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file, index) => ({
        src: `/images/products/${productSlug}/gallery/${file}`,
        alt: `${productSlug.replace(/-/g, ' ')} gallery image ${index + 1}`,
        fileName: file
      }))
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      return []
    }

    throw error
  }
}
