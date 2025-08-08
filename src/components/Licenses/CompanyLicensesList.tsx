import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { CompanyLicense } from '../../types';
import CompanyLicenseForm from './CompanyLicenseForm';

const CompanyLicensesList: React.FC = () => {
  const [licenses, setLicenses] = useState<CompanyLicense[]>([
    {
      id: '1',
      type: 'commercial_register',
      name: 'السجل التجاري',
      number: 'CR-1234567890',
      expiryDate: '2025-12-31',
      status: 'valid',
      attachments: []
    },
    {
      id: '2',
      type: 'municipal_license',
      name: 'الرخصة البلدية',
      number: 'ML-9876543210',
      expiryDate: '2024-03-15',
      status: 'expired',
      attachments: []
    },
    {
      id: '3',
      type: 'civil_defense',
      name: 'شهادة الدفاع المدني',
      number: 'CD-5555666677',
      expiryDate: '2024-08-20',
      status: 'valid',
      attachments: []
    },
    {
      id: '4',
      type: 'transport_authority',
      name: 'ترخيص هيئة النقل',
      number: 'TA-1111222233',
      expiryDate: '2024-06-30',
      status: 'valid',
      attachments: []
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingLicense, setEditingLicense] = useState<CompanyLicense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddLicense = () => {
    setEditingLicense(null);
    setShowForm(true);
  };

  const handleEditLicense = (license: CompanyLicense) => {
    setEditingLicense(license);
    setShowForm(true);
  };

  const handleDeleteLicense = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الترخيص؟')) {
      setLicenses(licenses.filter(license => license.id !== id));
    }
  };

  const handleSaveLicense = (licenseData: Omit<CompanyLicense, 'id' | 'status'>) => {
    // تحديد حالة الترخيص تلقائياً بناءً على تاريخ الانتهاء
    const today = new Date();
    const expiryDate = new Date(licenseData.expiryDate);
    const status = expiryDate > today ? 'valid' : 'expired';

    if (editingLicense) {
      setLicenses(licenses.map(license => 
        license.id === editingLicense.id 
          ? { ...licenseData, id: editingLicense.id, status }
          : license
      ));
    } else {
      const newLicense: CompanyLicense = {
        ...licenseData,
        id: Date.now().toString(),
        status
      };
      setLicenses([...licenses, newLicense]);
    }
    setShowForm(false);
    setEditingLicense(null);
  };

  const getLicenseTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      commercial_register: 'السجل التجاري',
      municipal_license: 'الرخصة البلدية',
      transport_authority: 'ترخيص هيئة النقل',
      civil_defense: 'شهادة الدفاع المدني',
      tax_certificate: 'الشهادة الضريبية'
    };
    return typeMap[type] || type;
  };

  const getLicenseStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysUntilExpiry < 0) {
      return {
        status: 'منتهي الصلاحية',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900',
        icon: <AlertTriangle className="w-4 h-4" />
      };
    } else if (daysUntilExpiry <= 30) {
      return {
        status: `ينتهي خلال ${daysUntilExpiry} يوم`,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900',
        icon: <Clock className="w-4 h-4" />
      };
    } else {
      return {
        status: 'ساري المفعول',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900',
        icon: <CheckCircle className="w-4 h-4" />
      };
    }
  };

  const filteredLicenses = licenses.filter(license =>
    license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getLicenseTypeText(license.type).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // إحصائيات سريعة
  const validLicenses = licenses.filter(license => {
    const today = new Date();
    const expiryDate = new Date(license.expiryDate);
    return expiryDate > today;
  }).length;

  const expiredLicenses = licenses.filter(license => {
    const today = new Date();
    const expiryDate = new Date(license.expiryDate);
    return expiryDate <= today;
  }).length;

  const expiringLicenses = licenses.filter(license => {
    const today = new Date();
    const expiryDate = new Date(license.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  }).length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              تراخيص المنشأة
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              إدارة ومتابعة تراخيص وشهادات المؤسسة
            </p>
          </div>
          <button
            onClick={handleAddLicense}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة ترخيص
          </button>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي التراخيص</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{licenses.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ساري المفعول</p>
                <p className="text-2xl font-bold text-green-600">{validLicenses}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ينتهي قريباً</p>
                <p className="text-2xl font-bold text-yellow-600">{expiringLicenses}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">منتهي الصلاحية</p>
                <p className="text-2xl font-bold text-red-600">{expiredLicenses}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* شريط البحث */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="البحث في التراخيص..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* جدول التراخيص */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  نوع الترخيص
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  اسم الترخيص
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  رقم الترخيص
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  تاريخ الانتهاء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  المرفقات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLicenses.map((license) => {
                const status = getLicenseStatus(license.expiryDate);
                return (
                  <tr key={license.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getLicenseTypeText(license.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {license.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {license.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(license.expiryDate).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                        {status.icon}
                        {status.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {license.attachments && license.attachments.length > 0 ? (
                        <span className="text-blue-600 dark:text-blue-400">
                          {license.attachments.length} ملف
                        </span>
                      ) : (
                        <span className="text-gray-400">لا توجد مرفقات</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditLicense(license)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLicense(license.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="حذف"
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

        {filteredLicenses.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد تراخيص</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'لا توجد تراخيص مطابقة للبحث' : 'ابدأ بإضافة ترخيص جديد'}
            </p>
          </div>
        )}
      </div>

      {/* نموذج إضافة/تعديل الترخيص */}
      {showForm && (
        <CompanyLicenseForm
          license={editingLicense}
          onSave={handleSaveLicense}
          onCancel={() => {
            setShowForm(false);
            setEditingLicense(null);
          }}
        />
      )}
    </div>
  );
};

export default CompanyLicensesList;
