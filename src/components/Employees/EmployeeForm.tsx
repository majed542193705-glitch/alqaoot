import React, { useState, useEffect } from 'react';
import { Save, X, Upload } from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeFormProps {
  employee: Employee | null;
  onSave: (employee: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    employeeNumber: employee?.employeeNumber || '',
    firstName: employee?.firstName || '',
    secondName: employee?.secondName || '',
    thirdName: employee?.thirdName || '',
    lastName: employee?.lastName || '',
    nationality: employee?.nationality || '',
    gender: employee?.gender || 'male',
    maritalStatus: employee?.maritalStatus || 'single',
    idNumber: employee?.idNumber || '',
    birthDate: employee?.birthDate || '',
    professionInResidence: employee?.professionInResidence || '',
    residenceExpiryDate: employee?.residenceExpiryDate || '',
    address: employee?.address || '',
    email: employee?.email || '',
    mobile: employee?.mobile || '',
    jobTitle: employee?.jobTitle || '',
    department: employee?.department || '',
    workStartDate: employee?.workStartDate || '',
    workEndDate: employee?.workEndDate || '',
    qualification: employee?.qualification || '',
    employeeStatus: employee?.employeeStatus || 'active',
    sponsorshipStatus: employee?.sponsorshipStatus || 'internal',
    employmentDate: employee?.employmentDate || '',
    isActive: employee?.isActive ?? true,
    bankName: employee?.bankName || '',
    bankAccountIBAN: employee?.bankAccountIBAN || '',
    basicSalary: employee?.basicSalary || 0,
    housingAllowance: employee?.housingAllowance || 0,
    transportAllowance: employee?.transportAllowance || 0,
    attachments: employee?.attachments || {}
  });

  const [activeTab, setActiveTab] = useState('administrative');

  // مراقبة تغيير حالة الموظف لتفعيل/تعطيل حقل تاريخ انتهاء الخدمة
  useEffect(() => {
    // إذا تم تغيير الحالة إلى نشط، امسح تاريخ انتهاء الخدمة
    if (formData.employeeStatus === 'active') {
      setFormData(prev => ({ ...prev, workEndDate: '' }));
    }
    // إذا تم تغيير الحالة إلى استقالة أو إنهاء خدمات وليس هناك تاريخ انتهاء، ضع التاريخ الحالي
    else if ((formData.employeeStatus === 'resigned' || formData.employeeStatus === 'terminated') && !formData.workEndDate) {
      setFormData(prev => ({ ...prev, workEndDate: new Date().toISOString().split('T')[0] }));
    }
  }, [formData.employeeStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'administrative', label: 'البيانات الإدارية' },
    { id: 'job', label: 'البيانات الوظيفية' },
    { id: 'financial', label: 'البيانات المالية' },
    { id: 'attachments', label: 'المرفقات' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {employee ? 'تعديل موظف' : 'إضافة موظف جديد'}
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
          {/* البيانات الإدارية */}
          {activeTab === 'administrative' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الاسم الأول *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الاسم الثاني *
                </label>
                <input
                  type="text"
                  value={formData.secondName}
                  onChange={(e) => handleInputChange('secondName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الاسم الثالث
                </label>
                <input
                  type="text"
                  value={formData.thirdName}
                  onChange={(e) => handleInputChange('thirdName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الاسم الأخير
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الجنسية
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الجنس
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الحالة الاجتماعية
                </label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="single">أعزب</option>
                  <option value="married">متزوج</option>
                  <option value="divorced">مطلق</option>
                  <option value="widowed">أرمل</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رقم الهوية/الإقامة *
                </label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المهنة في الإقامة *
                </label>
                <input
                  type="text"
                  value={formData.professionInResidence}
                  onChange={(e) => handleInputChange('professionInResidence', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ انتهاء الإقامة
                </label>
                <input
                  type="date"
                  value={formData.residenceExpiryDate}
                  onChange={(e) => handleInputChange('residenceExpiryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  العنوان
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* البيانات الوظيفية */}
          {activeTab === 'job' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المسمى الوظيفي
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الإدارة
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">اختر الإدارة</option>
                  <option value="النقل">النقل</option>
                  <option value="الإدارة">الإدارة</option>
                  <option value="المالية">المالية</option>
                  <option value="الموارد البشرية">الموارد البشرية</option>
                  <option value="الصيانة">الصيانة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ مباشرة الوظيفة
                </label>
                <input
                  type="date"
                  value={formData.workStartDate}
                  onChange={(e) => handleInputChange('workStartDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ انتهاء الخدمة
                </label>
                <input
                  type="date"
                  value={formData.workEndDate}
                  onChange={(e) => handleInputChange('workEndDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={formData.employeeStatus === 'active'}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.employeeStatus === 'active'
                    ? 'يتم تفعيل هذا الحقل عند تغيير حالة الموظف إلى "استقالة" أو "إنهاء خدمات"'
                    : 'تاريخ انتهاء الخدمة للموظف'
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المؤهل الدراسي *
                </label>
                <select
                  value={formData.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">اختر المؤهل</option>
                  <option value="ابتدائية">ابتدائية</option>
                  <option value="متوسطة">متوسطة</option>
                  <option value="ثانوية عامة">ثانوية عامة</option>
                  <option value="دبلوم">دبلوم</option>
                  <option value="بكالوريوس">بكالوريوس</option>
                  <option value="ماجستير">ماجستير</option>
                  <option value="دكتوراه">دكتوراه</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  حالة الموظف
                </label>
                <select
                  value={formData.employeeStatus}
                  onChange={(e) => handleInputChange('employeeStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="active">على رأس العمل</option>
                  <option value="resigned">استقالة</option>
                  <option value="terminated">إنهاء خدمات</option>
                  <option value="absent">متغيب عن العمل</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  حالة الكفالة
                </label>
                <select
                  value={formData.sponsorshipStatus}
                  onChange={(e) => handleInputChange('sponsorshipStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="internal">كفيل داخلي</option>
                  <option value="external">كفيل خارجي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ التوظيف / نقل الكفالة
                </label>
                <input
                  type="date"
                  value={formData.employmentDate}
                  onChange={(e) => handleInputChange('employmentDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                    موظف نشط
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* البيانات المالية */}
          {activeTab === 'financial' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اسم البنك
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رقم الحساب البنكي IBAN
                </label>
                <input
                  type="text"
                  value={formData.bankAccountIBAN}
                  onChange={(e) => handleInputChange('bankAccountIBAN', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="SA00 0000 0000 0000 0000 0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الراتب الأساسي
                </label>
                <input
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => handleInputChange('basicSalary', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  بدل السكن
                </label>
                <input
                  type="number"
                  value={typeof formData.housingAllowance === 'number' ? formData.housingAllowance : 0}
                  onChange={(e) => handleInputChange('housingAllowance', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  بدل النقل
                </label>
                <input
                  type="number"
                  value={typeof formData.transportAllowance === 'number' ? formData.transportAllowance : 0}
                  onChange={(e) => handleInputChange('transportAllowance', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          )}

          {/* المرفقات */}
          {activeTab === 'attachments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'contract', label: 'صورة العقد' },
                { key: 'workDocument', label: 'وثيقة مباشرة الوظيفة' },
                { key: 'bankAccount', label: 'صورة رقم الحساب البنكي' },
                { key: 'residence', label: 'صورة الإقامة' },
                { key: 'qualification', label: 'صورة المؤهل' }
              ].map((attachment) => (
                <div key={attachment.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {attachment.label}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      اسحب الملف هنا أو انقر للاختيار
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        // معالجة رفع الملف
                        console.log('File uploaded:', e.target.files?.[0]);
                      }}
                    />
                  </div>
                </div>
              ))}
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

export default EmployeeForm;