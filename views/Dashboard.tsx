
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStore } from '../store';

const Dashboard: React.FC = () => {
  const { transactions, calculateBalances } = useStore();
  const balances = calculateBalances();

  const totalValue = balances.reduce((sum, b) => sum + b.totalValue, 0);
  const totalIn = balances.reduce((sum, b) => sum + b.inQty, 0);
  const totalOut = balances.reduce((sum, b) => sum + b.outQty, 0);
  const totalDamaged = balances.reduce((sum, b) => sum + b.damagedQty, 0);
  const lowStockCount = balances.filter(b => b.goodStock <= 5).length; // Simulated limit check

  // Generate chart data based on last 7 days of transactions
  const generateChartData = () => {
    const data: any[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => t.date === dateStr);
      let dayIn = 0;
      let dayOut = 0;
      let dayDmg = 0;

      dayTransactions.forEach(t => {
        t.items.forEach(item => {
          if (t.type === 'IN') {
            dayIn += item.quantity;
            dayDmg += item.damaged;
          } else {
            dayOut += item.quantity;
          }
        });
      });

      data.push({
        name: dateStr,
        IN: dayIn,
        OUT: dayOut,
        Damaged: dayDmg
      });
    }
    return data;
  };

  const chartData = generateChartData();

  const stats = [
    { label: 'Inventory Value', value: `৳${totalValue.toLocaleString()}`, icon: 'fa-bangladeshi-taka-sign', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Stock IN', value: totalIn, icon: 'fa-circle-plus', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Stock OUT', value: totalOut, icon: 'fa-circle-minus', color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Low Stock Alerts', value: lowStockCount, icon: 'fa-triangle-exclamation', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Damaged', value: totalDamaged, icon: 'fa-chart-line-down', color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 uppercase">{stat.label}</span>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-gray-800">Stock Movement</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600">Daily</button>
            <button className="px-3 py-1 text-xs font-semibold rounded bg-blue-600 text-white">Weekly</button>
            <button className="px-3 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600">Monthly</button>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
              <Line type="monotone" dataKey="IN" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="OUT" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Damaged" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
