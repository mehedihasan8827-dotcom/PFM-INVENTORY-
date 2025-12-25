
import React, { useState } from 'react';
import { useStore } from '../store';
import { Item, Category, Warehouse, Source, Courier } from '../types';

interface ManagementProps {
  type: 'items' | 'warehouses' | 'sources' | 'categories' | 'couriers';
}

const Management: React.FC<ManagementProps> = ({ type }) => {
  const store = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const getTitle = () => {
    switch(type) {
      case 'items': return 'Items';
      case 'warehouses': return 'Warehouses';
      case 'sources': return 'Sources';
      case 'categories': return 'Categories';
      case 'couriers': return 'Couriers';
      default: return '';
    }
  };

  const getSubtitle = () => {
    switch(type) {
      case 'items': return 'Add and manage your product inventory.';
      case 'warehouses': return 'Configure your storage locations.';
      case 'sources': return 'Configure your purchase / supply sources.';
      case 'categories': return 'Organize your inventory into categories.';
      case 'couriers': return 'Manage delivery partners used in sales and stock entries.';
      default: return '';
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this?')) {
      const list = (store as any)[type] as any[];
      store.updateDb({ [type]: list.filter(i => i.id !== id) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{getTitle()}</h2>
          <p className="text-sm text-gray-400">{getSubtitle()}</p>
        </div>
        <button 
          onClick={() => { setEditItem(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-md hover:bg-blue-700 transition-colors"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Add New {type.slice(0, -1)}</span>
        </button>
      </div>

      {type === 'items' && <ItemsList items={store.items} categories={store.categories} onEdit={(item) => { setEditItem(item); setShowModal(true); }} onDelete={handleDelete} />}
      {type === 'warehouses' && <WarehouseGrid warehouses={store.warehouses} onEdit={(item) => { setEditItem(item); setShowModal(true); }} onDelete={handleDelete} />}
      {type === 'sources' && <SourceGrid sources={store.sources} onEdit={(item) => { setEditItem(item); setShowModal(true); }} onDelete={handleDelete} />}
      {type === 'categories' && <CategoryList categories={store.categories} onEdit={(item) => { setEditItem(item); setShowModal(true); }} onDelete={handleDelete} />}
      {type === 'couriers' && <CourierGrid couriers={store.couriers} onEdit={(item) => { setEditItem(item); setShowModal(true); }} onDelete={handleDelete} />}

      {showModal && (
        <ManagementModal 
          type={type} 
          editItem={editItem} 
          onClose={() => setShowModal(false)} 
          store={store}
        />
      )}
    </div>
  );
};

// --- Sub-components ---

const ItemsList: React.FC<{ items: Item[], categories: Category[], onEdit: (i: Item) => void, onDelete: (id: string) => void }> = ({ items, categories, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-[#fcfdfe] border-b text-gray-400 text-[10px] font-bold uppercase tracking-wider">
        <tr>
          <th className="px-6 py-4">Item Name</th>
          <th className="px-6 py-4">SKU</th>
          <th className="px-6 py-4 text-center">Category</th>
          <th className="px-6 py-4 text-center">Unit</th>
          <th className="px-6 py-4 text-right">Cost Price</th>
          <th className="px-6 py-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 text-sm">
        {items.map(item => (
          <tr key={item.id} className="hover:bg-gray-50/50">
            <td className="px-6 py-4">
               <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <i className="fa-solid fa-cube"></i>
                  </div>
                  <span className="font-bold text-gray-700">{item.name}</span>
               </div>
            </td>
            <td className="px-6 py-4 font-medium text-gray-500">{item.sku}</td>
            <td className="px-6 py-4 text-center">
              <span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-gray-600">
                {categories.find(c => c.id === item.categoryId)?.name}
              </span>
            </td>
            <td className="px-6 py-4 text-center font-medium text-gray-500">{item.unit}</td>
            <td className="px-6 py-4 text-right font-bold text-gray-700">৳{item.costPrice.toLocaleString()}</td>
            <td className="px-6 py-4">
              <div className="flex justify-center space-x-2">
                <button onClick={() => onEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-blue-600"><i className="fa-solid fa-pen-to-square"></i></button>
                <button onClick={() => onDelete(item.id)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-red-600"><i className="fa-solid fa-trash-can"></i></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const WarehouseGrid: React.FC<{ warehouses: Warehouse[], onEdit: (i: Warehouse) => void, onDelete: (id: string) => void }> = ({ warehouses, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {warehouses.map(w => (
      <div key={w.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
        <div className="flex items-start justify-between">
           <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
              <i className="fa-solid fa-warehouse text-xl"></i>
           </div>
           <div className="flex space-x-2">
              <button onClick={() => onEdit(w)} className="text-gray-400 hover:text-blue-600"><i className="fa-solid fa-pen-to-square"></i></button>
              <button onClick={() => onDelete(w.id)} className="text-gray-400 hover:text-red-600"><i className="fa-solid fa-trash-can"></i></button>
           </div>
        </div>
        <div className="mt-4">
           <h3 className="font-bold text-gray-800">{w.name}</h3>
           <p className="text-xs text-gray-400 mt-1">{w.location}</p>
        </div>
        <div className="mt-6 flex items-center justify-between">
           <span className="text-[10px] font-bold text-gray-400 uppercase">Code: {w.code}</span>
           <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded">Active</span>
        </div>
      </div>
    ))}
    <button className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center space-y-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all">
       <i className="fa-solid fa-plus text-2xl"></i>
       <span className="font-bold text-sm">Add New Warehouse</span>
    </button>
  </div>
);

const SourceGrid: React.FC<{ sources: Source[], onEdit: (i: Source) => void, onDelete: (id: string) => void }> = ({ sources, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {sources.map(s => (
      <div key={s.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between">
           <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
              <i className="fa-solid fa-truck-field text-xl"></i>
           </div>
           <div className="flex space-x-2">
              <button onClick={() => onEdit(s)} className="text-gray-400 hover:text-blue-600"><i className="fa-solid fa-pen-to-square"></i></button>
              <button onClick={() => onDelete(s.id)} className="text-gray-400 hover:text-red-600"><i className="fa-solid fa-trash-can"></i></button>
           </div>
        </div>
        <div className="mt-4">
           <h3 className="font-bold text-gray-800">{s.name}</h3>
           <p className="text-xs text-gray-400 mt-1">{s.location}</p>
        </div>
        <div className="mt-6 flex items-center justify-between text-[10px] font-bold">
           <span className="text-gray-400 uppercase">Code: {s.code}</span>
           <span className="text-green-600">Active</span>
        </div>
      </div>
    ))}
  </div>
);

const CategoryList: React.FC<{ categories: Category[], onEdit: (i: Category) => void, onDelete: (id: string) => void }> = ({ categories, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-[#fcfdfe] border-b text-gray-400 text-[10px] font-bold uppercase tracking-wider">
        <tr>
          <th className="px-6 py-4">Category</th>
          <th className="px-6 py-4">ID</th>
          <th className="px-6 py-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 text-sm">
        {categories.map(cat => (
          <tr key={cat.id} className="hover:bg-gray-50/50">
            <td className="px-6 py-4">
               <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <i className="fa-solid fa-tag"></i>
                  </div>
                  <span className="font-bold text-gray-700">{cat.name}</span>
               </div>
            </td>
            <td className="px-6 py-4 font-medium text-gray-500">{cat.id}</td>
            <td className="px-6 py-4">
              <div className="flex justify-center space-x-2">
                <button onClick={() => onEdit(cat)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-blue-600"><i className="fa-solid fa-pen-to-square"></i></button>
                <button onClick={() => onDelete(cat.id)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-red-600"><i className="fa-solid fa-trash-can"></i></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CourierGrid: React.FC<{ couriers: Courier[], onEdit: (i: Courier) => void, onDelete: (id: string) => void }> = ({ couriers, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {couriers.map(c => (
      <div key={c.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between">
           <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
              <i className="fa-solid fa-truck-fast text-xl"></i>
           </div>
           <div className="flex space-x-2">
              <button onClick={() => onEdit(c)} className="text-gray-400 hover:text-blue-600"><i className="fa-solid fa-pen-to-square"></i></button>
              <button onClick={() => onDelete(c.id)} className="text-gray-400 hover:text-red-600"><i className="fa-solid fa-trash-can"></i></button>
           </div>
        </div>
        <div className="mt-4">
           <h3 className="font-bold text-gray-800">{c.name}</h3>
           <p className="text-xs text-gray-400 mt-1">{c.phone} • {c.address}</p>
        </div>
        <div className="mt-6 flex items-center justify-between text-[10px] font-bold">
           <span className="text-gray-400 uppercase">ID: {c.id}</span>
           <span className="text-green-600">Active</span>
        </div>
      </div>
    ))}
  </div>
);

const ManagementModal: React.FC<{ type: string, editItem: any, onClose: () => void, store: any }> = ({ type, editItem, onClose, store }) => {
  const [formData, setFormData] = useState(editItem || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = [...(store[type] as any[])];
    if (editItem) {
      const idx = list.findIndex(i => i.id === editItem.id);
      list[idx] = { ...editItem, ...formData };
    } else {
      list.push({ ...formData, id: Math.random().toString(36).substr(2, 9) });
    }
    store.updateDb({ [type]: list });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
           <h3 className="font-bold text-gray-800">{editItem ? 'Edit' : 'Add New'} {type.slice(0, -1)}</h3>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-lg"></i></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {type === 'items' && (
            <>
              <input required placeholder="Item Name" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="SKU" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} />
              <select required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.categoryId || ''} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                <option value="">Select Category</option>
                {store.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.unit || ''} onChange={e => setFormData({...formData, unit: e.target.value})}>
                <option value="kg">kg</option>
                <option value="pcs">pcs</option>
                <option value="liter">liter</option>
              </select>
              <input type="number" required placeholder="Cost Price" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.costPrice || ''} onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})} />
              <input type="number" required placeholder="Low Stock Limit" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.lowStockLimit || ''} onChange={e => setFormData({...formData, lowStockLimit: Number(e.target.value)})} />
            </>
          )}
          {type === 'warehouses' && (
            <>
              <input required placeholder="Code" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} />
              <input required placeholder="Name" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input placeholder="Location" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
            </>
          )}
          {type === 'categories' && (
            <input required placeholder="Category Name" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
          )}
          {type === 'sources' && (
            <>
              <input required placeholder="Code" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} />
              <input required placeholder="Name" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input placeholder="Location" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
            </>
          )}
          {type === 'couriers' && (
            <>
              <input required placeholder="Courier Name" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input placeholder="Phone" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input placeholder="Address" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
            </>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-colors mt-2">
            {editItem ? 'Save Changes' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Management;
