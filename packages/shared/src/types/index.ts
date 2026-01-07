export interface User {
    id: string;
    email: string;
    isSuspended: boolean;
    createdAt: string | null;
    creditsBalance?: number;
}

export interface UserCredits {
    balance: number;
    lifetime: number;
    updatedAt: string | null;
}

export interface UsageDailyEntry {
    id: string;
    date: string;
    totals: Record<string, number>;
    totalCredits: number;
}

export interface UsageSummary {
    totalsByProduct: Record<string, number>;
    usageDaily: UsageDailyEntry[];
}

export interface Transaction {
    id: string;
    type: string;
    timestamp: string | null;
    performedBy: string;
    productIds: string[];
    daysGranted: number;
    creditsGranted?: number;
    creditsSpent?: number;
    subscriptionId?: string;
    provider?: string;
}

export interface Subscription {
    id: string;
    userId: string;
    status: string;
    provider: string;
    linkedProducts: string[];
    createdAt: string | null;
}

export interface UserDetails {
    user: User;
    credits: UserCredits | null;
    usage?: UsageSummary;
    transactions: Transaction[];
    subscriptions: Subscription[];
}

export interface ApiResponse<T = any> {
    success: boolean;
    error?: string;
    data?: T;
}
