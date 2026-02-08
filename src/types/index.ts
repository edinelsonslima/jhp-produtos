export interface Product {
  id: string;
  name: string;
  unit: 'unidade' | 'litro';
  price: number;
}

export interface Sale {
  id: string;
  productName: string;
  quantity: number;
  unit: 'unidade' | 'litro';
  totalPrice: number;
  paymentMethod: 'pix' | 'dinheiro';
  date: string; // ISO string
  timestamp: number;
}

export interface DailyPayment {
  id: string;
  employeeName: string;
  amount: number;
  date: string;
  timestamp: number;
}
