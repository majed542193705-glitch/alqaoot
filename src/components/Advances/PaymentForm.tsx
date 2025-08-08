import React, { useState } from 'react';
import { Save, X, Upload, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { Advance, Payment } from '../../types';

interface PaymentFormProps {
  advance: Advance;
  onSave: (payment: Omit<Payment, 'id' | 'advanceId'>) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ advance, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Payment, 'id' | 'advanceId'>>({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'bank_transfer',
    operationNumber: '',
    attachment: ''
  });

  const [isFullPayment, setIsFullPayment] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'مبلغ السداد مطلوب ويجب أن يكون أكبر من صفر';
    } else if (formData.amount > advance.remainingAmount) {
      newErrors.amount = 'مبلغ السداد لا يمكن أن يكون أكبر من المبلغ المتبقي';
    }

    if (!formData.date) {
      newErrors.date = 'تاريخ السداد مطلوب';
    }

    if (formData.type === 'bank_transfer' && !formData.operationNumber.trim()) {
      newErrors.operationNumber = 'رقم العملية مطلوب للتحويل البنكي';
    }

    if (formData.type === 'check' && !formData.operationNumber.trim()) {
      newErrors.operationNumber = 'رقم الشيك مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // تأكيد السداد الكامل
    if (isFullPayment && formData.amount === advance.remainingAmount) {
      if (!confirm('هل أنت متأكد من سداد المبلغ المتبقي بالكامل؟ سيتم إغلاق هذه السلفة نهائياً.')) {
        return;
      }
    }

    onSave(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // إزالة رسالة الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFullPayment = () => {
    setIsFullPayment(true);
    setFormData(prev => ({ ...prev, amount: advance.remainingAmount }));
  };

  const handlePartialPayment = () => {
    setIsFullPayment(false);
    setFormData(prev => ({ ...prev, amount: 0 }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('نوع الملف غير مدعوم. يرجى اختيار ملف PDF أو صورة (JPG, PNG)');
        return;
      }

      // التحقق من حجم الملف (أقل من 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      setAttachmentFile(file);

      // في التطبيق الحقيقي، ستقوم برفع الملف إلى الخادم
      // هنا سنحاكي حفظ اسم الملف
      setFormData(prev => ({ ...prev, attachment: file.name }));
    }
  };

  // بيانات تجريبية للموظفين
  const employees = [
    { id: '1', name: 'أحمد محمد علي السعيد' },
    { id: '2', name: 'محمد أحمد علي' }
  ];

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'غير محدد';
  };

  const getAdvanceTypeText = (type: string) => {
    switch (type) {
      case 'personal': return 'سلفة شخصية';
      case 'dues': return 'مستحقات';
      case 'transfer_documents': return 'وثائق نقل';
      case 'medical_insurance': return 'تأمين طبي';
      case 'other': return 'أخرى';
      default: return type;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          إضافة دفعة سداد
        </h1>
        <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-lg font-medium text-blue-900 dark:text-blue-100">
            تفاصيل السلفة
          </h2>
          <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
            <p><strong>الموظف:</strong> {getEmployeeName(advance.employeeId)}</p>
            <p><strong>نوع السلفة:</strong> {getAdvanceTypeText(advance.type)}</p>
            <p><strong>المبلغ الإجمالي:</strong> {advance.amount.toLocaleString()} ريال</p>
            <p><strong>المبلغ المتبقي:</strong> {advance.remainingAmount.toLocaleString()} ريال</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* خيارات نوع السداد */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">نوع السداد</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handlePartialPayment}
              className={`p-4 border-2 rounded-lg transition-all ${
                !isFullPayment
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="font-medium">سداد جزئي</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                سداد مبلغ محدد من السلفة
              </p>
            </button>

            <button
              type="button"
              onClick={handleFullPayment}
              className={`p-4 border-2 rounded-lg transition-all ${
                isFullPayment
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-medium">سداد كامل</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                سداد المبلغ المتبقي بالكامل ({advance.remainingAmount.toLocaleString()} ريال)
              </p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              مبلغ السداد (ريال) *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } ${isFullPayment ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                min="0"
                max={advance.remainingAmount}
                step="0.01"
                readOnly={isFullPayment}
                required
              />
              {isFullPayment && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.amount}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              الحد الأقصى: {advance.remainingAmount.toLocaleString()} ريال
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تاريخ السداد *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              required
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.date}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              طريقة السداد *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="bank_transfer">تحويل بنكي</option>
              <option value="cash">نقداً</option>
              <option value="check">شيك</option>
              <option value="credit_card">بطاقة ائتمان</option>
              <option value="receipt">سند قبض</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {formData.type === 'bank_transfer' && 'رقم العملية *'}
              {formData.type === 'check' && 'رقم الشيك *'}
              {formData.type === 'credit_card' && 'رقم المرجع'}
              {formData.type === 'receipt' && 'رقم السند'}
              {(formData.type === 'cash' || formData.type === 'other') && 'رقم المرجع'}
            </label>
            <input
              type="text"
              value={formData.operationNumber}
              onChange={(e) => handleInputChange('operationNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.operationNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder={
                formData.type === 'bank_transfer' ? 'أدخل رقم العملية' :
                formData.type === 'check' ? 'أدخل رقم الشيك' :
                formData.type === 'receipt' ? 'أدخل رقم السند' :
                'أدخل رقم المرجع (اختياري)'
              }
              required={formData.type === 'bank_transfer' || formData.type === 'check'}
            />
            {errors.operationNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.operationNumber}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              مرفق إثبات السداد
            </label>
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">انقر لاختيار الملف</span> أو اسحب وأفلت
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  PDF, JPG, PNG حتى 5MB
                </p>
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {/* عرض الملف المرفوع */}
            {attachmentFile && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      تم رفع الملف: {attachmentFile.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentFile(null);
                      setFormData(prev => ({ ...prev, attachment: '' }));
                    }}
                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
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
            <span>حفظ الدفعة</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;