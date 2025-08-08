import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Filter, DollarSign, Calendar, TrendingUp, Building, User } from 'lucide-react';
import { OperatingExpense } from '../../types';
import OperatingExpenseForm from './OperatingExpenseForm';

const OperatingExpensesList: React.FC = () => {
  const [expenses, setExpenses] = useState<OperatingExpense[]>([
    {
      id: '1',
      category: 'company_expenses',
      date: '2024-02-01',
      type: 'office_rent',
      amount: 15000,
      description: 'إيجار المكتب الرئيسي - شهر فبراير',
      attachments: ['rent_contract.pdf'],
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-02-01T10:00:00Z'
    },
    {
      id: '2',
      category: 'employee_expenses',
      date: '2024-02-01',
      type: 'salary',
      amount: 8000,
      employeeId: '1',
      description: 'راتب شهر فبراير',
      attachments: [],
      createdAt: '2024-02-01T11:00:00Z',
      updatedAt: '2024-02-01T11:00:00Z'
    },
    {
      id: '3',
      category: 'company_expenses',
      date: '2024-02-05',
      type: 'electricity_bill',
      amount: 2500,
      description: 'فاتورة الكهرباء - يناير 2024',
      attachments: ['electricity_bill.pdf'],
      createdAt: '2024-02-05T09:00:00Z',
      updatedAt: '2024-02-05T09:00:00Z'
    },
    {
      id: '4',
      category: 'employee_expenses',
      date: '2024-02-10',
      type: 'residence_renewal_fees',
      amount: 2000,
      employeeId: '2',
      description: 'رسوم تجديد الإقامة',
      attachments: [],
      createdAt: '2024-02-10T14:00:00Z',
      updatedAt: '2024-02-10T14:00:00Z'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<OperatingExpense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // بيانات تجريبية للموظفين
  const employees = [
    { id: '1', name: 'أحمد محمد علي السعيد' },
    { id: '2', name: 'فاطمة علي محمد الزهراني' },
    { id: '3', name: 'محمد أحمد علي' },
    { id: '4', name: 'علي محمد أحمد' }
  ];

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense: OperatingExpense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  const handleSaveExpense = (expenseData: Omit<OperatingExpense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingExpense) {
      setExpenses(expenses.map(expense => 
        expense.id === editingExpense.id 
          ? { 
              ...expenseData, 
              id: editingExpense.id,
              createdAt: editingExpense.createdAt,
              updatedAt: new Date().toISOString()
            }
          : expense
      ));
    } else {
      const newExpense: OperatingExpense = {
        ...expenseData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setExpenses([...expenses, newExpense]);
    }
    setShowForm(false);
    setEditingExpense(null);
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'غير محدد';
  };

  const getExpenseTypeText = (type: string) => {
    const types = {
      'salary': 'راتب',
      'electricity_bill': 'فاتورة كهرباء',
      'office_rent': 'ايجار مكتب',
      'labor_office_fees': 'رسوم مكتب عمل',
      'residence_renewal_fees': 'رسوم تجديد اقامة',
      'tam_subscription': 'اشتراك تم',
      'qiwa_subscription': 'اشتراك قوى',
      'internet_subscription': 'اشتراك انترنت'
    };
    return types[type as keyof typeof types] || type;
  };

  const getCategoryText = (category: string) => {
    return category === 'employee_expenses' ? 'مصاريف موظف' : 'مصاريف المؤسسة';
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getExpenseTypeText(expense.type).includes(searchTerm) ||
                         (expense.employeeId && getEmployeeName(expense.employeeId).includes(searchTerm));
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    const matchesType = filterType === 'all' || expense.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // حساب الإحصائيات
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const employeeExpenses = expenses.filter(e => e.category === 'employee_expenses').reduce((sum, expense) => sum + expense.amount, 0);
  const companyExpenses = expenses.filter(e => e.category === 'company_expenses').reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    const currentDate = new Date();
    return expenseDate.getMonth() === currentDate.getMonth() && 
           expenseDate.getFullYear() === currentDate.getFullYear();
  }).reduce((sum, expense) => sum + expense.amount, 0);

  if (showForm) {
    return (
      <OperatingExpenseForm
        expense={editingExpense}
        onSave={handleSaveExpense}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              مصاريف التشغيل
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              إدارة ومتابعة جميع مصاريف التشغيل للمؤسسة والموظفين
            </p>
          </div>
          <button
            onClick={handleAddExpense}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة مصروف جديد</span>
          </button>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المصاريف</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {totalExpenses.toLocaleString()} ريال
              </p>
            </div>
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">مصاريف الموظفين</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {employeeExpenses.toLocaleString()} ريال
              </p>
            </div>
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">مصاريف المؤسسة</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">
                {companyExpenses.toLocaleString()} ريال
              </p>
            </div>
            <Building className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">مصاريف هذا الشهر</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">
                {monthlyExpenses.toLocaleString()} ريال
              </p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في المصاريف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 rtl:pr-10 rtl:pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">جميع الفئات</option>
            <option value="employee_expenses">مصاريف موظف</option>
            <option value="company_expenses">مصاريف المؤسسة</option>
          </select>
        </div>
      </div>

      {/* جدول المصاريف */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* عرض مبسط للجوال */}
        <div className="block sm:hidden">
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {getExpenseTypeText(expense.type)}
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {expense.amount.toLocaleString()} ريال
                </span>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>الفئة: {getCategoryText(expense.category)}</p>
                {expense.employeeId && (
                  <p>الموظف: {getEmployeeName(expense.employeeId)}</p>
                )}
                <p>التاريخ: {new Date(expense.date).toLocaleDateString('ar-SA')}</p>
                {expense.description && (
                  <p>الوصف: {expense.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => handleEditExpense(expense)}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDeleteExpense(expense.id)}
                  className="flex-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-800/30 text-red-700 dark:text-red-400 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* عرض الجدول للشاشات الكبيرة */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الفئة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  نوع المصروف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الموظف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الوصف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(expense.date).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      expense.category === 'employee_expenses' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                    }`}>
                      {getCategoryText(expense.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {getExpenseTypeText(expense.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {expense.employeeId ? getEmployeeName(expense.employeeId) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {expense.amount.toLocaleString()} ريال
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                    {expense.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <DollarSign className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              لا توجد مصاريف مطابقة لمعايير البحث
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatingExpensesList;
