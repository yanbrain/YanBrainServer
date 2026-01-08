export const CREDIT_COSTS = {
    yanAvatar: 1,
    yanDraw: 1,
    yanPhotobooth: 1,
} as const;

export const PRODUCTS = [
    { id: 'yanAvatar', name: 'Yan Avatar', creditCost: CREDIT_COSTS.yanAvatar },
    { id: 'yanDraw', name: 'Yan Draw', creditCost: CREDIT_COSTS.yanDraw },
    { id: 'yanPhotobooth', name: 'Yan Photobooth', creditCost: CREDIT_COSTS.yanPhotobooth },
] as const;

export const PRODUCT_IDS = Object.keys(CREDIT_COSTS) as Array<keyof typeof CREDIT_COSTS>;

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
