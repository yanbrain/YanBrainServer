export interface User {
    id: string;
    email: string;
    isSuspended: boolean;
    createdAt: string | null;
    creditsBalance?: number;
}

export interface UserCredits {
    balance: number;
    updatedAt: string | null;
}

export interface UsagePeriodEntry {
    id: string;
    period: string;
    totals: Record<string, number>;
    totalCredits: number;
}

export interface UsageSummary {
    totalsByProduct: Record<string, number>;
    usagePeriods: UsagePeriodEntry[];
}

export interface Transaction {
    id: string;
    type: string;
    timestamp: string | null;
    performedBy: string;
    productIds: string[];
    creditsGranted?: number;
    creditsSpent?: number;
    provider?: string;
}

export interface UserDetails {
    user: User;
    credits: UserCredits | null;
    usage?: UsageSummary;
    transactions: Transaction[];
}

export interface ApiResponse<T = any> {
    success: boolean;
    error?: string;
    data?: T;
}
