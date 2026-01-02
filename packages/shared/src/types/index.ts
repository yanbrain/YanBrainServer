export interface User {
    id: string;
    email: string;
    isSuspended: boolean;
    createdAt: string | null;
    hasActiveLicense?: boolean;
}

export interface License {
    isActive: boolean;
    activatedAt: string | null;
    expiryDate: string | null;
    revokedAt?: string | null;
}

export interface UserLicenses {
    [productId: string]: License;
}

export interface Transaction {
    id: string;
    type: string;
    timestamp: string | null;
    performedBy: string;
    productIds: string[];
    daysGranted: number;
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
    licenses: UserLicenses | null;
    transactions: Transaction[];
    subscriptions: Subscription[];
}

export interface ApiResponse<T = any> {
    success: boolean;
    error?: string;
    data?: T;
}