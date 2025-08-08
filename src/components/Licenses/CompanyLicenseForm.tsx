import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, FileText } from 'lucide-react';
import { CompanyLicense } from '../../types';

interface CompanyLicenseFormProps {
  license: CompanyLicense | null;
  onSave: (license: Omit<CompanyLicense, 'id' | 'status'>) => void;
  onCancel: () => void;
}

const CompanyLicenseForm: React.FC<CompanyLicenseFormProps> = ({
  license,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    type: 'commercial_register' as CompanyLicense['type'],
    name: '',
    number: '',
    expiryDate: '',
    attachments: [] as string[]
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (license) {
      setFormData({
        type: license.type,
        name: license.name,
        number: license.number,
        expiryDate: license.expiryDate,
        attachments: license.attachments || []
      });
    }
  }, [license]);

  const licenseTypes = [
    { value: 'commercial_register', label: 'السجل التجاري' },
    { value: 'municipal_license', label: 'الرخصة البلدية' },
    { value: 'transport_authority', label: 'ترخيص هيئة النقل' },
    { value: 'civil_defense', label: 'شهادة الدفاع المدني' },
    { value: 'tax_certificate', label: 'الشهادة الضريبية' }
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم الترخيص مطلوب';
    }

    if (!formData.number.trim()) {
      newErrors.number = 'رقم الترخيص مطلوب';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'تاريخ الانتهاء مطلوب';
    } else {
      const today = new Date();
      const expiryDate = new Date(formData.expiryDate);
      if (expiryDate < today) {
        newErrors.expiryDate = 'تاريخ الانتهاء يجب أن يكون في المستقبل';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // إزالة رسالة الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleTypeChange = (type: CompanyLicense['type']) => {
    setFormData(prev => ({
      ...prev,
      type,
      name: licenseTypes.find(t => t.value === type)?.label || ''
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // في التطبيق الحقيقي، ستقوم برفع الملفات إلى الخادم
      // هنا سنحاكي إضافة أسماء الملفات
      const newAttachments = Array.from(files).map(file => file.name);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* رأس النموذج */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {license ? 'تعديل الترخيص' : 'إضافة ترخيص جديد'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* محتوى النموذج */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* نوع الترخيص */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نوع الترخيص *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value as CompanyLicense['type'])}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {licenseTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* اسم الترخيص */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسم الترخيص *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="أدخل اسم الترخيص"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* رقم الترخيص */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رقم الترخيص *
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => handleInputChange('number', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.number ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="أدخل رقم الترخيص"
            />
            {errors.number && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.number}</p>
            )}
          </div>

          {/* تاريخ الانتهاء */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تاريخ الانتهاء *
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expiryDate}</p>
            )}
          </div>

          {/* المرفقات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              المرفقات
            </label>
            
            {/* زر رفع الملفات */}
            <div className="mb-4">
              <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">انقر لرفع الملفات</span> أو اسحب وأفلت
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC, DOCX, JPG, PNG (الحد الأقصى 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* قائمة المرفقات */}
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  الملفات المرفقة ({formData.attachments.length})
                </h4>
                {formData.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {attachment}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {license ? 'تحديث' : 'إضافة'} الترخيص
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyLicenseForm;
