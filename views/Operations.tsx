
import React, { useState } from 'react';
import { useStore } from '../store';
import { TransactionType, TransactionItem, Transaction } from '../types';

const Operations: React.FC = () => {
  const { items, warehouses, sources, couriers, transactions, updateDb } = useStore();
  const [type, setType] = useState<TransactionType>('IN');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('');
  const [rows, setRows] = useState<TransactionItem[]>([
    { itemId: '', quantity: 0, costPrice: 0, damaged: 0, note: '' }
  ]);

  const addRow = () => {
    setRows([...rows, { itemId: '', quantity: 0, costPrice: 0, damaged: 0, note: '' }]);
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof TransactionItem, value: any) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    
    // Auto-fill cost price if item is selected
    if (field === 'itemId') {
      const selectedItem = items.find(i => i.id === value);
      if (selectedItem) {
        newRows[index].costPrice = selectedItem.costPrice;
      }
    }
    
    setRows(newRows);
  };

  const handleSave = () => {
    if (!selectedWarehouse) {
      alert('Please select a warehouse');
      return;
    }

    const validRows = rows.filter(r => r.itemId && r.quantity > 0);
    if (validRows.length === 0) {
      alert('Please add at least one valid product');
      return;
    }

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date,
      type,
      warehouseId: selectedWarehouse,
      sourceId: selectedSource || undefined,
      courierId: selectedCourier || undefined,
      items: validRows,
      timestamp: new Date(date).getTime(),
    };

    updateDb({ transactions: [newTransaction, ...transactions] });
    
    // Reset form
    setRows([{ itemId: '', quantity: 0, costPrice: 0, damaged: 0, note: '' }]);
    alert('Stock movement recorded successfully!');
  };

  const totalQty = rows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
  const totalVal = rows.reduce((sum, r) => sum + (Number(r.quantity) * Number(r.costPrice) || 0), 0);
  const totalDmg = rows.reduce((sum, r) => sum + (Number(r.damaged) || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Toggle Switch */}
        <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm inline-flex w-full overflow-hidden">
          <button 
            onClick={() => setType('IN')}
            className={`flex-1 py-3 px-6 rounded-lg font-bold text-sm transition-all flex items-center justify-center space-x-2 ${type === 'IN' ? 'bg-amber-400 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <i className="fa-solid fa-circle-plus"></i>
            <span>Stock IN</span>
          </button>
          <button 
            onClick={() => setType('OUT')}
            className={`flex-1 py-3 px-6 rounded-lg font-bold text-sm transition-all flex items-center justify-center space-x-2 ${type === 'OUT' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <i className="fa-solid fa-circle-minus"></i>
            <span>Stock OUT</span>
          </button>
        </div>

        {/* Form Fields */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none border-gray-200 transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase">Warehouse</label>
              <select 
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none border-gray-200 transition-all text-sm"
              >
                <option value="">Select Warehouse</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase">Source (Optional)</label>
              <select 
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none border-gray-200 transition-all text-sm"
              >
                <option value="">No Source</option>
                {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase">Courier (Optional)</label>
              <select 
                value={selectedCourier}
                onChange={(e) => setSelectedCourier(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none border-gray-200 transition-all text-sm"
              >
                <option value="">No Courier</option>
                {couriers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-800">Products</h4>
              <button 
                onClick={addRow}
                className="text-xs font-bold text-white bg-gray-800 px-3 py-1.5 rounded-lg flex items-center space-x-1 hover:bg-black transition-colors"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Add Product</span>
              </button>
            </div>

            {rows.map((row, index) => (
              <div key={index} className="relative bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Product #{index + 1}</span>
                  <div className="flex space-x-2">
                     <button className="px-3 py-1 bg-gray-800 text-white rounded text-[10px] flex items-center space-x-1">
                        <i className="fa-solid fa-expand"></i>
                        <span>Scan</span>
                     </button>
                     {rows.length > 1 && (
                       <button onClick={() => removeRow(index)} className="text-red-500 hover:text-red-700">
                          <i className="fa-solid fa-trash-can"></i>
                       </button>
                     )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Item Name / SKU</label>
                    <select 
                      value={row.itemId}
                      onChange={(e) => updateRow(index, 'itemId', e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white outline-none text-sm"
                    >
                      <option value="">Select Item</option>
                      {items.map(i => <option key={i.id} value={i.id}>{i.name} ({i.sku})</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Quantity</label>
                    <input 
                      type="number" 
                      value={row.quantity}
                      onChange={(e) => updateRow(index, 'quantity', Number(e.target.value))}
                      className="w-full p-2 border rounded-lg bg-white outline-none text-sm text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Cost Price</label>
                    <input 
                      type="number" 
                      value={row.costPrice}
                      onChange={(e) => updateRow(index, 'costPrice', Number(e.target.value))}
                      className="w-full p-2 border rounded-lg bg-white outline-none text-sm text-center"
                    />
                  </div>
                </div>

                {type === 'IN' && (
                   <div className="grid grid-cols-2 gap-4 pt-2">
                     <div className="space-y-1">
                        <label className="text-[10px] font-bold text-green-600 uppercase">Damaged Return</label>
                        <input 
                          type="number" 
                          value={row.damaged}
                          onChange={(e) => updateRow(index, 'damaged', Number(e.target.value))}
                          className="w-full p-2 border border-green-200 rounded-lg bg-white outline-none text-sm text-center"
                        />
                        <p className="text-[9px] text-green-500 font-medium">* Return damaged items to regular stock.</p>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Note / Reference</label>
                        <input 
                          type="text" 
                          placeholder="PO Num"
                          value={row.note}
                          onChange={(e) => updateRow(index, 'note', e.target.value)}
                          className="w-full p-2 border rounded-lg bg-white outline-none text-sm"
                        />
                     </div>
                   </div>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={handleSave}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-95 ${type === 'IN' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}
          >
            <i className={`fa-solid ${type === 'IN' ? 'fa-file-invoice' : 'fa-file-export'}`}></i>
            <span>Record Stock {type}</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-800 border-b pb-4">Summary</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Type</span>
              <span className={`font-bold ${type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>{type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Warehouse</span>
              <span className="font-bold text-gray-700">{warehouses.find(w => w.id === selectedWarehouse)?.name || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Courier</span>
              <span className="font-bold text-gray-700">{couriers.find(c => c.id === selectedCourier)?.name || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Source</span>
              <span className="font-bold text-gray-700">{sources.find(s => s.id === selectedSource)?.name || '-'}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between">
              <span className="text-gray-400">Products Added</span>
              <span className="font-bold text-gray-700">{rows.filter(r => r.itemId).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Quantity</span>
              <span className="font-bold text-gray-700">{totalQty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Damaged Return</span>
              <span className="font-bold text-green-600">{totalDmg}</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-gray-400 font-medium">Est. Value</span>
              <span className="text-lg font-bold text-gray-900">৳{totalVal.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
             <h5 className="text-[10px] font-bold text-blue-600 uppercase mb-2">Line Items Overview</h5>
             <div className="space-y-1">
                {rows.map((row, i) => {
                  const item = items.find(it => it.id === row.itemId);
                  if (!item) return null;
                  return (
                    <div key={i} className="flex justify-between text-xs font-medium text-blue-800">
                       <span>{item.name}</span>
                       <span>x{row.quantity}</span>
                    </div>
                  )
                })}
                {rows.every(r => !r.itemId) && <span className="text-xs text-blue-400 italic">Select product</span>}
             </div>
          </div>
          
          <p className="text-[10px] text-gray-400 italic text-center">
            Tip: Use the scanner button on each product row to fill items faster.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Operations;
