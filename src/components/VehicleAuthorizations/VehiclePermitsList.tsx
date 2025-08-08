import React, { useState } from 'react';
import { Plus, Edit, Trash2, FileText, Shield, Car, Calendar, Search, Filter } from 'lucide-react';
import { VehiclePermit, Vehicle } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import VehiclePermitForm from './VehiclePermitForm';

const VehiclePermitsList: React.FC = () => {
  const { language } = useTheme();

  // بيانات المركبات (يجب جلبها من السياق أو API)
  const vehicles: Vehicle[] = [
    {
      id: '1',
      plateNumber: 'أ ب ج 123',
      model: 'تويوتا كامري',
      year: 2020,
      color: 'أبيض',
      chassisNumber: 'CH123456789',
      engineNumber: 'EN987654321',
      fuelType: 'بنزين',
      status: 'active',
      driverId: '1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      plateNumber: 'د هـ و 456',
      model: 'نيسان التيما',
      year: 2019,
      color: 'أسود',
      chassisNumber: 'CH987654321',
      engineNumber: 'EN123456789',
      fuelType: 'بنزين',
      status: 'active',
      driverId: '2',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  // بيانات التصاريح التجريبية
  const [permits, setPermits] = useState<VehiclePermit[]>([
    {
      id: '1',
      vehicleId: '1',
      permitType: 'local',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      attachments: [],
      notes: 'تفويض محلي للعمليات داخل المدينة',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      vehicleId: '2',
      permitType: 'actual_user',
      startDate: '2024-01-15',
      attachments: [],
      notes: 'مستخدم فعلي للمركبة',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingPermit, setEditingPermit] = useState<VehiclePermit | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleAddPermit = () => {
    setEditingPermit(undefined);
    setShowForm(true);
  };

  const handleEditPermit = (permit: VehiclePermit) => {
    setEditingPermit(permit);
    setShowForm(true);
  };

  const handleDeletePermit = (id: string) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا التفويض؟' : 'Are you sure you want to delete this permit?')) {
      setPermits(permits.filter(p => p.id !== id));
    }
  };

  const handleSavePermit = (permitData: Omit<VehiclePermit, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPermit) {
      // تحديث التصريح
      setPermits(permits.map(p => 
        p.id === editingPermit.id 
          ? { ...p, ...permitData, updatedAt: new Date().toISOString() }
          : p
      ));
    } else {
      // إضافة تفويض جديد
      const newPermit: VehiclePermit = {
        ...permitData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPermits([...permits, newPermit]);
    }
    setShowForm(false);
  };

  const getPermitTypeText = (type: string) => {
    switch (type) {
      case 'local':
        return language === 'ar' ? 'تفويض محلي' : 'Local Permit';
      case 'external':
        return language === 'ar' ? 'تفويض خارجي' : 'External Permit';
      case 'actual_user':
        return language === 'ar' ? 'مستخدم فعلي' : 'Actual User';
      default:
        return '';
    }
  };

  const getPermitTypeColor = (type: string) => {
    switch (type) {
      case 'local':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
      case 'external':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'actual_user':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
    }
  };

  const getVehicleInfo = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const isPermitExpired = (permit: VehiclePermit) => {
    if (!permit.endDate) return false;
    return new Date(permit.endDate) < new Date();
  };

  const isPermitExpiringSoon = (permit: VehiclePermit) => {
    if (!permit.endDate) return false;
    const endDate = new Date(permit.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  // فلترة التصاريح
  const filteredPermits = permits.filter(permit => {
    const vehicle = getVehicleInfo(permit.vehicleId);
    const matchesSearch = !searchTerm || 
      vehicle?.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPermitTypeText(permit.permitType).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || permit.permitType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ar' ? 'التفاويض' : 'Permits'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {language === 'ar' ? 'إدارة تفاويض المركبات' : 'Manage vehicle permits'}
          </p>
        </div>
        <button
          onClick={handleAddPermit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة تفويض' : 'Add Permit'}</span>
        </button>
      </div>

      {/* البحث والفلترة */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* البحث */}
          <div className="relative">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'البحث في التفاويض...' : 'Search permits...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* الفلترة */}
          <div className="relative">
            <Filter className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
              <option value="local">{getPermitTypeText('local')}</option>
              <option value="external">{getPermitTypeText('external')}</option>
              <option value="actual_user">{getPermitTypeText('actual_user')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'إجمالي التفاويض' : 'Total Permits'}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {permits.length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'محلي' : 'Local'}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {permits.filter(p => p.permitType === 'local').length}
              </p>
            </div>
            <Car className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'خارجي' : 'External'}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {permits.filter(p => p.permitType === 'external').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'مستخدم فعلي' : 'Actual User'}
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {permits.filter(p => p.permitType === 'actual_user').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* جدول التفاويض */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'المركبة' : 'Vehicle'}
                </th>
                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'نوع التفويض' : 'Permit Type'}
                </th>
                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'تاريخ البداية' : 'Start Date'}
                </th>
                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'تاريخ النهاية' : 'End Date'}
                </th>
                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPermits.map((permit) => {
                const vehicle = getVehicleInfo(permit.vehicleId);
                const expired = isPermitExpired(permit);
                const expiringSoon = isPermitExpiringSoon(permit);
                
                return (
                  <tr key={permit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {vehicle?.plateNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {vehicle?.model}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPermitTypeColor(permit.permitType)}`}>
                        {getPermitTypeText(permit.permitType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(permit.startDate).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {permit.endDate 
                        ? new Date(permit.endDate).toLocaleDateString('ar-SA')
                        : (language === 'ar' ? 'غير محدد' : 'Not specified')
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {permit.permitType === 'actual_user' ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                          {language === 'ar' ? 'دائم' : 'Permanent'}
                        </span>
                      ) : expired ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                          {language === 'ar' ? 'منتهي' : 'Expired'}
                        </span>
                      ) : expiringSoon ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
                          {language === 'ar' ? 'ينتهي قريباً' : 'Expiring Soon'}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                          {language === 'ar' ? 'صالح' : 'Valid'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleEditPermit(permit)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePermit(permit.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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

        {filteredPermits.length === 0 && (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {language === 'ar' ? 'لا توجد تفاويض' : 'No permits found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'ابدأ بإضافة تفويض جديد' : 'Get started by adding a new permit'}
            </p>
          </div>
        )}
      </div>

      {/* نموذج إضافة/تعديل التفويض */}
      {showForm && (
        <VehiclePermitForm
          permit={editingPermit}
          onSave={handleSavePermit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default VehiclePermitsList;
