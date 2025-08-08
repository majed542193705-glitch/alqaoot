import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, Clock, Shield, Car, CreditCard, User, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationDropdown: React.FC = () => {
  const { language } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // استخدام hook التنبيهات مع بيانات تجريبية
  // في التطبيق الحقيقي، ستأتي هذه البيانات من السياق أو API
  const { notifications, expiredCount, expiringSoonCount, totalCount } = useNotifications({
    permits: [
      {
        id: '1',
        vehicleId: '1',
        permitType: 'local',
        startDate: '2024-01-01',
        endDate: '2024-07-15', // منتهي
        attachments: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ],
    insurances: [
      {
        id: '1',
        vehicleId: '2',
        insuranceCompany: 'شركة التأمين الوطنية',
        expiryDate: '2024-08-20', // ينتهي قريباً
        attachments: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ],
    operatingCards: [
      {
        id: '1',
        vehicleId: '3',
        cardNumber: 'OP-2024-001',
        startDate: '2024-01-01',
        expiryDate: '2024-08-25', // ينتهي قريباً
        attachments: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ],
    driverCards: [
      {
        id: '1',
        vehicleId: '4',
        cardNumber: 'DR-2024-001',
        startDate: '2024-01-01',
        expiryDate: '2024-07-10', // منتهي
        attachments: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ],
    vehicles: [
      { id: '1', plateNumber: 'أ ب ج 123', model: 'تويوتا كامري' },
      { id: '2', plateNumber: 'د هـ و 456', model: 'نيسان التيما' },
      { id: '3', plateNumber: 'ز ح ط 789', model: 'هيونداي إلنترا' },
      { id: '4', plateNumber: 'ي ك ل 321', model: 'كيا سيراتو' }
    ] as any,
    language
  });

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'permit':
        return <Shield className="w-4 h-4" />;
      case 'insurance':
        return <Car className="w-4 h-4" />;
      case 'operating-card':
        return <CreditCard className="w-4 h-4" />;
      case 'driver-card':
        return <User className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (status: string) => {
    switch (status) {
      case 'expired':
        return 'text-red-500';
      case 'expiring_soon':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'expiring_soon':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  // المتغيرات محسوبة بالفعل من hook

  return (
    <div className="relative" ref={dropdownRef}>
      {/* زر التنبيهات */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalCount > 9 ? '9+' : totalCount}
          </span>
        )}
      </button>

      {/* قائمة التنبيهات */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* رأس القائمة */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'ar' ? 'التنبيهات' : 'Notifications'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* إحصائيات سريعة */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {expiredCount}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {language === 'ar' ? 'منتهية' : 'Expired'}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    {expiringSoonCount}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {language === 'ar' ? 'تنتهي قريباً' : 'Expiring Soon'}
                </p>
              </div>
            </div>
          </div>

          {/* قائمة التنبيهات */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center">
                <Bell className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'ar' ? 'لا توجد تنبيهات' : 'No notifications'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      {/* أيقونة نوع التنبيه */}
                      <div className={`flex-shrink-0 ${getNotificationColor(notification.status)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* محتوى التنبيه */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </p>
                          {getStatusIcon(notification.status)}
                        </div>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.vehiclePlate} - {notification.vehicleModel}
                        </p>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {language === 'ar' ? 'تاريخ الانتهاء:' : 'Expires:'} {new Date(notification.expiryDate).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* تذييل القائمة */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                {language === 'ar' ? 'عرض جميع التنبيهات' : 'View All Notifications'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
