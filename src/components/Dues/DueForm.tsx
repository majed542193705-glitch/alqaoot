import React, { useState } from 'react';
import { Save, X, Receipt, User, Car } from 'lucide-react';
import { Due, Employee } from '../../types';

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  year: string;
  type: string;
}

interface DueFormProps {
  due: Due | null;
  employees: Employee[];
  vehicles?: Vehicle[];
  onSave: (due: Omit<Due, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const DueForm: React.FC<DueFormProps> = ({ due, employees, vehicles = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Due, 'id' | 'createdAt' | 'updatedAt'>>({
    targetType: due?.targetType || 'employee',
    targetId: due?.targetId || '',
    amount: due?.amount || 0,
    description: due?.description || '',
    year: due?.year || new Date().getFullYear().toString(),
    date: due?.date || new Date().toISOString().split('T')[0],
    payments: due?.payments || [],
    remainingAmount: due?.remainingAmount || 0,
    status: due?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dueData = {
      ...formData,
      remainingAmount: formData.amount
    };
    onSave(dueData);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : '';
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(veh => veh.id === vehicleId);
    return vehicle ? `${vehicle.plateNumber} - ${vehicle.model}` : '';
  };



  // إنشاء قائمة السنوات (من 2020 إلى 2030)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2020; year <= 2030; year++) {
      years.push(year.toString());
    }
    return years;
  };

  const years = generateYears();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Receipt className="w-7 h-7 text-blue-600" />
          {due ? 'تعديل مستحق' : 'إضافة مستحق جديد'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {due ? 'تعديل بيانات المستحق المحدد' : 'إضافة مستحق جديد للموظف'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* اختيار نوع المستحق */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            نوع المستحق *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                handleInputChange('targetType', 'employee');
                handleInputChange('targetId', '');
              }}
              className={`p-4 border-2 rounded-lg transition-all text-center ${
                formData.targetType === 'employee'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <User className="w-6 h-6" />
              </div>
              <h4 className="font-medium">موظف</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                مستحق خاص بموظف
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                handleInputChange('targetType', 'vehicle');
                handleInputChange('targetId', '');
              }}
              className={`p-4 border-2 rounded-lg transition-all text-center ${
                formData.targetType === 'vehicle'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <Car className="w-6 h-6" />
              </div>
              <h4 className="font-medium">مركبة</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                مستحق خاص بمركبة
              </p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* اختيار الموظف أو المركبة */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {formData.targetType === 'employee' ? 'الموظف *' : 'المركبة *'}
            </label>
            <select
              value={formData.targetId}
              onChange={(e) => handleInputChange('targetId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">
                {formData.targetType === 'employee' ? 'اختر الموظف' : 'اختر المركبة'}
              </option>
              {formData.targetType === 'employee'
                ? employees.filter(emp => emp.isActive).map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.employeeNumber} - {employee.firstName} {employee.lastName} ({employee.jobTitle || 'غير محدد'})
                    </option>
                  ))
                : vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.plateNumber} - {vehicle.model} ({vehicle.year})
                    </option>
                  ))
              }
            </select>
          </div>



          {/* السنة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              السنة *
            </label>
            <select
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
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

          {/* التاريخ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تاريخ المستحق *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* الوصف */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الوصف *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="أدخل وصف المستحق..."
              required
            />
          </div>
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
            {due ? 'تحديث المستحق' : 'حفظ المستحق'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DueForm;
