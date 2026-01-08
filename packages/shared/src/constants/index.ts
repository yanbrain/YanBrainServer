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
    CREDITS_GRANTED: 'Credits Granted',
    CREDITS_DEDUCTED: 'Credits Deducted',
    CREDITS_SPENT: 'Credits Spent',
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

export const RATE_LIMIT = {
    MAX: 10,
    WINDOW: 60, // seconds
};

export const CLOUD_FUNCTIONS_URL =
    process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL ||
    'https://us-central1-yanbrainserver.cloudfunctions.net/api';
