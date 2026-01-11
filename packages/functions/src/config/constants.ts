export interface CreditCosts {
  yanAvatar: number;
  yanDraw: number;
  yanPhotobooth: number;
}

export const CREDIT_COSTS: CreditCosts = {
  yanAvatar: 1,
  yanDraw: 1,
  yanPhotobooth: 1,
};

export const PRODUCT_IDS = Object.keys(CREDIT_COSTS) as (keyof CreditCosts)[];

export type ProductId = keyof CreditCosts;
