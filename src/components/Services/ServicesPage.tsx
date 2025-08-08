import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, FileText, Calendar, DollarSign, Filter, Eye, CheckCircle, TrendingUp, AlertCircle, Briefcase } from 'lucide-react';
import { ServiceRecord, Employee } from '../../types';
import ServiceForm from './ServiceForm';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceRecord[]>([
    {
      id: '1',
      employeeId: '1',
      serviceDate: '2024-01-15',
      serviceType: 'transfer_document',
      cost: 500,
      paymentType: 'company_account',
      description: 'إصدار وثيقة نقل للموظف',
      status: 'paid',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      employeeId: '2',
      serviceDate: '2024-01-20',
      serviceType: 'vehicle_form_renewal',
      cost: 300,
      paymentType: 'deducted_from_salary',
      description: 'تجديد استمارة مركبة الموظف',
      status: 'unpaid',
      createdAt: '2024-01-20T09:00:00Z',
      updatedAt: '2024-01-20T09:00:00Z'
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
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const serviceTypes = {
    'transfer_document': { label: 'إصدار وثيقة نقل', icon: '📄', color: 'blue' },
    'vehicle_form_renewal': { label: 'تجديد استمارة مركبة', icon: '🔄', color: 'green' },
    'internal_vehicle_authorization': { label: 'تفويض مركبة داخلي', icon: '📋', color: 'indigo' },
    'external_vehicle_authorization': { label: 'تفويض مركبة خارجي', icon: '🌐', color: 'pink' },
    'add_actual_user': { label: 'إضافة مستخدم فعلي', icon: '👤', color: 'purple' },
    'operation_card_renewal': { label: 'تجديد كرت تشغيل', icon: '💳', color: 'yellow' },
    'driver_card_renewal': { label: 'تجديد بطاقة سائق', icon: '🚗', color: 'red' },
    'chamber_of_commerce_certification': { label: 'تصديق غرفة تجارية', icon: '🏢', color: 'gray' },
    'passport_info_transfer': { label: 'نقل معلومات جواز سفر', icon: '✈️', color: 'orange' }
  };

  const paymentTypes = {
    'cash': 'نقداً',
    'bank_transfer': 'تحويل بنكي',
    'company_account': 'حساب الشركة',
    'deducted_from_salary': 'خصم من الراتب'
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'غير معروف';
  };

  const getEmployeeNumber = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.employeeNumber : '';
  };

  const filteredServices = services.filter(service => {
    const employee = employees.find(emp => emp.id === service.employeeId);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : '';
    const employeeNumber = employee ? employee.employeeNumber : '';

    const matchesSearch = searchTerm === '' ||
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceTypes[service.serviceType]?.label.includes(searchTerm);

    const matchesType = filterType === 'all' || service.serviceType === filterType;
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // حساب الإحصائيات بناءً على البيانات المفلترة
  const totalServices = filteredServices.length;
  const totalAmount = filteredServices.reduce((sum, service) => sum + service.cost, 0);

  // حساب المبلغ المسدد (يشمل السداد الكامل والجزئي)
  const totalPaid = filteredServices.reduce((sum, service) => {
    if (service.status === 'paid') {
      return sum + service.cost; // سداد كامل
    } else if (service.paidAmount !== undefined) {
      return sum + service.paidAmount; // سداد جزئي
    }
    return sum;
  }, 0);

  // حساب المبلغ المتبقي
  const totalUnpaid = filteredServices.reduce((sum, service) => {
    if (service.status === 'unpaid' && service.remainingAmount !== undefined) {
      return sum + service.remainingAmount; // سداد جزئي - المبلغ المتبقي
    } else if (service.status === 'unpaid' && service.paidAmount === undefined) {
      return sum + service.cost; // غير مسدد بالكامل
    }
    return sum;
  }, 0);

  const handleAddService = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEditService = (service: ServiceRecord) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDeleteService = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      setServices(services.filter(service => service.id !== id));
    }
  };



  const handleMarkAsPaid = (id: string) => {
    const service = services.find(s => s.id === id);
    if (service && confirm(`هل أنت متأكد من تسديد خدمة "${serviceTypes[service.serviceType]?.label}" بتكلفة ${service.cost.toLocaleString()} ريال؟`)) {
      setServices(services.map(service =>
        service.id === id
          ? { ...service, status: 'paid' as const, updatedAt: new Date().toISOString() }
          : service
      ));
    }
  };

  const handleSaveService = (serviceData: Omit<ServiceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { 
              ...serviceData, 
              id: editingService.id,
              createdAt: editingService.createdAt,
              updatedAt: new Date().toISOString()
            }
          : service
      ));
    } else {
      const newService: ServiceRecord = {
        ...serviceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setServices([...services, newService]);
    }
    setShowForm(false);
    setEditingService(null);
  };

  if (showForm) {
    return (
      <ServiceForm
        service={editingService}
        employees={employees}
        onSave={handleSaveService}
        onCancel={() => {
          setShowForm(false);
          setEditingService(null);
        }}
      />
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              إدارة الخدمات
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              إدارة ومتابعة خدمات الموظفين والوثائق الرسمية
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* إحصائيات سريعة */}
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                {totalServices} خدمة {filterType !== 'all' || filterStatus !== 'all' ? 'مفلترة' : 'إجمالي'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {filteredServices.filter(s => s.status === 'unpaid').length} غير مسددة
              </div>
            </div>
            
            <button
              onClick={handleAddService}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              إضافة خدمة
            </button>
          </div>
        </div>

        {/* شريط البحث والفلترة */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="البحث بالموظف أو نوع الخدمة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 sm:pl-10 rtl:pr-8 rtl:pl-4 sm:rtl:pr-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative">
              <Filter className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full sm:w-auto pl-8 sm:pl-10 rtl:pr-8 rtl:pl-4 sm:rtl:pr-10 pr-8 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              >
                <option value="all">جميع الأنواع</option>
                {Object.entries(serviceTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-8 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              >
                <option value="all">جميع الحالات</option>
                <option value="paid">مسددة</option>
                <option value="unpaid">غير مسددة</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* مؤشر التصفية النشطة */}
      {(filterType !== 'all' || filterStatus !== 'all' || searchTerm !== '') && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                التصفية النشطة:
              </span>
              <div className="flex items-center gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                    البحث: "{searchTerm}"
                  </span>
                )}
                {filterType !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                    النوع: {serviceTypes[filterType]?.label}
                  </span>
                )}
                {filterStatus !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
                    الحالة: {filterStatus === 'paid' ? 'مسددة' : 'غير مسددة'}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
              }}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              إزالة جميع المرشحات
            </button>
          </div>
        </div>
      )}

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-800 relative">
          {(filterType !== 'all' || filterStatus !== 'all') && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                مفلتر
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                {filterType !== 'all' || filterStatus !== 'all' ? 'الخدمات المفلترة' : 'إجمالي الخدمات'}
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-300">{totalServices}</p>
            </div>
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 relative">
          {(filterType !== 'all' || filterStatus !== 'all') && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                مفلتر
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">
                {filterType !== 'all' || filterStatus !== 'all' ? 'المبلغ المفلتر' : 'إجمالي المبلغ'}
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {totalAmount.toLocaleString()} ريال
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 relative">
          {(filterType !== 'all' || filterStatus !== 'all') && (
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
          {(filterType !== 'all' || filterStatus !== 'all') && (
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
                نسبة سداد الخدمات
              </h3>
              {(filterType !== 'all' || filterStatus !== 'all') && (
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

      {/* جدول الخدمات */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* عرض مبسط للجوال */}
        <div className="block sm:hidden">
              {filteredServices.map((service) => {
                const serviceType = serviceTypes[service.serviceType];
                return (
                  <div key={service.id} className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{serviceType?.icon}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {getEmployeeName(service.employeeId)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {service.paidAmount !== undefined && service.remainingAmount !== undefined ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            <span className="text-sm">💰</span>
                            سداد جزئي
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                            service.status === 'paid'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            <span className="text-sm">
                              {service.status === 'paid' ? '✅' : '❌'}
                            </span>
                            {service.status === 'paid' ? 'مسددة بالكامل' : 'غير مسددة'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {serviceType?.label}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {new Date(service.serviceDate).toLocaleDateString('ar-SA')}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {service.cost.toLocaleString()} ريال
                      </span>
                    </div>
                    {service.paidAmount !== undefined && service.remainingAmount !== undefined && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        مسدد: {service.paidAmount.toLocaleString()} | متبقي: {service.remainingAmount.toLocaleString()}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleEditService(service)}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="flex-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-800/30 text-red-700 dark:text-red-400 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* عرض الجدول للشاشات الكبيرة */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الموظف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  نوع الخدمة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  التكلفة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  نوع السداد
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
              {filteredServices.map((service) => {
                const serviceType = serviceTypes[service.serviceType];
                return (
                  <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {getEmployeeName(service.employeeId)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {getEmployeeNumber(service.employeeId)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{serviceType?.icon}</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {serviceType?.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(service.serviceDate).toLocaleDateString('ar-SA')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          {service.cost.toLocaleString()} ريال
                        </div>
                        {service.paidAmount !== undefined && service.remainingAmount !== undefined && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            مسدد: {service.paidAmount.toLocaleString()} | متبقي: {service.remainingAmount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {paymentTypes[service.paymentType]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {service.paidAmount !== undefined && service.remainingAmount !== undefined ? (
                          // سداد جزئي
                          <>
                            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              <span className="text-sm">💰</span>
                              سداد جزئي
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {((service.paidAmount / service.cost) * 100).toFixed(1)}% مسدد
                            </div>
                          </>
                        ) : (
                          // سداد كامل أو غير مسدد
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                            service.status === 'paid'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            <span className="text-sm">
                              {service.status === 'paid' ? '✅' : '❌'}
                            </span>
                            {service.status === 'paid' ? 'مسددة بالكامل' : 'غير مسددة'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1">
                        {service.status === 'unpaid' && (
                          <button
                            onClick={() => handleMarkAsPaid(service.id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                            title="تسديد الخدمة"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditService(service)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="تعديل الخدمة"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="حذف الخدمة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              لا توجد خدمات مطابقة لمعايير البحث
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
