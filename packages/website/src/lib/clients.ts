import { promises as fs } from 'fs'
import path from 'path'

export interface Client {
  name: string
  logo: string
}

const imageExtensions = new Set(['.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif'])

export async function getClientLogos(): Promise<Client[]> {
  const clientsDir = path.join(
    process.cwd(),
    'public',
    'images',
    'clients'
  )

  try {
    const files = await fs.readdir(clientsDir)

    return files
      .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => {
        // Extract client name from filename (remove extension and format)
        const nameWithoutExt = path.parse(file).name
        const formattedName = nameWithoutExt
          .replace(/&/g, '& ')
          .replace(/-/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        return {
          name: formattedName,
          logo: `/images/clients/${file}`
        }
      })
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
