import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CompanyProvider } from './contexts/CompanyContext';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import EmployeeList from './components/Employees/EmployeeList';
import VehicleList from './components/Vehicles/VehicleList';
import VehicleAuthorizationsList from './components/VehicleAuthorizations/VehicleAuthorizationsList';
import AdvancesList from './components/Advances/AdvancesList';
import DuesList from './components/Dues/DuesList';
import ServicesPage from './components/Services/ServicesPage';
import OperatingExpensesList from './components/OperatingExpenses/OperatingExpensesList';
import ReportsPage from './components/Reports/ReportsPage';
import CompanyLicensesList from './components/Licenses/CompanyLicensesList';
import ShippingBillsList from './components/ShippingBills/ShippingBillsList';
import UsersList from './components/Users/UsersList';
import Settings from './components/Settings/Settings';

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <EmployeeList />;
      case 'vehicles':
        return <VehicleList />;
      case 'vehicle-authorizations':
        return <VehicleAuthorizationsList />;
      case 'advances':
        return <AdvancesList />;
      case 'dues':
        return <DuesList />;
      case 'services':
        return <ServicesPage />;
      case 'expenses':
        return <OperatingExpensesList />;
      case 'reports':
        return <ReportsPage />;
      case 'licenses':
        return <CompanyLicensesList />;
      case 'shipping':
        return <ShippingBillsList />;
      case 'users':
        return <UsersList />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-auto lg:mr-0 w-full lg:w-auto">
          <div className="p-3 sm:p-4 lg:p-6 max-w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CompanyProvider>
          <MainApp />
        </CompanyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
