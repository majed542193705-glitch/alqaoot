import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter, Car, AlertTriangle, CheckCircle } from 'lucide-react';
import { Vehicle } from '../../types';
import VehicleForm from './VehicleForm';
import DriverList from './DriverList';

const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      serialNumber: 1,
      ownerId: '1',
      plateNumber: 'ABC-123',
      brand: 'تويوتا',
      model: 'كامري',
      year: 2020,
      color: 'أبيض',
      type: 'sedan',
      status: 'working',
      mileage: 45000,
      lastMaintenanceDate: '2024-01-15',
      nextMaintenanceDate: '2024-07-15',
      ownership: 'company',
      ownershipType: 'alqaoot_company',
      purchaseDate: '2020-03-01',
      value: 85000
    },
    {
      id: '3',
      serialNumber: 3,
      ownerId: '1',
      plateNumber: 'DEF-789',
      brand: 'هونداي',
      model: 'إلنترا',
      year: 2018,
      color: 'فضي',
      type: 'sedan',
      status: 'sold',
      mileage: 95000,
      lastMaintenanceDate: '2023-12-01',
      nextMaintenanceDate: '2024-06-01',
      ownership: 'external',
      ownershipType: 'employee',
      purchaseDate: '2018-01-10',
      value: 65000,
      saleDate: '2024-01-15',
      saleValue: 45000
    },
    {
      id: '2',
      serialNumber: 2,
      ownerId: '1',
      plateNumber: 'XYZ-456',
      brand: 'نيسان',
      model: 'باترول',
      year: 2019,
      color: 'أسود',
      type: 'suv',
      status: 'working',
      mileage: 62000,
      lastMaintenanceDate: '2024-02-10',
      nextMaintenanceDate: '2024-08-10',
      ownership: 'company',
      ownershipType: 'bank',
      purchaseDate: '2019-05-15',
      value: 120000
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('vehicles');

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المركبة؟')) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    }
  };

  const handleSaveVehicle = (vehicleData: Omit<Vehicle, 'id' | 'serialNumber'>) => {
    if (editingVehicle) {
      setVehicles(vehicles.map(vehicle => 
        vehicle.id === editingVehicle.id 
          ? { ...vehicleData, id: editingVehicle.id, serialNumber: editingVehicle.serialNumber }
          : vehicle
      ));
    } else {
      const newVehicle: Vehicle = {
        ...vehicleData,
        id: Date.now().toString(),
        serialNumber: Math.max(...vehicles.map(v => v.serialNumber), 0) + 1
      };
      setVehicles([...vehicles, newVehicle]);
    }
    setShowForm(false);
    setEditingVehicle(null);
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || vehicle.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'broken':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'sold':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working': return 'تعمل';
      case 'broken': return 'متعطلة';
      case 'sold': return 'مباعة';
      default: return status;
    }
  };

  const getOwnershipTypeText = (ownershipType: string) => {
    switch (ownershipType) {
      case 'alqaoot_company': return 'مؤسسة القعوط للخدمات اللوجستية';
      case 'bank': return 'البنوك';
      case 'employee': return 'موظف';
      default: return ownershipType;
    }
  };



  if (showForm) {
    return (
      <VehicleForm
        vehicle={editingVehicle}
        onSave={handleSaveVehicle}
        onCancel={() => {
          setShowForm(false);
          setEditingVehicle(null);
        }}
      />
    );
  }

  const tabs = [
    { id: 'vehicles', label: 'المركبات', icon: Car },
    { id: 'drivers', label: 'السائقين', icon: Eye }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            إدارة المركبات والتفاويض
          </h1>
          {activeTab === 'vehicles' && (
            <button
              onClick={handleAddVehicle}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة مركبة</span>
            </button>
          )}
        </div>

        {/* التبويبات */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8 rtl:space-x-reverse">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 rtl:space-x-reverse ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* محتوى التبويبات */}
        {activeTab === 'vehicles' && (
          <>
            {/* شريط البحث والفلترة */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث برقم اللوحة أو الماركة أو الموديل..."
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
                  <option value="working">تعمل</option>
                  <option value="broken">متعطلة</option>
                  <option value="sold">مباعة</option>
                </select>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">إجمالي المركبات</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{vehicles.length}</p>
                  </div>
                  <Car className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">تعمل</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {vehicles.filter(v => v.status === 'working').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 dark:text-red-400">متعطلة</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                      {vehicles.filter(v => v.status === 'broken').length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              

            </div>

            {/* جدول المركبات */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        الرقم التسلسلي
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        رقم اللوحة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        الماركة والموديل
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        النوع
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        نوع الملكية
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        معلومات البيع
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {vehicle.serialNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {vehicle.plateNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {vehicle.type === 'sedan' ? 'سيدان' :
                           vehicle.type === 'suv' ? 'دفع رباعي' :
                           vehicle.type === 'truck' ? 'شاحنة' :
                           vehicle.type === 'dyna' ? 'دينا' : 'فان'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                            {getOwnershipTypeText(vehicle.ownershipType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                            {getStatusText(vehicle.status)}
                          </span>
                        </td>

                        {/* عمود معلومات البيع */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {vehicle.status === 'sold' ? (
                            <div className="space-y-1">
                              {vehicle.saleDate && (
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  تاريخ البيع: {new Date(vehicle.saleDate).toLocaleDateString('ar-SA')}
                                </div>
                              )}
                              {vehicle.saleValue && (
                                <div className="text-xs font-medium">
                                  قيمة البيع: {vehicle.saleValue.toLocaleString()} ريال
                                </div>
                              )}
                              {vehicle.value && vehicle.saleValue && (
                                <div className={`text-xs font-bold ${
                                  vehicle.saleValue >= vehicle.value
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {vehicle.saleValue >= vehicle.value ? 'ربح' : 'خسارة'}: {' '}
                                  {Math.abs(vehicle.saleValue - vehicle.value).toLocaleString()} ريال
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-xs">
                              غير مباعة
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <button
                              onClick={() => handleEditVehicle(vehicle)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(vehicle.id)}
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

              {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    لا توجد مركبات مطابقة لمعايير البحث
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'drivers' && <DriverList />}
      </div>
    </div>
  );
};

export default VehicleList;