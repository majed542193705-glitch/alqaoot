import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, FileText, Filter } from 'lucide-react';
import { Authorization } from '../../types';
import AuthorizationForm from './AuthorizationForm';

const AuthorizationList: React.FC = () => {
  const [authorizations, setAuthorizations] = useState<Authorization[]>([
    {
      id: '1',
      employeeId: '1',
      vehicleId: '1',
      type: 'local',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      attachments: []
    },
    {
      id: '2',
      employeeId: '1',
      vehicleId: '2',
      type: 'international',
      startDate: '2024-02-01',
      endDate: '2024-08-01',
      attachments: []
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAuthorization, setEditingAuthorization] = useState<Authorization | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleAddAuthorization = () => {
    setEditingAuthorization(null);
    setShowForm(true);
  };

  const handleEditAuthorization = (authorization: Authorization) => {
    setEditingAuthorization(authorization);
    setShowForm(true);
  };

  const handleDeleteAuthorization = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التفويض؟')) {
      setAuthorizations(authorizations.filter(auth => auth.id !== id));
    }
  };

  const handleSaveAuthorization = (authorizationData: Omit<Authorization, 'id'>) => {
    if (editingAuthorization) {
      setAuthorizations(authorizations.map(auth => 
        auth.id === editingAuthorization.id 
          ? { ...authorizationData, id: editingAuthorization.id }
          : auth
      ));
    } else {
      const newAuthorization: Authorization = {
        ...authorizationData,
        id: Date.now().toString()
      };
      setAuthorizations([...authorizations, newAuthorization]);
    }
    setShowForm(false);
    setEditingAuthorization(null);
  };

  const getAuthorizationStatus = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'منتهي', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' };
    } else if (diffDays <= 30) {
      return { status: 'ينتهي قريباً', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' };
    } else {
      return { status: 'ساري', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
    }
  };

  const filteredAuthorizations = authorizations.filter(authorization => {
    const matchesSearch = 
      authorization.employeeId.includes(searchTerm) ||
      authorization.vehicleId.includes(searchTerm);
    
    const matchesFilter = filterType === 'all' || authorization.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // بيانات تجريبية للموظفين والمركبات
  const employees = [
    { id: '1', name: 'أحمد محمد علي السعيد' },
    { id: '2', name: 'محمد أحمد علي' }
  ];

  const vehicles = [
    { id: '1', plateNumber: 'ABC-123', brand: 'تويوتا', model: 'كامري' },
    { id: '2', plateNumber: 'XYZ-456', brand: 'نيسان', model: 'باترول' }
  ];

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'غير محدد';
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(veh => veh.id === vehicleId);
    return vehicle ? `${vehicle.plateNumber} - ${vehicle.brand} ${vehicle.model}` : 'غير محدد';
  };

  if (showForm) {
    return (
      <AuthorizationForm
        authorization={editingAuthorization}
        onSave={handleSaveAuthorization}
        onCancel={() => {
          setShowForm(false);
          setEditingAuthorization(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          إدارة التفاويض
        </h2>
        <button
          onClick={handleAddAuthorization}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة تفويض</span>
        </button>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في التفاويض..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 rtl:pr-10 rtl:pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">جميع الأنواع</option>
            <option value="local">تفويض محلي</option>
            <option value="international">تفويض دولي</option>
          </select>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">إجمالي التفاويض</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{authorizations.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">سارية المفعول</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {authorizations.filter(auth => getAuthorizationStatus(auth.endDate).status === 'ساري').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">منتهية الصلاحية</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {authorizations.filter(auth => getAuthorizationStatus(auth.endDate).status === 'منتهي').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* جدول التفاويض */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  اسم الموظف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  المركبة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  نوع التفويض
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  تاريخ البداية
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
              {filteredAuthorizations.map((authorization) => {
                const status = getAuthorizationStatus(authorization.endDate);
                return (
                  <tr key={authorization.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getEmployeeName(authorization.employeeId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getVehicleInfo(authorization.vehicleId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {authorization.type === 'local' ? 'تفويض محلي' : 'تفويض دولي'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(authorization.startDate).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(authorization.endDate).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                        {status.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleEditAuthorization(authorization)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAuthorization(authorization.id)}
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

        {filteredAuthorizations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              لا توجد تفاويض مطابقة لمعايير البحث
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorizationList;