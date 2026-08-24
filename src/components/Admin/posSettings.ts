export type PromoCode = {
  id: string;
  code: string;
  discountPercent: string;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  showInPos: boolean;
};
