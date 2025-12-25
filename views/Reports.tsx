
import React, { useState } from 'react';
import { useStore } from '../store';

const Reports: React.FC = () => {
  const { transactions, items, warehouses, sources, couriers, deleteTransaction } = useStore();
  const [filterType, setFilterType] = useState('All');
  const [filterWarehouse, setFilterWarehouse] = useState('All');

  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'All' && t.type !== filterType) return false;
    if (filterWarehouse !== 'All' && t.warehouseId !== filterWarehouse) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Transaction Audit Log</h2>
          <p className="text-sm text-gray-400">History of all stock movements</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2">
          <i className="fa-solid fa-file-pdf"></i>
          <span>Export Table PDF</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-gray-700">Filter Transactions</h4>
          <button onClick={() => { setFilterType('All'); setFilterWarehouse('All'); }} className="text-xs font-bold text-blue-600 hover:underline">Reset All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="space-y-1">
             <label className="text-[10px] font-bold text-gray-400 uppercase">Stock Type</label>
             <select 
               value={filterType} 
               onChange={e => setFilterType(e.target.value)}
               className="w-full p-2 border rounded-lg text-sm bg-gray-50 outline-none"
             >
               <option value="All">All Types</option>
               <option value="IN">Stock IN</option>
               <option value="OUT">Stock OUT</option>
             </select>
           </div>
           <div className="space-y-1">
             <label className="text-[10px] font-bold text-gray-400 uppercase">Warehouse</label>
             <select 
               value={filterWarehouse} 
               onChange={e => setFilterWarehouse(e.target.value)}
               className="w-full p-2 border rounded-lg text-sm bg-gray-50 outline-none"
             >
               <option value="All">All Warehouses</option>
               {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
             </select>
           </div>
        </div>
        <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase">Total: {filteredTransactions.length} transactions</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#fcfdfe] border-b text-gray-400 text-[10px] font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4 text-center">Type</th>
              <th className="px-6 py-4">Item Details</th>
              <th className="px-6 py-4 text-center">Warehouse</th>
              <th className="px-6 py-4 text-center">Qty</th>
              <th className="px-6 py-4 text-right">Cost Price</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {filteredTransactions.map(t => (
              <React.Fragment key={t.id}>
                {t.items.map((it, idx) => {
                  const itemObj = items.find(i => i.id === it.itemId);
                  return (
                    <tr key={`${t.id}-${idx}`} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-700">{t.date}</div>
                        <div className="text-[10px] text-gray-400">Transaction #{t.id.toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-700">{itemObj?.name || 'Unknown'}</div>
                        <div className="text-[10px] text-gray-400 italic">SKU: {itemObj?.sku}</div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-500">
                        {warehouses.find(w => w.id === t.warehouseId)?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-700">{it.quantity}</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-700">৳{it.costPrice.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-2">
                          <button onClick={() => deleteTransaction(t.id)} className="p-1.5 hover:bg-red-50 rounded-md text-red-400"><i className="fa-solid fa-trash-can"></i></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center text-gray-400 italic">No transactions found matching your filters.</div>
        )}
      </div>
    </div>
  );
};

export default Reports;
