import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { VehicleAuthorization, Vehicle } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface VehicleAuthorizationFormProps {
  authorization: VehicleAuthorization | null;
  vehicles: Vehicle[];
  onSave: (authorization: Omit<VehicleAuthorization, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const VehicleAuthorizationForm: React.FC<VehicleAuthorizationFormProps> = ({
  authorization,
  vehicles,
  onSave,
  onCancel
}) => {
  const { language } = useTheme();
  
  const [formData, setFormData] = useState<Omit<VehicleAuthorization, 'id' | 'createdAt' | 'updatedAt'>>({
    vehicleId: authorization?.vehicleId || '',
    registrationExpiryDate: authorization?.registrationExpiryDate || '',
    registrationStatus: authorization?.registrationStatus || 'valid',
    inspectionExpiryDate: authorization?.inspectionExpiryDate || '',
    inspectionStatus: authorization?.inspectionStatus || 'valid',
    operatingCardExpiryDate: authorization?.operatingCardExpiryDate || '',
    operatingCardStatus: authorization?.operatingCardStatus || 'valid'
  });

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // تحديث حالة الوثائق تلقائياً بناءً على تاريخ الانتهاء
    const today = new Date();
    const updatedFormData = {
      ...formData,
      registrationStatus: formData.registrationExpiryDate && new Date(formData.registrationExpiryDate) > today ? 'valid' : 'expired',
      inspectionStatus: formData.inspectionExpiryDate && new Date(formData.inspectionExpiryDate) > today ? 'valid' : 'expired',
      operatingCardStatus: formData.operatingCardExpiryDate && new Date(formData.operatingCardExpiryDate) > today ? 'valid' : 'expired'
    } as typeof formData;
    
    onSave(updatedFormData);
  };

  const getSelectedVehicle = () => {
    return vehicles.find(v => v.id === formData.vehicleId);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {authorization 
            ? (language === 'ar' ? 'تعديل تفويض المركبة' : 'Edit Vehicle Authorization')
            : (language === 'ar' ? 'إضافة تفويض مركبة جديد' : 'Add New Vehicle Authorization')
          }
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* اختيار المركبة */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'المركبة *' : 'Vehicle *'}
            </label>
            <select
              value={formData.vehicleId}
              onChange={(e) => handleInputChange('vehicleId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">{language === 'ar' ? 'اختر المركبة' : 'Select Vehicle'}</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plateNumber} - {vehicle.brand} {vehicle.model} ({vehicle.year})
                </option>
              ))}
            </select>
          </div>

          {/* معلومات المركبة المختارة */}
          {getSelectedVehicle() && (
            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {language === 'ar' ? 'معلومات المركبة' : 'Vehicle Information'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'رقم اللوحة:' : 'Plate Number:'}</span>
                  <div className="font-medium text-gray-900 dark:text-white">{getSelectedVehicle()?.plateNumber}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الماركة:' : 'Brand:'}</span>
                  <div className="font-medium text-gray-900 dark:text-white">{getSelectedVehicle()?.brand}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الموديل:' : 'Model:'}</span>
                  <div className="font-medium text-gray-900 dark:text-white">{getSelectedVehicle()?.model}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'السنة:' : 'Year:'}</span>
                  <div className="font-medium text-gray-900 dark:text-white">{getSelectedVehicle()?.year}</div>
                </div>
              </div>
            </div>
          )}

          {/* الاستمارة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'تاريخ انتهاء الاستمارة' : 'Registration Expiry Date'}
            </label>
            <input
              type="date"
              value={formData.registrationExpiryDate}
              onChange={(e) => handleInputChange('registrationExpiryDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'حالة الاستمارة' : 'Registration Status'}
            </label>
            <select
              value={formData.registrationStatus}
              onChange={(e) => handleInputChange('registrationStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="valid">{language === 'ar' ? 'صالح' : 'Valid'}</option>
              <option value="expiring_soon">{language === 'ar' ? 'ينتهي قريباً' : 'Expiring Soon'}</option>
              <option value="expired">{language === 'ar' ? 'منتهي الصلاحية' : 'Expired'}</option>
            </select>
          </div>

          {/* الفحص الدوري */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'تاريخ انتهاء الفحص الدوري' : 'Inspection Expiry Date'}
            </label>
            <input
              type="date"
              value={formData.inspectionExpiryDate}
              onChange={(e) => handleInputChange('inspectionExpiryDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'حالة الفحص الدوري' : 'Inspection Status'}
            </label>
            <select
              value={formData.inspectionStatus}
              onChange={(e) => handleInputChange('inspectionStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="valid">{language === 'ar' ? 'صالح' : 'Valid'}</option>
              <option value="expiring_soon">{language === 'ar' ? 'ينتهي قريباً' : 'Expiring Soon'}</option>
              <option value="expired">{language === 'ar' ? 'منتهي الصلاحية' : 'Expired'}</option>
            </select>
          </div>

          {/* كرت التشغيل */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'تاريخ انتهاء كرت التشغيل' : 'Operating Card Expiry Date'}
            </label>
            <input
              type="date"
              value={formData.operatingCardExpiryDate}
              onChange={(e) => handleInputChange('operatingCardExpiryDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'حالة كرت التشغيل' : 'Operating Card Status'}
            </label>
            <select
              value={formData.operatingCardStatus}
              onChange={(e) => handleInputChange('operatingCardStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="valid">{language === 'ar' ? 'صالح' : 'Valid'}</option>
              <option value="expiring_soon">{language === 'ar' ? 'ينتهي قريباً' : 'Expiring Soon'}</option>
              <option value="expired">{language === 'ar' ? 'منتهي الصلاحية' : 'Expired'}</option>
            </select>
          </div>
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex items-center justify-end space-x-4 rtl:space-x-reverse mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
          >
            <X className="w-4 h-4" />
            <span>{language === 'ar' ? 'إلغاء' : 'Cancel'}</span>
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'ar' ? 'حفظ' : 'Save'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleAuthorizationForm;
