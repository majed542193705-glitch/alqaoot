import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Advance } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';

interface AdvanceFormProps {
  advance: Advance | null;
  onSave: (advance: Omit<Advance, 'id' | 'payments' | 'remainingAmount'>) => void;
  onCancel: () => void;
}

const AdvanceForm: React.FC<AdvanceFormProps> = ({ advance, onSave, onCancel }) => {
  const { language } = useTheme();
  const [formData, setFormData] = useState<Omit<Advance, 'id' | 'payments' | 'remainingAmount'>>({
    employeeId: advance?.employeeId || '',
    type: advance?.type || 'personal_advance',
    customDescription: advance?.customDescription || '',
    amount: advance?.amount || 0,
    date: advance?.date || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // بيانات تجريبية للموظفين
  const employees = [
    { id: '1', name: 'أحمد محمد علي السعيد' },
    { id: '2', name: 'محمد أحمد علي' },
    { id: '3', name: 'علي محمد أحمد' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {advance ? t('editAdvance', language) : t('addAdvance', language)}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'اسم الموظف *' : 'Employee Name *'}
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">{language === 'ar' ? 'اختر الموظف' : 'Select Employee'}</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('advanceType', language)} *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">{language === 'ar' ? 'اختر نوع السلفة' : 'Select Advance Type'}</option>
              <option value="work_permit_fees">{language === 'ar' ? 'رسوم رخصة عمل' : 'Work Permit Fees'}</option>
              <option value="residence_renewal_fees">{language === 'ar' ? 'رسوم تجديد اقامة' : 'Residence Renewal Fees'}</option>
              <option value="traffic_violation_fees">{language === 'ar' ? 'رسوم مخالفة مرورية' : 'Traffic Violation Fees'}</option>
              <option value="transport_authority_violation_fees">{language === 'ar' ? 'رسوم مخالفة هيئة النقل' : 'Transport Authority Violation Fees'}</option>
              <option value="medical_insurance_fees">{t('medicalInsuranceFees', language)}</option>
              <option value="car_insurance_fees">{language === 'ar' ? 'رسوم تأمين سيارة' : 'Car Insurance Fees'}</option>
              <option value="exit_reentry_visa_fees">{language === 'ar' ? 'رسوم تأشيرة خروج وعودة' : 'Exit Re-entry Visa Fees'}</option>
              <option value="personal_advance">{t('personalAdvance', language)}</option>
              <option value="other_fees">{language === 'ar' ? 'أخرى' : 'Other'}</option>
            </select>
          </div>

          {/* حقل الوصف المخصص - يظهر عند اختيار "أخرى" */}
          {formData.type === 'other_fees' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'وصف نوع السلفة *' : 'Advance Type Description *'}
              </label>
              <input
                type="text"
                value={formData.customDescription || ''}
                onChange={(e) => handleInputChange('customDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder={language === 'ar' ? 'أدخل وصف نوع السلفة...' : 'Enter advance type description...'}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'مبلغ السلفة (ريال) *' : 'Advance Amount (SAR) *'}
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'تاريخ السلفة *' : 'Advance Date *'}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
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

export default AdvanceForm;