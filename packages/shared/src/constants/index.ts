export const PRODUCTS = [
    { id: 'yanAvatar', name: 'Yan Avatar' },
    { id: 'yanDraw', name: 'Yan Draw' },
    { id: 'yanPhotobooth', name: 'Yan Photobooth' },
] as const;

export const PRODUCT_IDS = ['yanAvatar', 'yanDraw', 'yanPhotobooth'] as const;

export const TRANSACTION_TYPES: Record<string, string> = {
    SUBSCRIPTION_CREATED: 'Subscription Created',
    SUBSCRIPTION_ACTIVATED: 'Subscription Activated',
    SUBSCRIPTION_RENEWED: 'Subscription Renewed',
    SUBSCRIPTION_CANCELLED: 'Subscription Cancelled',
    SUBSCRIPTION_EXPIRED: 'Subscription Expired',
    SUBSCRIPTION_INITIATED: 'Subscription Initiated',
    MANUAL_GRANT: 'Manual Grant',
    MANUAL_REDUCTION: 'Manual Reduction',
    MANUAL_REVOKE: 'Manual Revoke',
    ACCOUNT_SUSPENDED: 'Account Suspended',
    ACCOUNT_UNSUSPENDED: 'Account Unsuspended',
    USER_CREATED: 'User Created',
    USER_DELETED: 'User Deleted',
    CHARGEBACK: 'Chargeback',
    PAYMENT_FAILED: 'Payment Failed',
};

export const SUBSCRIPTION_DAYS = 30;

export const RATE_LIMIT = {
    MAX: 10,
    WINDOW: 60, // seconds
};

export const CLOUD_FUNCTIONS_URL =
    process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL ||
    'https://us-central1-yanbrainserver.cloudfunctions.net/api';