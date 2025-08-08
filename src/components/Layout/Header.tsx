import React from 'react';
import { Moon, Sun, Globe, LogOut, Truck } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCompany } from '../../contexts/CompanyContext';
import { t } from '../../utils/translations';
import NotificationDropdown from './NotificationDropdown';

const Header: React.FC = () => {
  const { isDark, toggleTheme, language, setLanguage } = useTheme();
  const { logout, user } = useAuth();
  const { companyInfo } = useCompany();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* الشعار واسم الشركة */}
          <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg overflow-hidden">
              {companyInfo.logo ? (
                <img
                  src={companyInfo.logo}
                  alt="شعار المؤسسة"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              )}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {companyInfo.name || t('companyName', language)}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                نظام إدارة الخدمات اللوجستية
              </p>
            </div>
          </div>

          {/* أدوات التحكم */}
          <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
            {/* تبديل اللغة - مخفي في الجوال */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="hidden sm:flex p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={language === 'ar' ? 'English' : 'العربية'}
            >
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* التنبيهات */}
            <NotificationDropdown />

            {/* تبديل الوضع */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={isDark ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              )}
            </button>

            {/* معلومات المستخدم */}
            <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
              <div className="hidden sm:block text-right rtl:text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  مدير النظام
                </p>
              </div>

              {/* تسجيل الخروج */}
              <button
                onClick={logout}
                className="p-1.5 sm:p-2 rounded-lg bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                title={t('logout', language)}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;