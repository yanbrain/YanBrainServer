import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(dateInput: any): string {
    if (!dateInput) return 'N/A'

    try {
        let date: Date | null = null

        // Handle different timestamp formats
        if (typeof dateInput === 'object' && dateInput !== null) {
            // Firestore Timestamp with toDate method
            if (typeof dateInput.toDate === 'function') {
                date = dateInput.toDate()
            }
            // Serialized Firestore Timestamp from API (._seconds or .seconds)
            else if (typeof dateInput._seconds === 'number') {
                date = new Date(dateInput._seconds * 1000)
            }
            else if (typeof dateInput.seconds === 'number') {
                date = new Date(dateInput.seconds * 1000)
            }
            // Regular Date object
            else if (dateInput instanceof Date) {
                date = dateInput
            }
        }
        // ISO string or other string format
        else if (typeof dateInput === 'string') {
            date = new Date(dateInput)
        }
        // Unix timestamp in milliseconds
        else if (typeof dateInput === 'number') {
            date = new Date(dateInput)
        }

        if (!date || isNaN(date.getTime())) {
            console.log('Invalid date input:', dateInput)
            return 'Invalid date'
        }

        return format(date, 'MMM d, yyyy')
    } catch (error) {
        console.error('Date formatting error:', error, dateInput)
        return 'Invalid date'
    }
}