
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Operations from './views/Operations';
import InventoryBalance from './views/InventoryBalance';
import Management from './views/Management';
import Reports from './views/Reports';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard />;
      case 'operations': return <Operations />;
      case 'balance': return <InventoryBalance />;
      case 'items': return <Management type="items" />;
      case 'warehouses': return <Management type="warehouses" />;
      case 'sources': return <Management type="sources" />;
      case 'categories': return <Management type="categories" />;
      case 'couriers': return <Management type="couriers" />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  const getPageInfo = () => {
    switch(activeView) {
      case 'dashboard': return { title: 'Dashboard', subtitle: 'Real-time overview & valuation.' };
      case 'operations': return { title: 'Stock Operations', subtitle: 'Record inventory movements' };
      case 'balance': return { title: 'Inventory Balance', subtitle: 'Detailed stock status' };
      case 'items': return { title: 'Items', subtitle: 'Product management' };
      case 'warehouses': return { title: 'Warehouses', subtitle: 'Storage locations' };
      case 'sources': return { title: 'Sources', subtitle: 'Supplier management' };
      case 'categories': return { title: 'Categories', subtitle: 'Product grouping' };
      case 'couriers': return { title: 'Couriers', subtitle: 'Logistics partners' };
      case 'reports': return { title: 'Reports', subtitle: 'Transaction history' };
      default: return { title: 'Pure Food Mart', subtitle: 'Inventory' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView}
      title={title}
      subtitle={subtitle}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
