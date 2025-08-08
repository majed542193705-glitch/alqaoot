import React, { useState } from 'react';
import { Plus, Edit, Trash2, CreditCard, Car, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { VehicleOperatingCard, Vehicle } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import VehicleOperatingCardForm from './VehicleOperatingCardForm';

const VehicleOperatingCardList: React.FC = () => {
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
      ownerId: '1',
      ownerName: 'أحمد محمد علي',
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
      ownerId: '2',
      ownerName: 'فاطمة أحمد سالم',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  // بيانات كروت التشغيل التجريبية
  const [operatingCards, setOperatingCards] = useState<VehicleOperatingCard[]>([
    {
      id: '1',
      vehicleId: '1',
      cardNumber: 'OP-2024-001',
      startDate: '2024-01-01',
      expiryDate: '2024-12-31',
      attachments: [],
      notes: 'كرت تشغيل صالح لجميع المناطق',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      vehicleId: '2',
      cardNumber: 'OP-2024-002',
      startDate: '2024-01-15',
      expiryDate: '2024-08-20',
      attachments: [],
      notes: 'كرت تشغيل للنقل الداخلي',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<VehicleOperatingCard | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCard = () => {
    setEditingCard(undefined);
    setShowForm(true);
  };

  const handleEditCard = (card: VehicleOperatingCard) => {
    setEditingCard(card);
    setShowForm(true);
  };

  const handleDeleteCard = (id: string) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الكرت؟' : 'Are you sure you want to delete this card?')) {
      setOperatingCards(operatingCards.filter(c => c.id !== id));
    }
  };

  const handleSaveCard = (cardData: Omit<VehicleOperatingCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCard) {
      // تحديث الكرت
      setOperatingCards(operatingCards.map(c => 
        c.id === editingCard.id 
          ? { ...c, ...cardData, updatedAt: new Date().toISOString() }
          : c
      ));
    } else {
      // إضافة كرت جديد
      const newCard: VehicleOperatingCard = {
        ...cardData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setOperatingCards([...operatingCards, newCard]);
    }
    setShowForm(false);
  };

  const getVehicleInfo = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const getCardStatus = (expiryDate: string) => {
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

  // فلترة كروت التشغيل
  const filteredCards = operatingCards.filter(card => {
    const vehicle = getVehicleInfo(card.vehicleId);
    const matchesSearch = !searchTerm || 
      vehicle?.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // حساب الإحصائيات
  const stats = {
    total: operatingCards.length,
    valid: operatingCards.filter(c => getCardStatus(c.expiryDate) === 'valid').length,
    expiringSoon: operatingCards.filter(c => getCardStatus(c.expiryDate) === 'expiring_soon').length,
    expired: operatingCards.filter(c => getCardStatus(c.expiryDate) === 'expired').length
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ar' ? 'كروت التشغيل' : 'Operating Cards'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {language === 'ar' ? 'إدارة كروت تشغيل المركبات' : 'Manage vehicle operating cards'}
          </p>
        </div>
        <button
          onClick={handleAddCard}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة كرت تشغيل' : 'Add Operating Card'}</span>
        </button>
      </div>

      {/* البحث */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'البحث في كروت التشغيل...' : 'Search operating cards...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'إجمالي الكروت' : 'Total Cards'}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-purple-500" />
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

      {/* جدول كروت التشغيل */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'المركبة' : 'Vehicle'}
                </th>
                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'رقم الكرت' : 'Card Number'}
                </th>
                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'تاريخ البداية' : 'Start Date'}
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
              {filteredCards.map((card) => {
                const vehicle = getVehicleInfo(card.vehicleId);
                const status = getCardStatus(card.expiryDate);
                
                return (
                  <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {card.cardNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(card.startDate).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(card.expiryDate).toLocaleDateString('ar-SA')}
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
                          onClick={() => handleEditCard(card)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
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

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {language === 'ar' ? 'لا توجد كروت تشغيل' : 'No operating cards found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'ابدأ بإضافة كرت تشغيل جديد' : 'Get started by adding a new operating card'}
            </p>
          </div>
        )}
      </div>

      {/* نموذج إضافة/تعديل كرت التشغيل */}
      {showForm && (
        <VehicleOperatingCardForm
          operatingCard={editingCard}
          onSave={handleSaveCard}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default VehicleOperatingCardList;
