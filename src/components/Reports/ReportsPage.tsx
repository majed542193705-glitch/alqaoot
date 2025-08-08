import React, { useState } from 'react';
import { Calendar, FileText, User, DollarSign, TrendingUp, Download, Filter, Search, Car } from 'lucide-react';
import { ServiceRecord, Employee, Advance, OperatingExpense, Vehicle } from '../../types';

const ReportsPage: React.FC = () => {
  const [activeReportType, setActiveReportType] = useState<'date' | 'service' | 'employee' | 'vehicle'>('date');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');

  // بيانات تجريبية للموظفين
  const employees = [
    { id: '1', name: 'أحمد محمد علي السعيد' },
    { id: '2', name: 'فاطمة علي محمد الزهراني' },
    { id: '3', name: 'محمد أحمد علي' },
    { id: '4', name: 'علي محمد أحمد' }
  ];

  // بيانات تجريبية للخدمات
  const services = [
    { id: 'transfer_document', name: 'إصدار وثيقة نقل' },
    { id: 'vehicle_form_renewal', name: 'تجديد استمارة مركبة' },
    { id: 'internal_vehicle_authorization', name: 'تفويض مركبة داخلي' },
    { id: 'external_vehicle_authorization', name: 'تفويض مركبة خارجي' },
    { id: 'add_actual_user', name: 'إضافة مستخدم فعلي' },
    { id: 'operation_card_renewal', name: 'تجديد كرت تشغيل' },
    { id: 'driver_card_renewal', name: 'تجديد بطاقة سائق' },
    { id: 'chamber_of_commerce_certification', name: 'تصديق غرفة تجارية' }
  ];

  // بيانات تجريبية للمركبات
  const vehicles = [
    { id: '1', plateNumber: 'أ ب ج 1234', brand: 'مرسيدس', model: 'أكتروس' },
    { id: '2', plateNumber: 'د هـ و 5678', brand: 'فولفو', model: 'FH16' },
    { id: '3', plateNumber: 'ز ح ط 9012', brand: 'سكانيا', model: 'R450' },
    { id: '4', plateNumber: 'ي ك ل 3456', brand: 'مان', model: 'TGX' },
    { id: '5', plateNumber: 'م ن س 7890', brand: 'إيفيكو', model: 'Stralis' }
  ];

  // بيانات تجريبية للخدمات
  const serviceRecords: ServiceRecord[] = [
    {
      id: '1',
      employeeId: '1',
      serviceType: 'transfer_document',
      customerName: 'محمد أحمد السعيد',
      customerPhone: '0501234567',
      amount: 500,
      paidAmount: 500,
      paymentStatus: 'paid',
      serviceStatus: 'completed',
      date: '2024-02-15',
      notes: 'تم إنجاز الخدمة بنجاح',
      createdAt: '2024-02-15T10:00:00Z',
      updatedAt: '2024-02-15T14:00:00Z'
    },
    {
      id: '2',
      employeeId: '2',
      vehicleId: '1',
      serviceType: 'vehicle_form_renewal',
      customerName: 'فاطمة علي محمد',
      customerPhone: '0507654321',
      amount: 300,
      paidAmount: 150,
      paymentStatus: 'partial',
      serviceStatus: 'in_progress',
      date: '2024-02-16',
      notes: 'في انتظار استكمال الأوراق',
      createdAt: '2024-02-16T09:00:00Z',
      updatedAt: '2024-02-16T11:00:00Z'
    },
    {
      id: '3',
      employeeId: '1',
      vehicleId: '2',
      serviceType: 'internal_vehicle_authorization',
      customerName: 'خالد أحمد محمد',
      customerPhone: '0509876543',
      amount: 750,
      paidAmount: 750,
      paymentStatus: 'paid',
      serviceStatus: 'completed',
      date: '2024-02-17',
      notes: 'تم إصدار التفويض بنجاح',
      createdAt: '2024-02-17T08:00:00Z',
      updatedAt: '2024-02-17T12:00:00Z'
    },
    {
      id: '4',
      employeeId: '3',
      vehicleId: '3',
      serviceType: 'external_vehicle_authorization',
      customerName: 'سارة محمد علي',
      customerPhone: '0502468135',
      amount: 1200,
      paidAmount: 0,
      paymentStatus: 'unpaid',
      serviceStatus: 'pending',
      date: '2024-02-18',
      notes: 'في انتظار السداد',
      createdAt: '2024-02-18T10:00:00Z',
      updatedAt: '2024-02-18T10:00:00Z'
    }
  ];

  // بيانات تجريبية للسلف
  const advances: Advance[] = [
    {
      id: '1',
      employeeId: '1',
      type: 'personal_advance',
      amount: 5000,
      date: '2024-01-15',
      payments: [
        {
          id: '1',
          advanceId: '1',
          amount: 2000,
          date: '2024-02-01',
          type: 'bank_transfer',
          operationNumber: 'TXN123456',
          attachment: ''
        }
      ],
      remainingAmount: 3000
    },
    {
      id: '2',
      employeeId: '2',
      type: 'medical_insurance_fees',
      amount: 3000,
      date: '2024-02-01',
      payments: [],
      remainingAmount: 3000
    }
  ];

  // بيانات تجريبية للمصاريف
  const expenses: OperatingExpense[] = [
    {
      id: '1',
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
      id: '2',
      category: 'company_expenses',
      date: '2024-02-05',
      type: 'office_rent',
      amount: 15000,
      description: 'إيجار المكتب الرئيسي - شهر فبراير',
      attachments: ['rent_contract.pdf'],
      createdAt: '2024-02-05T09:00:00Z',
      updatedAt: '2024-02-05T09:00:00Z'
    }
  ];

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'غير محدد';
  };

  const getServiceName = (serviceType: string) => {
    const service = services.find(s => s.id === serviceType);
    return service ? service.name : serviceType;
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.plateNumber} - ${vehicle.brand}` : 'غير محدد';
  };

  const getAdvanceTypeText = (type: string) => {
    const types = {
      'work_permit_fees': 'رسوم رخصة عمل',
      'residence_renewal_fees': 'رسوم تجديد اقامة',
      'traffic_violation_fees': 'رسوم مخالفة مرورية',
      'transport_authority_violation_fees': 'رسوم مخالفة هيئة النقل',
      'medical_insurance_fees': 'رسوم تأمين طبي',
      'car_insurance_fees': 'رسوم تامين سيارة',
      'exit_reentry_visa_fees': 'رسوم تأشيرة خروج وعودة',
      'personal_advance': 'سلفة شخصية',
      'other_fees': 'رسوم أخرى'
    };
    return types[type as keyof typeof types] || type;
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

  // فلترة البيانات حسب نوع التقرير
  const getFilteredData = () => {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    switch (activeReportType) {
      case 'date':
        return {
          services: serviceRecords.filter(service => {
            const serviceDate = new Date(service.date);
            return serviceDate >= startDate && serviceDate <= endDate;
          }),
          advances: advances.filter(advance => {
            const advanceDate = new Date(advance.date);
            return advanceDate >= startDate && advanceDate <= endDate;
          }),
          expenses: expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
          })
        };

      case 'service':
        return {
          services: serviceRecords.filter(service => 
            selectedService ? service.serviceType === selectedService : true
          ),
          advances: [],
          expenses: []
        };

      case 'employee':
        return {
          services: serviceRecords.filter(service =>
            selectedEmployee ? service.employeeId === selectedEmployee : true
          ),
          advances: advances.filter(advance =>
            selectedEmployee ? advance.employeeId === selectedEmployee : true
          ),
          expenses: expenses.filter(expense =>
            selectedEmployee ? expense.employeeId === selectedEmployee : true
          )
        };

      case 'vehicle':
        return {
          services: serviceRecords.filter(service =>
            selectedVehicle ? service.vehicleId === selectedVehicle : true
          ),
          advances: [],
          expenses: []
        };

      default:
        return { services: [], advances: [], expenses: [] };
    }
  };

  const filteredData = getFilteredData();

  // حساب الإحصائيات
  const calculateStats = () => {
    const totalServiceRevenue = filteredData.services.reduce((sum, service) => sum + service.paidAmount, 0);
    const totalAdvances = filteredData.advances.reduce((sum, advance) => sum + advance.amount, 0);
    const totalExpenses = filteredData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = totalServiceRevenue - totalExpenses;

    return {
      totalServiceRevenue,
      totalAdvances,
      totalExpenses,
      netProfit
    };
  };

  const stats = calculateStats();

  const handleExportReport = () => {
    // هنا يمكن إضافة منطق تصدير التقرير
    alert('سيتم تصدير التقرير قريباً');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          التقارير والإحصائيات
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          تقارير شاملة للخدمات والمصاريف والمستحقات
        </p>
      </div>

      {/* أنواع التقارير */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setActiveReportType('date')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            activeReportType === 'date'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
          }`}
        >
          <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <h3 className="font-medium text-gray-900 dark:text-white">تقرير حسب التاريخ</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">عرض البيانات في فترة زمنية محددة</p>
        </button>

        <button
          onClick={() => setActiveReportType('service')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            activeReportType === 'service'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
          }`}
        >
          <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <h3 className="font-medium text-gray-900 dark:text-white">تقرير حسب الخدمة</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">عرض بيانات خدمة معينة</p>
        </button>

        <button
          onClick={() => setActiveReportType('employee')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            activeReportType === 'employee'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
          }`}
        >
          <User className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <h3 className="font-medium text-gray-900 dark:text-white">تقرير حسب الموظف</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">عرض جميع بيانات موظف معين</p>
        </button>

        <button
          onClick={() => setActiveReportType('vehicle')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            activeReportType === 'vehicle'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
          }`}
        >
          <Car className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <h3 className="font-medium text-gray-900 dark:text-white">تقرير حسب المركبة</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">عرض جميع بيانات مركبة معينة</p>
        </button>
      </div>

      {/* فلاتر التقرير */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            فلاتر التقرير
          </h2>
          <button
            onClick={handleExportReport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            تصدير التقرير
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* فلتر التاريخ */}
          {activeReportType === 'date' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  من تاريخ
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  إلى تاريخ
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </>
          )}

          {/* فلتر الخدمة */}
          {activeReportType === 'service' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                نوع الخدمة
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">جميع الخدمات</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* فلتر الموظف */}
          {activeReportType === 'employee' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم الموظف
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">جميع الموظفين</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* فلتر المركبة */}
          {activeReportType === 'vehicle' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رقم اللوحة
              </label>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">جميع المركبات</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plateNumber} - {vehicle.brand} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إيرادات الخدمات</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.totalServiceRevenue.toLocaleString()} ريال
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي السلف</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalAdvances.toLocaleString()} ريال
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المصاريف</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.totalExpenses.toLocaleString()} ريال
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">صافي الربح</p>
              <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.netProfit.toLocaleString()} ريال
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
      </div>

      {/* تفاصيل التقرير */}
      <div className="space-y-6">
        {/* الخدمات */}
        {filteredData.services.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                الخدمات ({filteredData.services.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الموظف
                    </th>
                    {activeReportType === 'vehicle' && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        المركبة
                      </th>
                    )}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      نوع الخدمة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      العميل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      المبلغ المدفوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(service.date).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {getEmployeeName(service.employeeId)}
                      </td>
                      {activeReportType === 'vehicle' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {getVehicleName(service.vehicleId)}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {getServiceName(service.serviceType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {service.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {service.paidAmount.toLocaleString()} ريال
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.serviceStatus === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : service.serviceStatus === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {service.serviceStatus === 'completed' ? 'مكتملة' : 
                           service.serviceStatus === 'in_progress' ? 'قيد التنفيذ' : 'معلقة'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* السلف */}
        {filteredData.advances.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                السلف والمستحقات ({filteredData.advances.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الموظف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      نوع السلفة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      المبلغ الإجمالي
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      المبلغ المدفوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      المبلغ المتبقي
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.advances.map((advance) => (
                    <tr key={advance.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(advance.date).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {getEmployeeName(advance.employeeId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {getAdvanceTypeText(advance.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {advance.amount.toLocaleString()} ريال
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {(advance.amount - advance.remainingAmount).toLocaleString()} ريال
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {advance.remainingAmount.toLocaleString()} ريال
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* المصاريف */}
        {filteredData.expenses.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                المصاريف ({filteredData.expenses.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
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
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(expense.date).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          expense.category === 'employee_expenses' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                        }`}>
                          {expense.category === 'employee_expenses' ? 'مصاريف موظف' : 'مصاريف المؤسسة'}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* رسالة عدم وجود بيانات */}
        {filteredData.services.length === 0 && filteredData.advances.length === 0 && filteredData.expenses.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              لا توجد بيانات للعرض
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              لا توجد بيانات مطابقة لمعايير البحث المحددة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
