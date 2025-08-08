import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter, Users, UserCheck, UserX, Building, Globe } from 'lucide-react';
import { Employee } from '../../types';
import EmployeeForm from './EmployeeForm';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
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
    },
    {
      id: '3',
      employeeNumber: 'EMP0003',
      firstName: 'خالد',
      secondName: 'سعد',
      thirdName: 'عبدالله',
      lastName: 'المطيري',
      nationality: 'سعودي',
      gender: 'male',
      maritalStatus: 'single',
      idNumber: '1234567892',
      birthDate: '1988-07-20',
      professionInResidence: 'فني صيانة',
      residenceExpiryDate: '2024-12-31',
      address: 'الرياض، حي الملك فهد',
      email: 'khalid@example.com',
      mobile: '0501234569',
      jobTitle: 'فني صيانة',
      department: 'الصيانة',
      workStartDate: '2020-03-01',
      workEndDate: '2024-02-15',
      qualification: 'دبلوم فني',
      employeeStatus: 'terminated',
      sponsorshipStatus: 'internal',
      employmentDate: '2020-03-01',
      isActive: false,
      basicSalary: 4500,
      housingAllowance: 900,
      transportAllowance: 450
    },
    {
      id: '4',
      employeeNumber: 'EMP0004',
      firstName: 'محمد',
      secondName: 'أحمد',
      thirdName: 'سالم',
      lastName: 'الغامدي',
      nationality: 'سعودي',
      gender: 'male',
      maritalStatus: 'married',
      idNumber: '1234567893',
      birthDate: '1985-11-12',
      professionInResidence: 'مدير مشروع',
      residenceExpiryDate: '2025-08-15',
      address: 'جدة، حي الروضة',
      email: 'mohammed@example.com',
      mobile: '0501234570',
      jobTitle: 'مدير مشروع',
      department: 'الإدارة',
      workStartDate: '2019-06-01',
      qualification: 'ماجستير إدارة أعمال',
      employeeStatus: 'active',
      sponsorshipStatus: 'external',
      employmentDate: '2019-06-01',
      isActive: true,
      basicSalary: 8000,
      housingAllowance: 1500,
      transportAllowance: 800
    },
    {
      id: '5',
      employeeNumber: 'EMP0005',
      firstName: 'عائشة',
      secondName: 'عبدالرحمن',
      thirdName: 'صالح',
      lastName: 'القحطاني',
      nationality: 'سعودي',
      gender: 'female',
      maritalStatus: 'single',
      idNumber: '1234567894',
      birthDate: '1993-05-08',
      professionInResidence: 'مطورة برمجيات',
      residenceExpiryDate: '2025-10-20',
      address: 'الدمام، حي الفيصلية',
      email: 'aisha@example.com',
      mobile: '0501234571',
      jobTitle: 'مطورة برمجيات',
      department: 'تقنية المعلومات',
      workStartDate: '2022-02-01',
      qualification: 'بكالوريوس علوم حاسب',
      employeeStatus: 'active',
      sponsorshipStatus: 'external',
      employmentDate: '2022-02-01',
      isActive: true,
      basicSalary: 7000,
      housingAllowance: 1300,
      transportAllowance: 700
    },
    {
      id: '6',
      employeeNumber: 'EMP0006',
      firstName: 'عبدالله',
      secondName: 'سعود',
      thirdName: 'محمد',
      lastName: 'الشهري',
      nationality: 'سعودي',
      gender: 'male',
      maritalStatus: 'married',
      idNumber: '1234567895',
      birthDate: '1987-09-25',
      professionInResidence: 'مهندس مدني',
      residenceExpiryDate: '2024-11-30',
      address: 'أبها، حي المنهل',
      email: 'abdullah@example.com',
      mobile: '0501234572',
      jobTitle: 'مهندس مدني',
      department: 'الهندسة',
      workStartDate: '2018-04-15',
      workEndDate: '2023-12-31',
      qualification: 'بكالوريوس هندسة مدنية',
      employeeStatus: 'resigned',
      sponsorshipStatus: 'external',
      employmentDate: '2018-04-15',
      isActive: false,
      basicSalary: 6500,
      housingAllowance: 1200,
      transportAllowance: 650
    }
  ]);;

  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const handleSaveEmployee = (employeeData: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...employeeData, id: editingEmployee.id }
          : emp
      ));
    } else {
      const newEmployee: Employee = {
        ...employeeData,
        id: Date.now().toString(),
        employeeNumber: `EMP${String(employees.length + 1).padStart(4, '0')}`
      };
      setEmployees([...employees, newEmployee]);
    }
    setShowForm(false);
    setEditingEmployee(null);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.secondName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.idNumber.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || employee.employeeStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (showForm) {
    return (
      <EmployeeForm
        employee={editingEmployee}
        onSave={handleSaveEmployee}
        onCancel={() => {
          setShowForm(false);
          setEditingEmployee(null);
        }}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            إدارة الموظفين
          </h1>
          <button
            onClick={handleAddEmployee}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة موظف</span>
          </button>
        </div>

        {/* لوحة المعلومات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* إجمالي الموظفين */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الموظفين</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {employees.length}
                </p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>

          {/* الموظفين النشطين */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">النشطين</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {employees.filter(emp => emp.isActive).length}
                </p>
              </div>
              <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>

          {/* الموظفين غير النشطين */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">غير النشطين</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {employees.filter(emp => !emp.isActive).length}
                </p>
              </div>
              <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
          </div>

          {/* الموظفين الداخليين */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">داخليين</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">
                  {employees.filter(emp => emp.sponsorshipStatus === 'internal').length}
                </p>
              </div>
              <Building className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </div>

          {/* الموظفين الخارجيين */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">خارجيين</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">
                  {employees.filter(emp => emp.sponsorshipStatus === 'external').length}
                </p>
              </div>
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* شريط البحث والفلترة */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث بالاسم أو الرقم الوظيفي أو رقم الهوية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 rtl:pr-10 rtl:pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">على رأس العمل</option>
              <option value="resigned">استقالة</option>
              <option value="terminated">إنهاء خدمات</option>
              <option value="absent">متغيب عن العمل</option>
            </select>
          </div>
        </div>
      </div>

      {/* جدول الموظفين */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الرقم الوظيفي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الاسم الكامل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  المسمى الوظيفي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  رقم الهوية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  تاريخ انتهاء الخدمة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {employee.employeeNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {`${employee.firstName} ${employee.secondName} ${employee.thirdName || ''} ${employee.lastName}`.trim()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {employee.jobTitle || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {employee.idNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.employeeStatus === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : employee.employeeStatus === 'resigned'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : employee.employeeStatus === 'terminated'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {employee.employeeStatus === 'active' ? 'على رأس العمل' :
                       employee.employeeStatus === 'resigned' ? 'استقالة' :
                       employee.employeeStatus === 'terminated' ? 'إنهاء خدمات' : 'متغيب'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {employee.workEndDate ? (
                      <div className="flex flex-col">
                        <span>{new Date(employee.workEndDate).toLocaleDateString('ar-SA')}</span>
                        {employee.employeeStatus !== 'active' && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {employee.employeeStatus === 'resigned' ? 'تاريخ الاستقالة' : 'تاريخ إنهاء الخدمة'}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              لا توجد موظفين مطابقين لمعايير البحث
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;