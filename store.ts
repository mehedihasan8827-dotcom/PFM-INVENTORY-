
import { useState, useEffect, useCallback } from 'react';
import { 
  Item, Category, Warehouse, Source, Courier, Transaction, StockBalance 
} from './types';
import { 
  INITIAL_ITEMS, INITIAL_CATEGORIES, INITIAL_WAREHOUSES, 
  INITIAL_SOURCES, INITIAL_COURIERS 
} from './constants';

const STORAGE_KEY = 'pure_food_mart_db_v1';

interface DB {
  items: Item[];
  categories: Category[];
  warehouses: Warehouse[];
  sources: Source[];
  couriers: Courier[];
  transactions: Transaction[];
}

export const useStore = () => {
  const [db, setDb] = useState<DB>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      items: INITIAL_ITEMS,
      categories: INITIAL_CATEGORIES,
      warehouses: INITIAL_WAREHOUSES,
      sources: INITIAL_SOURCES,
      couriers: INITIAL_COURIERS,
      transactions: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }, [db]);

  const updateDb = (updates: Partial<DB>) => {
    setDb(prev => ({ ...prev, ...updates }));
  };

  const calculateBalances = useCallback((): StockBalance[] => {
    const balances: Record<string, StockBalance> = {};

    // Initialize all items with zero balance
    db.items.forEach(item => {
      balances[item.id] = {
        itemId: item.id,
        inQty: 0,
        outQty: 0,
        damagedQty: 0,
        goodStock: 0,
        avgCost: 0, // We'll update this
        totalValue: 0,
      };
    });

    // Process transactions in chronological order for Weighted Average Cost
    const sortedTransactions = [...db.transactions].sort((a, b) => a.timestamp - b.timestamp);

    sortedTransactions.forEach(tx => {
      tx.items.forEach(txItem => {
        const bal = balances[txItem.itemId];
        if (!bal) return;

        if (tx.type === 'IN') {
          const oldQty = bal.goodStock;
          const oldVal = bal.totalValue;
          const newQty = txItem.quantity;
          const newCost = txItem.costPrice;

          bal.inQty += newQty;
          bal.damagedQty += txItem.damaged;
          bal.goodStock += (newQty - txItem.damaged);
          
          // Weighted Average Cost Logic: (Old Value + New Purchase Value) / New Total Good Stock
          const purchaseVal = newQty * newCost;
          bal.totalValue = oldVal + purchaseVal;
          if (bal.goodStock > 0) {
             bal.avgCost = bal.totalValue / bal.goodStock;
          }
        } else {
          // OUT transaction
          bal.outQty += txItem.quantity;
          const currentAvg = bal.avgCost;
          bal.goodStock -= txItem.quantity;
          
          // Reduce total value proportionally to maintain avg cost
          bal.totalValue = Math.max(0, bal.goodStock * currentAvg);
        }
      });
    });

    return Object.values(balances);
  }, [db.items, db.transactions]);

  return {
    ...db,
    updateDb,
    calculateBalances,
    deleteTransaction: (id: string) => {
      updateDb({ transactions: db.transactions.filter(t => t.id !== id) });
    }
  };
};
