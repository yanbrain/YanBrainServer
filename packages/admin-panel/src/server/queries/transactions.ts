import { transactionsCollection } from '../firebase'
import { Transaction } from '@yanplay/shared'

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
        const snapshot = await transactionsCollection
            .where('userId', '==', userId)
            .limit(50)
            .get()

        const transactions = snapshot.docs.map((doc: any) => {
            const data = doc.data()
            return {
                id: doc.id,
                type: data.type,
                timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : null,
                performedBy: data.performedBy,
                productIds: data.productIds,
                daysGranted: data.daysGranted,
                subscriptionId: data.subscriptionId,
                provider: data.provider,
            }
        }) as Transaction[]

        // Sort in memory instead of in Firestore
        return transactions.sort((a, b) => {
            if (!a.timestamp) return 1
            if (!b.timestamp) return -1
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        })
    } catch (error) {
        console.error('Error fetching transactions:', error)
        return []
    }
}