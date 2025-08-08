import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, FileText, AlertTriangle, CheckCircle, Clock, Shield, Car, Calendar, TrendingUp, CreditCard, User } from 'lucide-react';
import { VehicleAuthorization, Vehicle } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import VehicleAuthorizationForm from './VehicleAuthorizationForm';
import VehiclePermitsList from './VehiclePermitsList';
import VehicleInsuranceList from './VehicleInsuranceList';
import VehicleOperatingCardList from './VehicleOperatingCardList';
import DriverCardList from './DriverCardList';

const VehicleAuthorizationsList: React.FC = () => {
  const { language } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editingAuthorization, setEditingAuthorization] = useState<VehicleAuthorization | null>(null);
  const [activeTab, setActiveTab] = useState('documents');
  const driverCardListRef = useRef<{ openAddForm: () => void }>(null);

  // بيانات تجريبية للمركبات
  const vehicles: Vehicle[] = [
    {
      id: '1',
      serialNumber: 1,
      ownerId: '1',
      plateNumber: 'ABC-123',
      brand: 'تويوتا',
      model: 'كامري',
      year: 2020,
      color: 'أبيض',
      type: 'sedan',
      status: 'working',
      mileage: 45000,
      ownership: 'company',
      ownershipType: 'alqaoot_company'
    },
    {
      id: '2',
      serialNumber: 2,
      ownerId: '2',
      plateNumber: 'XYZ-456',
      brand: 'نيسان',
      model: 'التيما',
      year: 2019,
      color: 'أسود',
      type: 'sedan',
      status: 'working',
      mileage: 67000,
      ownership: 'company',
      ownershipType: 'bank'
    }
  ];

  // بيانات تجريبية للتفاويض
  const [authorizations, setAuthorizations] = useState<VehicleAuthorization[]>([
    {
      id: '1',
      vehicleId: '1',
      registrationExpiryDate: '2024-12-31',
      registrationStatus: 'valid',
      inspectionExpiryDate: '2024-06-15',
      inspectionStatus: 'expiring_soon',
      operatingCardExpiryDate: '2025-03-20',
      operatingCardStatus: 'valid',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      vehicleId: '2',
      registrationExpiryDate: '2024-08-15',
      registrationStatus: 'expired',
      inspectionExpiryDate: '2024-09-30',
      inspectionStatus: 'valid',
      operatingCardExpiryDate: '2024-05-10',
      operatingCardStatus: 'expired',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const getVehicleInfo = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const getStatusIcon = (status: 'valid' | 'expired' | 'expiring_soon') => {
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

  const getStatusText = (status: 'valid' | 'expired' | 'expiring_soon') => {
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

  // حساب الإحصائيات
  const getStatistics = () => {
    const totalAuthorizations = authorizations.length;
    const totalVehicles = vehicles.length;

    // حساب الوثائق المنتهية الصلاحية
    const expiredDocuments = authorizations.filter(auth =>
      auth.registrationStatus === 'expired' ||
      auth.inspectionStatus === 'expired' ||
      auth.operatingCardStatus === 'expired'
    ).length;

    // حساب الوثائق التي تنتهي قريباً
    const expiringSoonDocuments = authorizations.filter(auth =>
      auth.registrationStatus === 'expiring_soon' ||
      auth.inspectionStatus === 'expiring_soon' ||
      auth.operatingCardStatus === 'expiring_soon'
    ).length;

    // حساب الوثائق الصالحة
    const validDocuments = authorizations.filter(auth =>
      auth.registrationStatus === 'valid' &&
      auth.inspectionStatus === 'valid' &&
      auth.operatingCardStatus === 'valid'
    ).length;

    // حساب المركبات بدون تفاويض
    const vehiclesWithoutAuth = vehicles.filter(vehicle =>
      !authorizations.some(auth => auth.vehicleId === vehicle.id)
    ).length;

    return {
      totalAuthorizations,
      totalVehicles,
      expiredDocuments,
      expiringSoonDocuments,
      validDocuments,
      vehiclesWithoutAuth
    };
  };

  const stats = getStatistics();

  const handleAddAuthorization = () => {
    setEditingAuthorization(null);
    setShowForm(true);
  };

  const handleAddDriverCard = () => {
    // التبديل إلى تبويب بطاقات السائقين إذا لم يكن نشطاً
    if (activeTab !== 'driver-cards') {
      setActiveTab('driver-cards');
      // انتظار قليل حتى يتم تحديث التبويب ثم فتح النموذج
      setTimeout(() => {
        driverCardListRef.current?.openAddForm();
      }, 100);
    } else {
      // إذا كان التبويب نشطاً بالفعل، افتح النموذج مباشرة
      driverCardListRef.current?.openAddForm();
    }
  };

  const handleEditAuthorization = (authorization: VehicleAuthorization) => {
    setEditingAuthorization(authorization);
    setShowForm(true);
  };

  const handleDeleteAuthorization = (id: string) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا التفويض؟' : 'Are you sure you want to delete this authorization?')) {
      setAuthorizations(prev => prev.filter(auth => auth.id !== id));
    }
  };

  const handleSaveAuthorization = (authorizationData: Omit<VehicleAuthorization, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    if (editingAuthorization) {
      setAuthorizations(prev => prev.map(auth => 
        auth.id === editingAuthorization.id 
          ? { ...authorizationData, id: auth.id, createdAt: auth.createdAt, updatedAt: now }
          : auth
      ));
    } else {
      const newAuthorization: VehicleAuthorization = {
        ...authorizationData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      setAuthorizations(prev => [...prev, newAuthorization]);
    }
    
    setShowForm(false);
    setEditingAuthorization(null);
  };

  if (showForm) {
    return (
      <VehicleAuthorizationForm
        authorization={editingAuthorization}
        vehicles={vehicles}
        onSave={handleSaveAuthorization}
        onCancel={() => {
          setShowForm(false);
          setEditingAuthorization(null);
        }}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ar' ? 'خدمات المركبات' : 'Vehicle Services'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {language === 'ar' ? 'إدارة جميع خدمات ووثائق المركبات' : 'Manage all vehicle services and documents'}
          </p>
        </div>
        <button
          onClick={
            activeTab === 'documents' ? handleAddAuthorization :
            activeTab === 'permits' ? () => {} :
            activeTab === 'insurance' ? () => {} :
            activeTab === 'operating-cards' ? () => {} :
            activeTab === 'driver-cards' ? handleAddDriverCard : () => {}
          }
          className={`${
            activeTab === 'driver-cards'
              ? 'bg-orange-600 hover:bg-orange-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-colors`}
        >
          <Plus className="w-4 h-4" />
          <span>
            {activeTab === 'documents'
              ? (language === 'ar' ? 'إضافة وثيقة' : 'Add Document')
              : activeTab === 'permits'
              ? (language === 'ar' ? 'إضافة تفويض' : 'Add Permit')
              : activeTab === 'insurance'
              ? (language === 'ar' ? 'إضافة تأمين' : 'Add Insurance')
              : activeTab === 'operating-cards'
              ? (language === 'ar' ? 'إضافة كرت تشغيل' : 'Add Operating Card')
              : (language === 'ar' ? 'إضافة بطاقة سائق' : 'Add Driver Card')
            }
          </span>
        </button>
      </div>

      {/* التبويبات */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <FileText className="w-4 h-4" />
                <span>{language === 'ar' ? 'الوثائق' : 'Documents'}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('permits')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'permits'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Shield className="w-4 h-4" />
                <span>{language === 'ar' ? 'التفاويض' : 'Permits'}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('insurance')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'insurance'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Car className="w-4 h-4" />
                <span>{language === 'ar' ? 'التأمين' : 'Insurance'}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('operating-cards')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'operating-cards'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CreditCard className="w-4 h-4" />
                <span>{language === 'ar' ? 'كروت التشغيل' : 'Operating Cards'}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('driver-cards')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'driver-cards'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <User className="w-4 h-4" />
                <span>{language === 'ar' ? 'بطاقات السائقين' : 'Driver Cards'}</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* لوحة المعلومات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* إجمالي التفاويض */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'إجمالي التفاويض' : 'Total Authorizations'}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalAuthorizations}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {language === 'ar' ? `من أصل ${stats.totalVehicles} مركبة` : `out of ${stats.totalVehicles} vehicles`}
              </p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* الوثائق المنتهية */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'وثائق منتهية' : 'Expired Documents'}
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.expiredDocuments}
              </p>
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                {language === 'ar' ? 'تحتاج تجديد فوري' : 'Need immediate renewal'}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* الوثائق التي تنتهي قريباً */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'تنتهي قريباً' : 'Expiring Soon'}
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.expiringSoonDocuments}
              </p>
              <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-1">
                {language === 'ar' ? 'خلال 30 يوم' : 'Within 30 days'}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        {/* الوثائق الصالحة */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'وثائق صالحة' : 'Valid Documents'}
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.validDocuments}
              </p>
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                {language === 'ar' ? 'جميع الوثائق سارية' : 'All documents valid'}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* تنبيهات مهمة */}
      {(stats.expiredDocuments > 0 || stats.expiringSoonDocuments > 0 || stats.vehiclesWithoutAuth > 0) && (
        <div className="mb-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  {language === 'ar' ? 'تنبيهات مهمة' : 'Important Alerts'}
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <ul className="list-disc list-inside space-y-1">
                    {stats.expiredDocuments > 0 && (
                      <li>
                        {language === 'ar'
                          ? `${stats.expiredDocuments} مركبة لديها وثائق منتهية الصلاحية`
                          : `${stats.expiredDocuments} vehicles have expired documents`
                        }
                      </li>
                    )}
                    {stats.expiringSoonDocuments > 0 && (
                      <li>
                        {language === 'ar'
                          ? `${stats.expiringSoonDocuments} مركبة لديها وثائق تنتهي قريباً`
                          : `${stats.expiringSoonDocuments} vehicles have documents expiring soon`
                        }
                      </li>
                    )}
                    {stats.vehiclesWithoutAuth > 0 && (
                      <li>
                        {language === 'ar'
                          ? `${stats.vehiclesWithoutAuth} مركبة بدون تفاويض`
                          : `${stats.vehiclesWithoutAuth} vehicles without authorizations`
                        }
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* المحتوى حسب التبويب المختار */}
      {activeTab === 'permits' ? (
        <VehiclePermitsList />
      ) : activeTab === 'insurance' ? (
        <VehicleInsuranceList />
      ) : activeTab === 'operating-cards' ? (
        <VehicleOperatingCardList />
      ) : activeTab === 'driver-cards' ? (
        <DriverCardList ref={driverCardListRef} />
      ) : (
        <>
          {/* إحصائيات تفصيلية لكل نوع وثيقة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* إحصائيات الاستمارة */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {language === 'ar' ? 'الاستمارة' : 'Registration'}
            </h3>
            <FileText className="w-4 h-4 text-gray-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-green-600 dark:text-green-400">
                {language === 'ar' ? 'صالحة' : 'Valid'}
              </span>
              <span className="font-medium">
                {authorizations.filter(a => a.registrationStatus === 'valid').length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-yellow-600 dark:text-yellow-400">
                {language === 'ar' ? 'تنتهي قريباً' : 'Expiring Soon'}
              </span>
              <span className="font-medium">
                {authorizations.filter(a => a.registrationStatus === 'expiring_soon').length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-red-600 dark:text-red-400">
                {language === 'ar' ? 'منتهية' : 'Expired'}
              </span>
              <span className="font-medium">
                {authorizations.filter(a => a.registrationStatus === 'expired').length}
              </span>
            </div>
          </div>
        </div>

        {/* إحصائيات الفحص الدوري */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {language === 'ar' ? 'الفحص الدوري' : 'Inspection'}
            </h3>
            <CheckCircle className="w-4 h-4 text-gray-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-green-600 dark:text-green-400">
                {language === 'ar' ? 'صالح' : 'Valid'}
              </span>
              <span className="font-medium">
                {authorizations.filter(a => a.inspectionStatus === 'valid').length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-yellow-600 dark:text-yellow-400">
                {language === 'ar' ? 'ينتهي قريباً' : 'Expiring Soon'}
              </span>
              <span className="font-medium">
                {authorizations.filter(a => a.inspectionStatus === 'expiring_soon').length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-red-600 dark:text-red-400">
                {language === 'ar' ? 'منتهي' : 'Expired'}
              </span>
              <span className="font-medium">
                {authorizations.filter(a => a.inspectionStatus === 'expired').length}
              </span>
            </div>
          </div>
        </div>

        {/* إحصائيات كرت التشغيل */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {language === 'ar' ? 'كرت التشغيل' : 'Operating Card'}
            </h3>
            <Car className="w-4 h-4 text-gray-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-green-600 dark:text-green-400">
                {language === 'ar' ? 'صالح' : 'Valid'}
              </span>
              <span className="font-medium">
                {authorizations.filter(a => a.operatingCardStatus === 'valid').length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-yellow-600 dark:text-yellow-400">
                {language === 'ar' ? 'ينتهي قريباً' : 'Expiring Soon'}
              </span>
              <span className="font-medium">
                {authorizations.filter(a => a.operatingCardStatus === 'expiring_soon').length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-red-600 dark:text-red-400">
                {language === 'ar' ? 'منتهي' : 'Expired'}
              </span>
              <span className="font-medium">
                {authorizations.filter(a => a.operatingCardStatus === 'expired').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'المركبة' : 'Vehicle'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'الاستمارة' : 'Registration'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'الفحص الدوري' : 'Inspection'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'كرت التشغيل' : 'Operating Card'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {authorizations.map((authorization) => {
                const vehicle = getVehicleInfo(authorization.vehicleId);
                return (
                  <tr key={authorization.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="font-medium">{vehicle?.plateNumber}</div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {vehicle?.brand} {vehicle?.model} ({vehicle?.year})
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {getStatusIcon(authorization.registrationStatus)}
                        <div className="text-sm">
                          <div className="text-gray-900 dark:text-white">
                            {getStatusText(authorization.registrationStatus)}
                          </div>
                          {authorization.registrationExpiryDate && (
                            <div className="text-gray-500 dark:text-gray-400">
                              {new Date(authorization.registrationExpiryDate).toLocaleDateString('ar-SA')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {getStatusIcon(authorization.inspectionStatus)}
                        <div className="text-sm">
                          <div className="text-gray-900 dark:text-white">
                            {getStatusText(authorization.inspectionStatus)}
                          </div>
                          {authorization.inspectionExpiryDate && (
                            <div className="text-gray-500 dark:text-gray-400">
                              {new Date(authorization.inspectionExpiryDate).toLocaleDateString('ar-SA')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {getStatusIcon(authorization.operatingCardStatus)}
                        <div className="text-sm">
                          <div className="text-gray-900 dark:text-white">
                            {getStatusText(authorization.operatingCardStatus)}
                          </div>
                          {authorization.operatingCardExpiryDate && (
                            <div className="text-gray-500 dark:text-gray-400">
                              {new Date(authorization.operatingCardExpiryDate).toLocaleDateString('ar-SA')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleEditAuthorization(authorization)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAuthorization(authorization.id)}
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
      </div>

      {authorizations.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {language === 'ar' ? 'لا توجد تفاويض' : 'No authorizations'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {language === 'ar' ? 'ابدأ بإضافة تفويض جديد للمركبات' : 'Get started by adding a new vehicle authorization'}
          </p>
        </div>
      )}
        </>
      )}

      {/* نموذج إضافة/تعديل الوثيقة */}
      {showForm && (
        <VehicleAuthorizationForm
          authorization={editingAuthorization}
          onSave={handleSaveAuthorization}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default VehicleAuthorizationsList;
