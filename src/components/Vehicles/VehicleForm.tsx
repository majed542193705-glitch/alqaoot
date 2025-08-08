import React, { useState } from 'react';
import { Save, X, Upload } from 'lucide-react';
import { Vehicle } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface VehicleFormProps {
  vehicle: Vehicle | null;
  onSave: (vehicle: Omit<Vehicle, 'id' | 'serialNumber'>) => void;
  onCancel: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSave, onCancel }) => {
  const { language } = useTheme();

  // قائمة الموظفين (يمكن جلبها من API في التطبيق الحقيقي)
  const employees = [
    { id: '1', name: 'أحمد محمد علي' },
    { id: '2', name: 'فاطمة أحمد السالم' },
    { id: '3', name: 'محمد عبدالله الخالد' },
    { id: '4', name: 'نورا سعد المطيري' },
    { id: '5', name: 'عبدالرحمن فهد العتيبي' }
  ];

  const [formData, setFormData] = useState<Omit<Vehicle, 'id' | 'serialNumber'>>({
    ownerId: vehicle?.ownerId || '',
    plateNumber: vehicle?.plateNumber || '',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    color: vehicle?.color || '',
    type: vehicle?.type || 'sedan',
    status: vehicle?.status || 'working',
    mileage: vehicle?.mileage || 0,
    lastMaintenanceDate: vehicle?.lastMaintenanceDate || '',
    nextMaintenanceDate: vehicle?.nextMaintenanceDate || '',
    ownership: vehicle?.ownership || 'company',
    ownershipType: vehicle?.ownershipType || 'alqaoot_company',
    purchaseDate: vehicle?.purchaseDate || '',
    value: vehicle?.value || 0,
    saleDate: vehicle?.saleDate || '',
    saleValue: vehicle?.saleValue || 0
  });

  const [activeTab, setActiveTab] = useState('basic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // إذا لم يكن نوع الملكية "موظف"، قم بتعيين ownerId فارغ
    const ownerId = formData.ownershipType === 'employee' ? formData.ownerId : '';

    const updatedFormData = {
      ...formData,
      ownerId
    };

    onSave(updatedFormData);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // إذا تم تغيير نوع الملكية وليس "موظف"، امسح ownerId
      if (field === 'ownershipType' && value !== 'employee') {
        newData.ownerId = '';
      }

      return newData;
    });
  };

  const tabs = [
    { id: 'basic', label: language === 'ar' ? 'البيانات الأساسية' : 'Basic Information' },
    { id: 'maintenance', label: language === 'ar' ? 'الصيانة' : 'Maintenance' },
    { id: 'financial', label: language === 'ar' ? 'البيانات المالية' : 'Financial Information' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {vehicle ? 'تعديل مركبة' : 'إضافة مركبة جديدة'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* التبويبات */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 rtl:space-x-reverse px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* البيانات الأساسية */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* نوع الملكية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'ar' ? 'نوع الملكية *' : 'Ownership Type *'}
                </label>
                <select
                  value={formData.ownershipType}
                  onChange={(e) => handleInputChange('ownershipType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="alqaoot_company">
                    {language === 'ar' ? 'مؤسسة القعوط للخدمات اللوجستية' : 'Al-Qaoot Logistics Services'}
                  </option>
                  <option value="bank">
                    {language === 'ar' ? 'البنوك' : 'Banks'}
                  </option>
                  <option value="employee">
                    {language === 'ar' ? 'موظف' : 'Employee'}
                  </option>
                </select>
              </div>

              {/* اسم المالك - يظهر فقط عند اختيار "موظف" */}
              {formData.ownershipType === 'employee' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'ar' ? 'اسم المالك *' : 'Owner Name *'}
                  </label>
                  <select
                    value={formData.ownerId}
                    onChange={(e) => handleInputChange('ownerId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">{language === 'ar' ? 'اختر الموظف' : 'Select Employee'}</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رقم اللوحة *
                </label>
                <input
                  type="text"
                  value={formData.plateNumber}
                  onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="ABC-123"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الماركة *
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="تويوتا"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الموديل *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="كامري"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  سنة الصنع *
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اللون
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="أبيض"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نوع المركبة *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="sedan">سيدان</option>
                  <option value="suv">دفع رباعي</option>
                  <option value="truck">شاحنة</option>
                  <option value="dyna">دينا</option>
                  <option value="van">فان</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  حالة المركبة
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="working">تعمل</option>
                  <option value="broken">متعطلة</option>
                  <option value="sold">مباعة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المسافة المقطوعة (كم)
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ملكية المركبة
                </label>
                <select
                  value={formData.ownership}
                  onChange={(e) => handleInputChange('ownership', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="company">المؤسسة</option>
                  <option value="external">خارجي</option>
                </select>
              </div>
            </div>
          )}

          {/* الصيانة */}
          {activeTab === 'maintenance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ آخر صيانة
                </label>
                <input
                  type="date"
                  value={formData.lastMaintenanceDate}
                  onChange={(e) => handleInputChange('lastMaintenanceDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ الصيانة القادمة
                </label>
                <input
                  type="date"
                  value={formData.nextMaintenanceDate}
                  onChange={(e) => handleInputChange('nextMaintenanceDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}



          {/* البيانات المالية */}
          {activeTab === 'financial' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'ar' ? 'تاريخ شراء المركبة' : 'Purchase Date'}
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'ar' ? 'قيمة شراء المركبة (ريال)' : 'Purchase Value (SAR)'}
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* حقول البيع - تظهر فقط عند اختيار حالة "مباعة" */}
              {formData.status === 'sold' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? 'تاريخ بيع المركبة' : 'Sale Date'}
                    </label>
                    <input
                      type="date"
                      value={formData.saleDate}
                      onChange={(e) => handleInputChange('saleDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? 'قيمة بيع المركبة (ريال)' : 'Sale Value (SAR)'}
                    </label>
                    <input
                      type="number"
                      value={formData.saleValue}
                      onChange={(e) => handleInputChange('saleValue', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* عرض الربح أو الخسارة */}
                  {formData.value > 0 && formData.saleValue > 0 && (
                    <div className="md:col-span-2">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {language === 'ar' ? 'نتيجة البيع:' : 'Sale Result:'}
                          </span>
                          <span className={`text-lg font-bold ${
                            formData.saleValue >= formData.value
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {formData.saleValue >= formData.value
                              ? (language === 'ar' ? 'ربح' : 'Profit')
                              : (language === 'ar' ? 'خسارة' : 'Loss')
                            }: {' '}
                            {Math.abs(formData.saleValue - formData.value).toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex items-center justify-end space-x-4 rtl:space-x-reverse px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
          >
            <X className="w-4 h-4" />
            <span>إلغاء</span>
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Save className="w-4 h-4" />
            <span>حفظ</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;