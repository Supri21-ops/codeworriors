import React, { useState } from 'react';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { WorkOrders } from './pages/WorkOrders';
import { Inventory } from './pages/Inventory';
import './App.css';

type Page = 'login' | 'signup' | 'dashboard' | 'workorders' | 'inventory';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For demo purposes

  // Simple routing logic
  const renderPage = () => {
    if (!isAuthenticated) {
      switch (currentPage) {
        case 'login':
          return <Login />;
        case 'signup':
          return <Signup />;
        default:
          return <Login />;
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return <ManagerDashboard />;
      case 'workorders':
        return <WorkOrders />;
      case 'inventory':
        return <Inventory />;
      default:
        return <ManagerDashboard />;
    }
  };

  // Handle navigation from sidebar
  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  // Handle authentication
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  // Add navigation handlers to window for demo purposes
  React.useEffect(() => {
    (window as any).navigateTo = (page: Page) => setCurrentPage(page);
    (window as any).handleLogin = handleLogin;
    (window as any).handleLogout = handleLogout;
  }, []);

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;