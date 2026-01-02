import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A'
    try {
        return format(new Date(dateString), 'MMM d, yyyy')
    } catch {
        return 'Invalid date'
    }
}

export function getDaysUntil(dateString: string | null): number | null {
    if (!dateString) return null
    try {
        return differenceInDays(new Date(dateString), new Date())
    } catch {
        return null
    }
}