export type PaymentMethod = "pix" | "dinheiro" | "combinado";

export interface Product {
  id: string;
  name: string;
  unit: "unidade" | "litro";
  price: number;
}

export interface Sale {
  id: string;
  date: string;
  timestamp: number;
  paymentMethod: PaymentMethod;
  products: {
    productId: string;
    quantity: number;
  }[];
  price: {
    total: number;
    cash: number;
    pix: number;
  };
}

export interface Employee {
  id: string;
  name: string;
  avatarUrl?: string;
  defaultRates: [number, number];
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  timestamp: number;
  receiver?: {
    type: "employee" | "external";
    id: string;
  };
}
