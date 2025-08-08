import React, { useState } from 'react';
import './index.css';

// مكون بسيط للعرض التوضيحي
const App: React.FC = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [darkMode, setDarkMode] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
    document.documentElement.lang = language === 'ar' ? 'en' : 'ar';
    document.documentElement.dir = language === 'ar' ? 'ltr' : 'rtl';
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <header className="bg-blue-600 dark:bg-blue-800 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  {language === 'ar' ? 'نظام إدارة مؤسسة القعوط' : 'Alqaoot Management System'}
                </h1>
                <p className="text-blue-100 mt-2">
                  {language === 'ar' ? 'للخدمات اللوجستية' : 'Logistics Services'}
                </p>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <button
                  onClick={toggleLanguage}
                  className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors"
                >
                  {language === 'ar' ? 'English' : 'العربية'}
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {language === 'ar' ? 'مرحباً بك في نظام الإدارة الشامل' : 'Welcome to Comprehensive Management System'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {language === 'ar' 
                ? 'نظام متكامل لإدارة المركبات والموظفين والخدمات اللوجستية' 
                : 'Integrated system for managing vehicles, employees, and logistics services'
              }
            </p>
            <div className="bg-yellow-100 dark:bg-yellow-900 border-r-4 border-yellow-500 p-4 rounded-lg max-w-2xl mx-auto">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>
                  {language === 'ar' ? 'ملاحظة:' : 'Note:'}
                </strong>{' '}
                {language === 'ar' 
                  ? 'هذا عرض توضيحي للمشروع. النسخة الكاملة متاحة للتشغيل المحلي.'
                  : 'This is a demo version. Full version available for local development.'
                }
              </p>
            </div>
          </section>

          {/* Features Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Vehicle Management */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {language === 'ar' ? 'إدارة المركبات' : 'Vehicle Management'}
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• {language === 'ar' ? 'خدمات المركبات الشاملة' : 'Comprehensive vehicle services'}</li>
                <li>• {language === 'ar' ? 'إدارة التفاويض والتصاريح' : 'Authorization and permits management'}</li>
                <li>• {language === 'ar' ? 'متابعة التأمين' : 'Insurance tracking'}</li>
                <li>• {language === 'ar' ? 'كروت التشغيل' : 'Operating cards'}</li>
              </ul>
            </div>

            {/* Employee Management */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-green-600 text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {language === 'ar' ? 'إدارة الموظفين' : 'Employee Management'}
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• {language === 'ar' ? 'بيانات الموظفين' : 'Employee data'}</li>
                <li>• {language === 'ar' ? 'إدارة السلف' : 'Advances management'}</li>
                <li>• {language === 'ar' ? 'المستحقات المالية' : 'Financial dues'}</li>
                <li>• {language === 'ar' ? 'بطاقات السائقين' : 'Driver cards'}</li>
              </ul>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-orange-600 text-4xl mb-4">🔔</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {language === 'ar' ? 'نظام التنبيهات' : 'Notification System'}
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• {language === 'ar' ? 'تنبيهات الوثائق المنتهية' : 'Expired documents alerts'}</li>
                <li>• {language === 'ar' ? 'إشعارات الانتهاء القريب' : 'Near expiry notifications'}</li>
                <li>• {language === 'ar' ? 'عداد التنبيهات' : 'Notification counter'}</li>
                <li>• {language === 'ar' ? 'تصنيف حسب الأولوية' : 'Priority classification'}</li>
              </ul>
            </div>
          </section>

          {/* Installation Guide */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {language === 'ar' ? 'كيفية تشغيل المشروع' : 'How to Run the Project'}
            </h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm">
              <div className="mb-2"># {language === 'ar' ? 'استنساخ المشروع' : 'Clone the project'}</div>
              <div className="mb-2">git clone https://github.com/majed542193705-glitch/alqaoot.git</div>
              <div className="mb-2">cd alqaoot</div>
              <div className="mb-2"></div>
              <div className="mb-2"># {language === 'ar' ? 'تثبيت التبعيات' : 'Install dependencies'}</div>
              <div className="mb-2">npm install</div>
              <div className="mb-2"></div>
              <div className="mb-2"># {language === 'ar' ? 'تشغيل الخادم المحلي' : 'Run local server'}</div>
              <div>npm run dev</div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-4">
              {language === 'ar' 
                ? 'نظام إدارة مؤسسة القعوط للخدمات اللوجستية' 
                : 'Alqaoot Logistics Management System'
              }
            </p>
            <p className="text-gray-400">
              {language === 'ar' 
                ? 'تم التطوير باستخدام React + TypeScript + Tailwind CSS' 
                : 'Built with React + TypeScript + Tailwind CSS'
              }
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
