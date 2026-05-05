import { Banknote, CreditCard, type LucideIcon } from "lucide-react";

export type MenuItem = {
    img: string;
    name: string;
    price: string;
    desc: string
}

export type NavLinksProps = {
    icon: LucideIcon;
    label: string;
    to?: string;
}

export type CategoryButtonProps = {
    icon: LucideIcon;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

export type FoodCardProps = {
    img: string;
    name: string;
    price: string;
    desc: string;
    onClick?: () => void;
}

export type ReceiptItemProps = {
  name: string;
  note?: string;
  qty: number;
  price: string;
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    note?: string
}

export type OrderType = 'dine-in' | 'takeaway' | 'delivery'
export type PaymentType = 'cash' | 'card' | 'bkash' | 'rocket'
export const paymentMethods: {
  id: PaymentType;
  label: string;
  icon: LucideIcon | string ;
  custom?: boolean;
}[] = [
  { id: 'cash', label: 'CASH', icon: Banknote },
  { id: 'card', label: 'CARD', icon: CreditCard },
  { id: 'bkash', label: 'bKash', icon: 'https://play-lh.googleusercontent.com/1CRcUfmtwvWxT2g-xJF8s9_btha42TLi6Lo-qVkVomXBb_citzakZX9BbeY51iholWs', custom: true },
  { id: 'rocket', label: 'Rocket', icon: 'https://iconape.com/wp-content/png_logo_vector/dutch-bangla-rocket-logo.png', custom: true },
]


