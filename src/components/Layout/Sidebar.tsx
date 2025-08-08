import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Car,
  CreditCard,
  FileText,
  Ship,
  Settings,
  UserCheck,
  Building,
  Briefcase,
  Receipt,
  Menu,
  X,
  DollarSign,
  BarChart3,
  Shield
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { language } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard', language) },
    { id: 'employees', icon: Users, label: t('employees', language) },
    { id: 'vehicles', icon: Car, label: language === 'ar' ? 'المركبات' : 'Vehicles' },
    { id: 'vehicle-authorizations', icon: Shield, label: language === 'ar' ? 'خدمات المركبات' : 'Vehicle Services' },
    { id: 'advances', icon: CreditCard, label: 'إدارة السلف' },
    { id: 'dues', icon: Receipt, label: 'المستحقات' },
    { id: 'services', icon: Briefcase, label: 'الخدمات' },
    { id: 'expenses', icon: DollarSign, label: 'مصاريف التشغيل' },
    { id: 'reports', icon: BarChart3, label: 'التقارير' },
    { id: 'licenses', icon: Building, label: t('licenses', language) },
    { id: 'shipping', icon: Ship, label: t('shippingBills', language) },
    { id: 'users', icon: UserCheck, label: t('users', language) },
    { id: 'settings', icon: Settings, label: t('settings', language) },
  ];

  return (
    <>
      {/* زر القائمة للجوال */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* خلفية شفافة للجوال */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* القائمة الجانبية */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-40
        w-64 bg-white dark:bg-gray-800 shadow-lg border-l lg:border-r border-gray-200 dark:border-gray-700 h-full
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <nav className="p-4 pt-16 lg:pt-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false); // إغلاق القائمة عند الاختيار في الجوال
                    }}
                    className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm lg:text-base">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;