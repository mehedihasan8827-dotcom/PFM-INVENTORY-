
export type UnitType = 'kg' | 'pcs' | 'liter' | 'gm';
export type TransactionType = 'IN' | 'OUT';

export interface Category {
  id: string;
  name: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  location: string;
}

export interface Source {
  id: string;
  code: string;
  name: string;
  location: string;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface Item {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  unit: UnitType;
  costPrice: number;
  lowStockLimit: number;
}

export interface TransactionItem {
  itemId: string;
  quantity: number;
  costPrice: number;
  damaged: number;
  note: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  warehouseId: string;
  sourceId?: string;
  courierId?: string;
  items: TransactionItem[];
  timestamp: number;
}

export interface StockBalance {
  itemId: string;
  inQty: number;
  outQty: number;
  damagedQty: number;
  goodStock: number;
  avgCost: number;
  totalValue: number;
}
