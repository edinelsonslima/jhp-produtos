import { useState, useEffect, useCallback } from 'react';
import { Sale, DailyPayment, Product } from '@/types';

const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', name: 'Metazil', unit: 'litro', price: 15 },
  { id: '2', name: 'Solupam', unit: 'litro', price: 18 },
  { id: '3', name: 'Desinfetante Industrial', unit: 'litro', price: 12 },
  { id: '4', name: 'Detergente Pesado', unit: 'unidade', price: 25 },
  { id: '5', name: 'Limpa Alumínio', unit: 'litro', price: 20 },
  { id: '6', name: 'Desincrustante', unit: 'litro', price: 22 },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useStore() {
  const [sales, setSales] = useState<Sale[]>(() => loadFromStorage('sales', []));
  const [dailyPayments, setDailyPayments] = useState<DailyPayment[]>(() => loadFromStorage('dailyPayments', []));
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('products', DEFAULT_PRODUCTS));

  useEffect(() => saveToStorage('sales', sales), [sales]);
  useEffect(() => saveToStorage('dailyPayments', dailyPayments), [dailyPayments]);
  useEffect(() => saveToStorage('products', products), [products]);

  const addSale = useCallback((sale: Omit<Sale, 'id' | 'timestamp'>) => {
    setSales(prev => [{
      ...sale,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }, ...prev]);
  }, []);

  const deleteSale = useCallback((id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  }, []);

  const addDailyPayment = useCallback((payment: Omit<DailyPayment, 'id' | 'timestamp'>) => {
    setDailyPayments(prev => [{
      ...payment,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }, ...prev]);
  }, []);

  const deleteDailyPayment = useCallback((id: string) => {
    setDailyPayments(prev => prev.filter(p => p.id !== id));
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: crypto.randomUUID() }]);
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const todaySales = sales.filter(s => s.date === todayStr);
  const todayTotal = todaySales.reduce((sum, s) => sum + s.totalPrice, 0);
  const todayPix = todaySales.filter(s => s.paymentMethod === 'pix').reduce((sum, s) => sum + s.totalPrice, 0);
  const todayCash = todaySales.filter(s => s.paymentMethod === 'dinheiro').reduce((sum, s) => sum + s.totalPrice, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthSales = sales.filter(s => s.date.startsWith(currentMonth));
  const monthTotal = monthSales.reduce((sum, s) => sum + s.totalPrice, 0);
  const monthPix = monthSales.filter(s => s.paymentMethod === 'pix').reduce((sum, s) => sum + s.totalPrice, 0);
  const monthCash = monthSales.filter(s => s.paymentMethod === 'dinheiro').reduce((sum, s) => sum + s.totalPrice, 0);

  const todayPayments = dailyPayments.filter(p => p.date === todayStr);
  const todayPaymentsTotal = todayPayments.reduce((sum, p) => sum + p.amount, 0);

  return {
    sales, todaySales, monthSales,
    todayTotal, todayPix, todayCash,
    monthTotal, monthPix, monthCash,
    todayPayments, todayPaymentsTotal,
    dailyPayments,
    products,
    addSale, deleteSale,
    addDailyPayment, deleteDailyPayment,
    addProduct, deleteProduct,
  };
}
