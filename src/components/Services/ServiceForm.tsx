import React, { useState, useEffect } from 'react';
import { Save, X, Calendar, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { ServiceRecord, Employee } from '../../types';

interface ServiceFormProps {
  service: ServiceRecord | null;
  employees: Employee[];
  onSave: (service: Omit<ServiceRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, employees, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<ServiceRecord, 'id' | 'createdAt' | 'updatedAt'>>({
    employeeId: service?.employeeId || '',
    serviceDate: service?.serviceDate || new Date().toISOString().split('T')[0],
    serviceType: service?.serviceType || 'transfer_document',
    cost: service?.cost || 0,
    paymentType: service?.paymentType || 'cash',
    description: service?.description || '',
    status: service?.status || 'unpaid'
  });

  const [paidAmount, setPaidAmount] = useState(0);
  const [isPartialPayment, setIsPartialPayment] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const serviceTypes = [
    { value: 'transfer_document', label: 'إصدار وثيقة نقل', icon: '📄' },
    { value: 'vehicle_form_renewal', label: 'تجديد استمارة مركبة', icon: '🔄' },
    { value: 'internal_vehicle_authorization', label: 'تفويض مركبة داخلي', icon: '📋' },
    { value: 'external_vehicle_authorization', label: 'تفويض مركبة خارجي', icon: '🌐' },
    { value: 'add_actual_user', label: 'إضافة مستخدم فعلي', icon: '👤' },
    { value: 'operation_card_renewal', label: 'تجديد كرت تشغيل', icon: '💳' },
    { value: 'driver_card_renewal', label: 'تجديد بطاقة سائق', icon: '🚗' },
    { value: 'chamber_of_commerce_certification', label: 'تصديق غرفة تجارية', icon: '🏢' },
    { value: 'passport_info_transfer', label: 'نقل معلومات جواز سفر', icon: '✈️' }
  ];

  const paymentTypes = [
    { value: 'cash', label: 'نقداً', icon: '💵' },
    { value: 'bank_transfer', label: 'تحويل بنكي', icon: '🏦' },
    { value: 'company_account', label: 'حساب الشركة', icon: '🏢' },
    { value: 'deducted_from_salary', label: 'خصم من الراتب', icon: '💰' }
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.employeeId) {
      newErrors.employeeId = 'يجب اختيار الموظف';
    }

    if (!formData.serviceDate) {
      newErrors.serviceDate = 'تاريخ الخدمة مطلوب';
    }

    if (!formData.cost || formData.cost <= 0) {
      newErrors.cost = 'تكلفة الخدمة يجب أن تكون أكبر من صفر';
    }

    if (isPartialPayment) {
      if (paidAmount < 0) {
        newErrors.paidAmount = 'المبلغ المسدد لا يمكن أن يكون سالباً';
      } else if (paidAmount > formData.cost) {
        newErrors.paidAmount = 'المبلغ المسدد لا يمكن أن يكون أكبر من تكلفة الخدمة';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // تحديد حالة السداد بناءً على نوع السداد
    let finalStatus = formData.status;
    if (isPartialPayment) {
      finalStatus = paidAmount >= formData.cost ? 'paid' : 'unpaid';
    }

    const serviceData = {
      ...formData,
      status: finalStatus,
      // إضافة معلومات السداد الجزئي إذا لزم الأمر
      ...(isPartialPayment && { paidAmount, remainingAmount: formData.cost - paidAmount })
    };

    onSave(serviceData);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // إزالة رسالة الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : '';
  };

  const getServiceTypeLabel = (type: string) => {
    const serviceType = serviceTypes.find(st => st.value === type);
    return serviceType ? serviceType.label : type;
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
          {service ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
          {service ? 'تعديل بيانات الخدمة المحددة' : 'إضافة خدمة جديدة للموظف'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* اختيار الموظف */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الموظف *
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base ${
                errors.employeeId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              required
            >
              <option value="">اختر الموظف</option>
              {employees.filter(emp => emp.isActive).map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.employeeNumber} - {employee.firstName} {employee.lastName} ({employee.jobTitle || 'غير محدد'})
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.employeeId}
              </p>
            )}
          </div>

          {/* تاريخ الخدمة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تاريخ الخدمة *
            </label>
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={formData.serviceDate}
                onChange={(e) => handleInputChange('serviceDate', e.target.value)}
                className={`w-full pl-3 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.serviceDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                required
              />
            </div>
            {errors.serviceDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.serviceDate}
              </p>
            )}
          </div>

          {/* تكلفة الخدمة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تكلفة الخدمة (ريال) *
            </label>
            <div className="relative">
              <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                className={`w-full pl-3 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.cost ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                min="0"
                step="0.01"
                required
              />
            </div>
            {errors.cost && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.cost}
              </p>
            )}
          </div>
        </div>

        {/* نوع الخدمة */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            نوع الخدمة *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {serviceTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('serviceType', type.value)}
                className={`p-3 border-2 rounded-lg transition-all text-center ${
                  formData.serviceType === type.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* نوع السداد */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            نوع السداد *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {paymentTypes.map((payment) => (
              <button
                key={payment.value}
                type="button"
                onClick={() => handleInputChange('paymentType', payment.value)}
                className={`p-3 border-2 rounded-lg transition-all text-center ${
                  formData.paymentType === payment.value
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className="text-xl mb-1">{payment.icon}</div>
                <div className="text-sm font-medium">{payment.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* حالة السداد */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            حالة السداد *
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => {
                handleInputChange('status', 'paid');
                setIsPartialPayment(false);
                setPaidAmount(formData.cost);
              }}
              className={`p-4 border-2 rounded-lg transition-all text-center ${
                formData.status === 'paid' && !isPartialPayment
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-2">✅</div>
              <div className="font-medium">مسددة بالكامل</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                تم سداد تكلفة الخدمة كاملة
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPartialPayment(true);
                setPaidAmount(0);
              }}
              className={`p-4 border-2 rounded-lg transition-all text-center ${
                isPartialPayment
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-2">💰</div>
              <div className="font-medium">سداد جزئي</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                سداد جزء من تكلفة الخدمة
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                handleInputChange('status', 'unpaid');
                setIsPartialPayment(false);
                setPaidAmount(0);
              }}
              className={`p-4 border-2 rounded-lg transition-all text-center ${
                formData.status === 'unpaid' && !isPartialPayment
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-2">❌</div>
              <div className="font-medium">غير مسددة</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                لم يتم سداد تكلفة الخدمة بعد
              </div>
            </button>
          </div>
        </div>

        {/* قسم السداد الجزئي */}
        {isPartialPayment && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              تفاصيل السداد الجزئي
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المبلغ المسدد (ريال) *
                </label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.paidAmount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  min="0"
                  max={formData.cost}
                  step="0.01"
                  placeholder="أدخل المبلغ المسدد"
                />
                {errors.paidAmount && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.paidAmount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المبلغ المتبقي (ريال)
                </label>
                <div className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
                  {(formData.cost - paidAmount).toLocaleString()} ريال
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  يتم حساب المبلغ المتبقي تلقائياً
                </p>
              </div>
            </div>

            {/* ملخص السداد */}
            <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">ملخص السداد:</h5>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-gray-600 dark:text-gray-400">إجمالي التكلفة</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formData.cost.toLocaleString()} ريال
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-green-600 dark:text-green-400">المبلغ المسدد</div>
                  <div className="font-semibold text-green-700 dark:text-green-300">
                    {paidAmount.toLocaleString()} ريال
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 dark:text-red-400">المبلغ المتبقي</div>
                  <div className="font-semibold text-red-700 dark:text-red-300">
                    {(formData.cost - paidAmount).toLocaleString()} ريال
                  </div>
                </div>
              </div>

              {/* شريط تقدم السداد */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>نسبة السداد</span>
                  <span>{formData.cost > 0 ? ((paidAmount / formData.cost) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${formData.cost > 0 ? (paidAmount / formData.cost) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* وصف الخدمة */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            وصف الخدمة (اختياري)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows={3}
            placeholder="أدخل تفاصيل إضافية عن الخدمة..."
          />
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            إلغاء
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {service ? 'تحديث الخدمة' : 'حفظ الخدمة'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
