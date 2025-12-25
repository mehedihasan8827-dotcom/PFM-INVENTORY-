
import { Category, Warehouse, Item, Source, Courier } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'আখের গুড়' },
  { id: '2', name: 'খেজুর গুড়' },
  { id: '3', name: 'গাওয়া ঘি' },
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  { id: '1', code: 'WH-001', name: 'Dhaka Main Warehouse', location: 'Mirpur, Dhaka' },
  { id: '2', code: 'WH-002', name: 'Baneswar Rajshahi Warehouse', location: 'Rajshahi' },
];

export const INITIAL_SOURCES: Source[] = [
  { id: '1', code: 'SRC-001', name: 'Maruf Supplier', location: 'Dhaka' },
  { id: '2', code: 'SRC-002', name: 'Rana Traders', location: 'Rajshahi' },
];

export const INITIAL_COURIERS: Courier[] = [
  { id: '1', name: 'Steadfast', phone: '01700000000', address: 'Baneswar' },
  { id: '2', name: 'Pathao', phone: '01600000000', address: 'Dhaka' },
];

export const INITIAL_ITEMS: Item[] = [
  { id: '1', sku: 'AKHER-DANA-GUR', name: 'আখের দানাদার গুড়', categoryId: '1', unit: 'kg', costPrice: 180, lowStockLimit: 10 },
  { id: '2', sku: 'KHEJUR-PATALI-GUR', name: 'খেজুর গুড় পাটালি', categoryId: '2', unit: 'kg', costPrice: 250, lowStockLimit: 5 },
];
