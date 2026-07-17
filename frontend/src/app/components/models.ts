import { AppMode, Metric, PaymentMethod, PaymentStatus } from "./types";

export interface Trader{
    id:string,
    name:string,
    company:string
}

export interface PaymentRecord {
    status: PaymentStatus;
    paymentMethod?: PaymentMethod;
    amountPaid: number;
    isCredit?: boolean;
}

export interface Order {
    id: string;
    mode: AppMode;
    traderId?: string;
    customerId: string;
    customerName: string;
    shopName: string;
    status: "pending" | "packed" | "delivered";
    items: CartItem[];
    total: number;
    date: string;
    payment:PaymentRecord;
    
}

export interface CartItem {
    product: Product;
    quantity: number;
    price: number;
}

export interface Customer {
    id: string;
    shopName: string;
    customerName: string;
    gst: string;
    address: string;
    mobile: string;
}

export interface Product {
    id: string;
    traderId: string | null;
    company: string;
    name: string;
    sku: string;
    category: string;
    description: string;
    metric: Metric;
    unitsPerBox?: number;
    landingPrice: number;
    mrp: number;
    stock: number;
}

export interface PaymentModalState {
    orderId: string;
    total: number;
    step: "choose" | "paid-method" | "partial-amount" | "credit-done";
    method?: PaymentMethod;
    amountPaid?: string;
}
