import React, { useState, useEffect } from 'react';
import { Save, X, Upload } from 'lucide-react';
import { OperatingExpense } from '../../types';

interface OperatingExpenseFormProps {
  expense: OperatingExpense | null;
  onSave: (expense: Omit<OperatingExpense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const OperatingExpenseForm: React.FC<OperatingExpenseFormProps> = ({ expense, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<OperatingExpense, 'id' | 'createdAt' | 'updatedAt'>>({
    category: expense?.category || 'company_expenses',
    date: expense?.date || new Date().toISOString().split('T')[0],
    type: expense?.type || 'office_rent',
    amount: expense?.amount || 0,
    description: expense?.description || '',
    employeeId: expense?.employeeId || '',
    attachments: expense?.attachments || []
  });

  // بيانات تجريبية للموظفين
  const employees = [
    { id: '1', name: 'أحمد محمد علي السعيد' },
    { id: '2', name: 'فاطمة علي محمد الزهراني' },
    { id: '3', name: 'محمد أحمد علي' },
    { id: '4', name: 'علي محمد أحمد' }
  ];

  const expenseTypes = {
    employee_expenses: [
      { value: 'salary', label: 'راتب' },
      { value: 'residence_renewal_fees', label: 'رسوم تجديد اقامة' },
      { value: 'labor_office_fees', label: 'رسوم مكتب عمل' }
    ],
    company_expenses: [
      { value: 'electricity_bill', label: 'فاتورة كهرباء' },
      { value: 'office_rent', label: 'ايجار مكتب' },
      { value: 'tam_subscription', label: 'اشتراك تم' },
      { value: 'qiwa_subscription', label: 'اشتراك قوى' },
      { value: 'internet_subscription', label: 'اشتراك انترنت' }
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: 'employee_expenses' | 'company_expenses') => {
    const newType = expenseTypes[category][0]?.value || 'office_rent';
    setFormData(prev => ({
      ...prev,
      category,
      type: newType as any,
      employeeId: category === 'company_expenses' ? '' : prev.employeeId
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
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

  const currentExpenseTypes = expenseTypes[formData.category];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {expense ? 'تعديل مصروف' : 'إضافة مصروف جديد'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* فئة المصروف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              فئة المصروف *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value as 'employee_expenses' | 'company_expenses')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="company_expenses">مصاريف المؤسسة</option>
              <option value="employee_expenses">مصاريف موظف</option>
            </select>
          </div>

          {/* اسم الموظف - يظهر فقط عند اختيار مصاريف موظف */}
          {formData.category === 'employee_expenses' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم الموظف *
              </label>
              <select
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">اختر الموظف</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* التاريخ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              التاريخ *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* نوع المصروف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نوع المصروف *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              {currentExpenseTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* المبلغ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              المبلغ (ريال) *
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

          {/* الوصف */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="تفاصيل إضافية عن المصروف..."
            />
          </div>

          {/* المرفقات */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              المرفقات
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  انقر لرفع الملفات أو اسحبها هنا
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  PDF, JPG, PNG, DOC (حد أقصى 10MB لكل ملف)
                </span>
              </label>
            </div>

            {/* عرض المرفقات المحملة */}
            {formData.attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الملفات المرفقة:
                </h4>
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{file}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

export default OperatingExpenseForm;
