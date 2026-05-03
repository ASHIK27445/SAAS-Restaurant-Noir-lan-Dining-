import type { LucideIcon } from "lucide-react";

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
    icon: string;
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
export type PaymentType = 'cash' | 'card' | 'bkash' | 'nagad'
export const paymentMethods: {
  id: PaymentType;
  label: string;
  icon: string;
  custom?: boolean;
}[] = [
  { id: 'cash', label: 'CASH', icon: 'payments' },
  { id: 'card', label: 'CARD', icon: 'credit_card' },
  { id: 'bkash', label: 'bKash', icon: 'bK', custom: true },
  { id: 'nagad', label: 'Nagad', icon: 'N', custom: true },
]


