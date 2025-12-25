
import React from 'react';
import { useStore } from '../store';

const InventoryBalance: React.FC = () => {
  const { items, categories, calculateBalances } = useStore();
  const balances = calculateBalances();

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <select className="text-xs font-semibold p-2 border rounded-lg bg-gray-50 outline-none">
              <option>All Warehouses</option>
            </select>
            <select className="text-xs font-semibold p-2 border rounded-lg bg-gray-50 outline-none">
              <option>All Categories</option>
            </select>
            <select className="text-xs font-semibold p-2 border rounded-lg bg-gray-50 outline-none">
              <option>Stock Type</option>
            </select>
            <div className="relative">
               <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
               <input type="text" placeholder="Search items..." className="text-xs p-2 pl-8 border rounded-lg bg-gray-50 outline-none w-64" />
            </div>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2">
            <i className="fa-solid fa-file-export"></i>
            <span>Export</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#fcfdfe] border-b text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4 text-center">In</th>
                <th className="px-6 py-4 text-center">Out</th>
                <th className="px-6 py-4 text-center">DMG</th>
                <th className="px-6 py-4 text-center text-green-600">Good Stock</th>
                <th className="px-6 py-4 text-right">Avg Cost</th>
                <th className="px-6 py-4 text-right">Total Value</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {balances.map((bal, idx) => {
                const item = items.find(i => i.id === bal.itemId);
                if (!item) return null;
                return (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-700">{item.name}</div>
                      <div className="text-[10px] text-gray-400 font-medium">
                        {item.sku} • {getCategoryName(item.categoryId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-600">{bal.inQty}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-600">{bal.outQty}</td>
                    <td className="px-6 py-4 text-center font-medium text-red-400">{bal.damagedQty > 0 ? bal.damagedQty : '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded font-bold ${bal.goodStock <= item.lowStockLimit ? 'text-red-600 bg-red-50' : 'text-green-600'}`}>
                        {bal.goodStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-600">৳{bal.avgCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-800">৳{bal.totalValue.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-blue-600"><i className="fa-solid fa-pen-to-square"></i></button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-red-600"><i className="fa-solid fa-trash-can"></i></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-emerald-50 border-t border-emerald-100 flex justify-between items-center text-[10px] font-bold">
           <span className="text-emerald-700 uppercase tracking-widest">Valuation Method: Weighted Average Cost</span>
           <div className="text-emerald-800 text-sm uppercase">
             Total Inventory Value: <span className="text-lg ml-2">৳{balances.reduce((s, b) => s + b.totalValue, 0).toLocaleString()}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryBalance;
