import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, User, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { Driver } from '../../types';
import DriverForm from './DriverForm';

const DriverList: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: '1',
      employeeId: '1',
      licenseNumber: 'DL123456789',
      expiryDate: '2025-06-15',
      status: 'valid',
      attachments: []
    },
    {
      id: '2',
      employeeId: '2',
      licenseNumber: 'DL987654321',
      expiryDate: '2024-01-15',
      status: 'expired',
      attachments: []
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddDriver = () => {
    setEditingDriver(null);
    setShowForm(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleDeleteDriver = (id: string) => {
    if (confirm('هل أنت متأكد من حذف بيانات هذا السائق؟')) {
      setDrivers(drivers.filter(driver => driver.id !== id));
    }
  };

  const handleSaveDriver = (driverData: Omit<Driver, 'id'>) => {
    // تحديث حالة الرخصة تلقائياً
    const today = new Date();
    const expiryDate = new Date(driverData.expiryDate);
    const updatedDriverData = {
      ...driverData,
      status: expiryDate > today ? 'valid' : 'expired'
    };

    if (editingDriver) {
      setDrivers(drivers.map(driver => 
        driver.id === editingDriver.id 
          ? { ...updatedDriverData, id: editingDriver.id }
          : driver
      ));
    } else {
      const newDriver: Driver = {
        ...updatedDriverData,
        id: Date.now().toString()
      };
      setDrivers([...drivers, newDriver]);
    }
    setShowForm(false);
    setEditingDriver(null);
  };

  const getDriverStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'منتهية', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' };
    } else if (diffDays <= 30) {
      return { status: 'تنتهي قريباً', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' };
    } else {
      return { status: 'سارية', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    return driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           driver.employeeId.includes(searchTerm);
  });

  // بيانات تجريبية للموظفين
  const employees = [
    { id: '1', name: 'أحمد محمد علي السعيد' },
    { id: '2', name: 'محمد أحمد علي' }
  ];

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'غير محدد';
  };

  if (showForm) {
    return (
      <DriverForm
        driver={editingDriver}
        onSave={handleSaveDriver}
        onCancel={() => {
          setShowForm(false);
          setEditingDriver(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          إدارة السائقين
        </h2>
        <button
          onClick={handleAddDriver}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة سائق</span>
        </button>
      </div>

      {/* شريط البحث */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث برقم الرخصة أو اسم السائق..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">إجمالي السائقين</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{drivers.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">رخص سارية</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {drivers.filter(driver => getDriverStatus(driver.expiryDate).status === 'سارية').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">رخص منتهية</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {drivers.filter(driver => getDriverStatus(driver.expiryDate).status === 'منتهية').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* جدول السائقين */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  اسم السائق
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  رقم رخصة القيادة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  تاريخ الانتهاء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDrivers.map((driver) => {
                const status = getDriverStatus(driver.expiryDate);
                return (
                  <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getEmployeeName(driver.employeeId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {driver.licenseNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(driver.expiryDate).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                        {status.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleEditDriver(driver)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDriver(driver.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDrivers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              لا توجد بيانات سائقين مطابقة لمعايير البحث
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverList;