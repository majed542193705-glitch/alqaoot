import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Car, Calendar, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { VehicleInsurance, Vehicle } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import VehicleInsuranceForm from './VehicleInsuranceForm';

const VehicleInsuranceList: React.FC = () => {
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

  // بيانات التأمين التجريبية
  const [insurances, setInsurances] = useState<VehicleInsurance[]>([
    {
      id: '1',
      vehicleId: '1',
      insuranceCompany: 'شركة التأمين الوطنية',
      expiryDate: '2024-12-31',
      attachments: [],
      notes: 'تأمين شامل ضد الحوادث والسرقة',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      vehicleId: '2',
      insuranceCompany: 'شركة الراجحي للتأمين',
      expiryDate: '2024-08-15',
      attachments: [],
      notes: 'تأمين ضد الغير',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<VehicleInsurance | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddInsurance = () => {
    setEditingInsurance(undefined);
    setShowForm(true);
  };

  const handleEditInsurance = (insurance: VehicleInsurance) => {
    setEditingInsurance(insurance);
    setShowForm(true);
  };

  const handleDeleteInsurance = (id: string) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا التأمين؟' : 'Are you sure you want to delete this insurance?')) {
      setInsurances(insurances.filter(i => i.id !== id));
    }
  };

  const handleSaveInsurance = (insuranceData: Omit<VehicleInsurance, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingInsurance) {
      // تحديث التأمين
      setInsurances(insurances.map(i => 
        i.id === editingInsurance.id 
          ? { ...i, ...insuranceData, updatedAt: new Date().toISOString() }
          : i
      ));
    } else {
      // إضافة تأمين جديد
      const newInsurance: VehicleInsurance = {
        ...insuranceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setInsurances([...insurances, newInsurance]);
    }
    setShowForm(false);
  };

  const getVehicleInfo = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const getInsuranceStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'expired';
    } else if (diffDays <= 30) {
      return 'expiring_soon';
    } else {
      return 'valid';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'expiring_soon':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return language === 'ar' ? 'صالح' : 'Valid';
      case 'expired':
        return language === 'ar' ? 'منتهي الصلاحية' : 'Expired';
      case 'expiring_soon':
        return language === 'ar' ? 'ينتهي قريباً' : 'Expiring Soon';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'expired':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'expiring_soon':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
    }
  };

  // فلترة التأمين
  const filteredInsurances = insurances.filter(insurance => {
    const vehicle = getVehicleInfo(insurance.vehicleId);
    const matchesSearch = !searchTerm || 
      vehicle?.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insurance.insuranceCompany.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // حساب الإحصائيات
  const stats = {
    total: insurances.length,
    valid: insurances.filter(i => getInsuranceStatus(i.expiryDate) === 'valid').length,
    expiringSoon: insurances.filter(i => getInsuranceStatus(i.expiryDate) === 'expiring_soon').length,
    expired: insurances.filter(i => getInsuranceStatus(i.expiryDate) === 'expired').length
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ar' ? 'التأمين' : 'Insurance'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {language === 'ar' ? 'إدارة تأمين المركبات' : 'Manage vehicle insurance'}
          </p>
        </div>
        <button
          onClick={handleAddInsurance}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة تأمين' : 'Add Insurance'}</span>
        </button>
      </div>

      {/* البحث */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'البحث في التأمين...' : 'Search insurance...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'إجمالي التأمين' : 'Total Insurance'}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'صالح' : 'Valid'}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.valid}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'ينتهي قريباً' : 'Expiring Soon'}
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.expiringSoon}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'منتهي' : 'Expired'}
              </p>
              <p className="text-2xl font-bold text-red-600">
                {stats.expired}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* جدول التأمين */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'المركبة' : 'Vehicle'}
                </th>
                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'شركة التأمين' : 'Insurance Company'}
                </th>
                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
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
              {filteredInsurances.map((insurance) => {
                const vehicle = getVehicleInfo(insurance.vehicleId);
                const status = getInsuranceStatus(insurance.expiryDate);
                
                return (
                  <tr key={insurance.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {insurance.insuranceCompany}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(insurance.expiryDate).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {getStatusIcon(status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleEditInsurance(insurance)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInsurance(insurance.id)}
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

        {filteredInsurances.length === 0 && (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {language === 'ar' ? 'لا يوجد تأمين' : 'No insurance found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'ابدأ بإضافة تأمين جديد' : 'Get started by adding a new insurance'}
            </p>
          </div>
        )}
      </div>

      {/* نموذج إضافة/تعديل التأمين */}
      {showForm && (
        <VehicleInsuranceForm
          insurance={editingInsurance}
          onSave={handleSaveInsurance}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default VehicleInsuranceList;
