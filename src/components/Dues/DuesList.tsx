import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, Calendar, Filter, TrendingUp, AlertCircle, CheckCircle, Receipt, User, Car } from 'lucide-react';
import { Due, DuePayment, Employee } from '../../types';
import DueForm from './DueForm';
import DuePaymentForm from './DuePaymentForm';

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  year: string;
  type: string;
}

const DuesList: React.FC = () => {
  const [dues, setDues] = useState<Due[]>([
    {
      id: '1',
      targetType: 'employee',
      targetId: '1',
      amount: 5000,
      description: 'مستحقات شخصية للموظف',
      year: '2024',
      date: '2024-01-15',
      payments: [],
      remainingAmount: 5000,
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      targetType: 'vehicle',
      targetId: 'v1',
      amount: 3000,
      description: 'رسوم نقل ملكية المركبة',
      year: '2024',
      date: '2024-01-20',
      payments: [
        {
          id: 'p1',
          dueId: '2',
          amount: 1500,
          date: '2024-01-25',
          type: 'bank_transfer',
          operationNumber: 'TXN123456'
        }
      ],
      remainingAmount: 1500,
      status: 'active',
      createdAt: '2024-01-20T09:00:00Z',
      updatedAt: '2024-01-25T14:30:00Z'
    }
  ]);

  const [vehicles] = useState<Vehicle[]>([
    {
      id: 'v1',
      plateNumber: 'أ ب ج 123',
      model: 'تويوتا كامري',
      year: '2022',
      type: 'سيارة'
    },
    {
      id: 'v2',
      plateNumber: 'د هـ و 456',
      model: 'نيسان التيما',
      year: '2023',
      type: 'سيارة'
    }
  ]);

  const [employees] = useState<Employee[]>([
    {
      id: '1',
      employeeNumber: 'EMP0001',
      firstName: 'أحمد',
      secondName: 'محمد',
      thirdName: 'علي',
      lastName: 'السعيد',
      nationality: 'سعودي',
      gender: 'male',
      maritalStatus: 'married',
      idNumber: '1234567890',
      birthDate: '1990-01-15',
      professionInResidence: 'سائق',
      residenceExpiryDate: '2025-12-31',
      address: 'الرياض، المملكة العربية السعودية',
      email: 'ahmed@example.com',
      mobile: '0501234567',
      jobTitle: 'سائق أول',
      department: 'النقل',
      workStartDate: '2023-01-01',
      qualification: 'ثانوية عامة',
      employeeStatus: 'active',
      sponsorshipStatus: 'internal',
      employmentDate: '2023-01-01',
      isActive: true,
      basicSalary: 5000,
      housingAllowance: 1000,
      transportAllowance: 500
    },
    {
      id: '2',
      employeeNumber: 'EMP0002',
      firstName: 'فاطمة',
      secondName: 'علي',
      thirdName: 'محمد',
      lastName: 'الزهراني',
      nationality: 'سعودي',
      gender: 'female',
      maritalStatus: 'married',
      idNumber: '1234567891',
      birthDate: '1992-03-10',
      professionInResidence: 'محاسبة',
      residenceExpiryDate: '2025-06-30',
      address: 'الرياض، حي النرجس',
      email: 'fatima@example.com',
      mobile: '0501234568',
      jobTitle: 'محاسبة',
      department: 'المالية',
      workStartDate: '2021-01-15',
      workEndDate: '2024-01-31',
      qualification: 'بكالوريوس محاسبة',
      employeeStatus: 'resigned',
      sponsorshipStatus: 'internal',
      employmentDate: '2021-01-15',
      isActive: false,
      basicSalary: 6000,
      housingAllowance: 1200,
      transportAllowance: 600
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingDue, setEditingDue] = useState<Due | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedDueForPayment, setSelectedDueForPayment] = useState<Due | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getTargetName = (due: Due) => {
    if (due.targetType === 'employee') {
      const employee = employees.find(emp => emp.id === due.targetId);
      return employee ? `${employee.firstName} ${employee.lastName}` : 'موظف غير معروف';
    } else {
      const vehicle = vehicles.find(veh => veh.id === due.targetId);
      return vehicle ? `${vehicle.plateNumber} - ${vehicle.model}` : 'مركبة غير معروفة';
    }
  };

  const getTargetNumber = (due: Due) => {
    if (due.targetType === 'employee') {
      const employee = employees.find(emp => emp.id === due.targetId);
      return employee ? employee.employeeNumber : '';
    } else {
      const vehicle = vehicles.find(veh => veh.id === due.targetId);
      return vehicle ? vehicle.plateNumber : '';
    }
  };

  const filteredDues = dues.filter(due => {
    const targetName = getTargetName(due);
    const targetNumber = getTargetNumber(due);

    const matchesSearch = searchTerm === '' ||
      targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      targetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      due.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      due.year.includes(searchTerm);

    return matchesSearch;
  });

  // حساب الإحصائيات بناءً على البيانات المفلترة
  const totalDues = filteredDues.length;
  const totalAmount = filteredDues.reduce((sum, due) => sum + due.amount, 0);
  const totalPaid = filteredDues.reduce((sum, due) => sum + (due.amount - due.remainingAmount), 0);
  const totalUnpaid = filteredDues.reduce((sum, due) => sum + due.remainingAmount, 0);

  const handleAddDue = () => {
    setEditingDue(null);
    setShowForm(true);
  };

  const handleEditDue = (due: Due) => {
    setEditingDue(due);
    setShowForm(true);
  };

  const handleDeleteDue = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستحق؟')) {
      setDues(dues.filter(due => due.id !== id));
    }
  };

  const handleAddPayment = (due: Due) => {
    setSelectedDueForPayment(due);
    setShowPaymentForm(true);
  };

  const handleFullPayment = (due: Due) => {
    const targetLabel = due.targetType === 'employee' ? 'الموظف' : 'المركبة';
    const confirmMessage = `هل أنت متأكد من سداد المبلغ المتبقي بالكامل؟\n\nتفاصيل المستحق:\n- ${targetLabel}: ${getTargetName(due)}\n- السنة: ${due.year}\n- المبلغ المتبقي: ${due.remainingAmount.toLocaleString()} ريال\n\nسيتم إغلاق هذا المستحق نهائياً بعد السداد.`;

    if (confirm(confirmMessage)) {
      const fullPayment: DuePayment = {
        id: Date.now().toString(),
        dueId: due.id,
        amount: due.remainingAmount,
        date: new Date().toISOString().split('T')[0],
        type: 'bank_transfer',
        operationNumber: `FULL-${Date.now()}`
      };

      setDues(dues.map(d => 
        d.id === due.id 
          ? {
              ...d,
              payments: [...d.payments, fullPayment],
              remainingAmount: 0,
              status: 'completed' as const
            }
          : d
      ));

      alert('تم سداد المستحق بالكامل بنجاح!');
    }
  };

  const handleSaveDue = (dueData: Omit<Due, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingDue) {
      setDues(dues.map(due => 
        due.id === editingDue.id 
          ? { 
              ...dueData, 
              id: editingDue.id,
              createdAt: editingDue.createdAt,
              updatedAt: new Date().toISOString()
            }
          : due
      ));
    } else {
      const newDue: Due = {
        ...dueData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setDues([...dues, newDue]);
    }
    setShowForm(false);
    setEditingDue(null);
  };

  const handleSavePayment = (paymentData: Omit<DuePayment, 'id' | 'dueId'>) => {
    if (!selectedDueForPayment) return;

    const newPayment: DuePayment = {
      ...paymentData,
      id: Date.now().toString(),
      dueId: selectedDueForPayment.id
    };

    setDues(dues.map(due => 
      due.id === selectedDueForPayment.id 
        ? {
            ...due,
            payments: [...due.payments, newPayment],
            remainingAmount: due.remainingAmount - paymentData.amount,
            status: (due.remainingAmount - paymentData.amount) <= 0 ? 'completed' as const : 'active' as const,
            updatedAt: new Date().toISOString()
          }
        : due
    ));

    setShowPaymentForm(false);
    setSelectedDueForPayment(null);
  };

  if (showForm) {
    return (
      <DueForm
        due={editingDue}
        employees={employees}
        vehicles={vehicles}
        onSave={handleSaveDue}
        onCancel={() => {
          setShowForm(false);
          setEditingDue(null);
        }}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-7 h-7 text-blue-600" />
              إدارة المستحقات
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              إدارة ومتابعة مستحقات الموظفين مع خيارات السداد المتنوعة
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* إحصائيات سريعة */}
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                {totalDues} مستحق {searchTerm !== '' ? 'مفلتر' : 'إجمالي'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {filteredDues.filter(d => d.remainingAmount > 0).length} غير مسدد
              </div>
            </div>
            
            <button
              onClick={handleAddDue}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              إضافة مستحق
            </button>
          </div>
        </div>

        {/* شريط البحث */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في المستحقات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* مؤشر البحث النشط */}
      {searchTerm !== '' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                البحث النشط:
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                "{searchTerm}"
              </span>
            </div>
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              مسح البحث
            </button>
          </div>
        </div>
      )}

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 relative">
          {(searchTerm !== '') && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                مفلتر
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {searchTerm !== '' ? 'المستحقات المفلترة' : 'إجمالي المستحقات'}
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalDues}</p>
            </div>
            <Receipt className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 relative">
          {(searchTerm !== '') && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                مفلتر
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">
                {searchTerm !== '' ? 'المبلغ المفلتر' : 'إجمالي المبلغ'}
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {totalAmount.toLocaleString()} ريال
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 relative">
          {(searchTerm !== '') && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
                مفلتر
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">المبلغ المسدد</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {totalPaid.toLocaleString()} ريال
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 relative">
          {(searchTerm !== '') && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200">
                مفلتر
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">المبلغ غير المسدد</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {totalUnpaid.toLocaleString()} ريال
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* شريط تقدم السداد */}
      {totalAmount > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                نسبة سداد المستحقات
              </h3>
              {(searchTerm !== '') && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                  مفلتر
                </span>
              )}
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {totalAmount > 0 ? ((totalPaid / totalAmount) * 100).toFixed(1) : 0}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(totalPaid / totalAmount) * 100}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">مسدد:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {totalPaid.toLocaleString()} ريال
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">غير مسدد:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {totalUnpaid.toLocaleString()} ريال
              </span>
            </div>
          </div>
        </div>
      )}

      {/* جدول المستحقات */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  المستحق لـ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  السنة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  المبلغ المتبقي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDues.map((due) => (
                <tr key={due.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0">
                        {due.targetType === 'employee' ? (
                          <User className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Car className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {getTargetName(due)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {getTargetNumber(due)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                      {due.year}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      {due.amount.toLocaleString()} ريال
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold ${due.remainingAmount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {due.remainingAmount.toLocaleString()} ريال
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(due.date).toLocaleDateString('ar-SA')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      due.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {due.status === 'completed' ? 'مكتمل' : 'نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-1">
                      {due.remainingAmount > 0 && (
                        <>
                          <button
                            onClick={() => handleAddPayment(due)}
                            className="bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                            title="إضافة دفعة جزئية"
                          >
                            <DollarSign className="w-3 h-3" />
                            دفعة
                          </button>
                          
                          <button
                            onClick={() => handleFullPayment(due)}
                            className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                            title="سداد المبلغ المتبقي بالكامل"
                          >
                            <CheckCircle className="w-3 h-3" />
                            سداد كامل
                          </button>
                        </>
                      )}
                      
                      <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-600 pr-2 mr-1">
                        <button
                          onClick={() => handleEditDue(due)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="تعديل المستحق"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDue(due.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="حذف المستحق"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDues.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              لا توجد مستحقات مطابقة لمعايير البحث
            </p>
          </div>
        )}
      </div>

      {/* نموذج إضافة دفعة */}
      {showPaymentForm && selectedDueForPayment && (
        <DuePaymentForm
          due={selectedDueForPayment}
          onSave={handleSavePayment}
          onCancel={() => {
            setShowPaymentForm(false);
            setSelectedDueForPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default DuesList;
