import React, { useState } from 'react';
import { X, Upload, FileText, Car, Calendar, Shield } from 'lucide-react';
import { VehiclePermit, Vehicle } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface VehiclePermitFormProps {
  permit?: VehiclePermit;
  onSave: (permit: Omit<VehiclePermit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const VehiclePermitForm: React.FC<VehiclePermitFormProps> = ({
  permit,
  onSave,
  onCancel
}) => {
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

  const [formData, setFormData] = useState({
    vehicleId: permit?.vehicleId || '',
    permitType: permit?.permitType || 'local' as 'local' | 'external' | 'actual_user',
    startDate: permit?.startDate || '',
    endDate: permit?.endDate || '',
    attachments: permit?.attachments || [],
    notes: permit?.notes || ''
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // تحويل الملفات إلى URLs (في التطبيق الحقيقي سيتم رفعها للخادم)
    const attachmentUrls = selectedFiles.map(file => URL.createObjectURL(file));
    
    const permitData = {
      ...formData,
      attachments: [...formData.attachments, ...attachmentUrls],
      endDate: formData.permitType === 'actual_user' ? undefined : formData.endDate
    };

    onSave(permitData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {permit
                ? (language === 'ar' ? 'تعديل التصريح' : 'Edit Permit')
                : (language === 'ar' ? 'إضافة تصريح جديد' : 'Add New Permit')
              }
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* اختيار المركبة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'رقم المركبة' : 'Vehicle Number'}
            </label>
            <select
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">
                {language === 'ar' ? 'اختر المركبة' : 'Select Vehicle'}
              </option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plateNumber} - {vehicle.model}
                </option>
              ))}
            </select>
          </div>

          {/* تفاصيل المركبة المختارة */}
          {selectedVehicle && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                <Car className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {language === 'ar' ? 'تفاصيل المركبة' : 'Vehicle Details'}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'رقم اللوحة:' : 'Plate Number:'}
                  </span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {selectedVehicle.plateNumber}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'الموديل:' : 'Model:'}
                  </span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {selectedVehicle.model}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'السنة:' : 'Year:'}
                  </span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {selectedVehicle.year}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'اللون:' : 'Color:'}
                  </span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {selectedVehicle.color}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* نوع التفويض */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'نوع التفويض' : 'Permit Type'}
            </label>
            <select
              value={formData.permitType}
              onChange={(e) => setFormData({ 
                ...formData, 
                permitType: e.target.value as 'local' | 'external' | 'actual_user',
                endDate: e.target.value === 'actual_user' ? '' : formData.endDate
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="local">{getPermitTypeText('local')}</option>
              <option value="external">{getPermitTypeText('external')}</option>
              <option value="actual_user">{getPermitTypeText('actual_user')}</option>
            </select>
          </div>

          {/* التواريخ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* تاريخ البداية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'تاريخ بداية التفويض' : 'Start Date'}
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* تاريخ النهاية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'تاريخ انتهاء التفويض' : 'End Date'}
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={formData.permitType === 'actual_user'}
                required={formData.permitType !== 'actual_user'}
              />
              {formData.permitType === 'actual_user' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {language === 'ar' 
                    ? 'المستخدم الفعلي لا يحتاج تاريخ انتهاء' 
                    : 'Actual user does not need end date'
                  }
                </p>
              )}
            </div>
          </div>

          {/* المرفقات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'المرفقات' : 'Attachments'}
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ar' 
                    ? 'اضغط لرفع الملفات أو اسحبها هنا' 
                    : 'Click to upload files or drag them here'
                  }
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, JPG, PNG, DOC, DOCX
                </span>
              </label>
            </div>
            
            {/* عرض الملفات المختارة */}
            {selectedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ملاحظات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'ملاحظات' : 'Notes'}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={language === 'ar' ? 'أدخل أي ملاحظات إضافية...' : 'Enter any additional notes...'}
            />
          </div>

          {/* الأزرار */}
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {permit 
                ? (language === 'ar' ? 'تحديث' : 'Update')
                : (language === 'ar' ? 'إضافة' : 'Add')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehiclePermitForm;
