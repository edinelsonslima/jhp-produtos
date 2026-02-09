export type PaymentMethod = "pix" | "dinheiro" | "misto";

export interface Product {
  id: string;
  name: string;
  unit: "unidade" | "litro";
  price: number;
}

export interface SaleProduct extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  date: string;
  timestamp: number;
  products: SaleProduct[];
  price: {
    total: number;
    cash: number;
    pix: number;
  };
  paymentMethod: PaymentMethod;
}

export interface DailyPayment {
  id: string;
  employeeName: string;
  amount: number;
  date: string;
  timestamp: number;
}
