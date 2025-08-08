import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Ship, Package, DollarSign, Calendar, Filter } from 'lucide-react';
import { ShippingBill } from '../../types';
import ShippingBillForm from './ShippingBillForm';

const ShippingBillsList: React.FC = () => {
  const [shippingBills, setShippingBills] = useState<ShippingBill[]>([
    {
      id: '1',
      billNumber: 'SB-2024-001',
      date: '2024-02-15',
      shipper: {
        name: 'شركة التجارة المتقدمة',
        address: 'الرياض، حي الملك فهد',
        phone: '0112345678',
        email: 'info@trade.com'
      },
      receiver: {
        name: 'مؤسسة الاستيراد والتصدير',
        address: 'جدة، حي الروضة',
        phone: '0126789012',
        email: 'import@export.com'
      },
      pickupLocation: 'مستودع الرياض الرئيسي',
      deliveryLocation: 'ميناء جدة الإسلامي',
      shippingMethod: 'land',
      transportMeans: 'truck',
      containerCount: 2,
      totalWeight: 15000,
      volume: 45,
      description: 'مواد غذائية مجمدة',
      trackingNumber: 'TRK-2024-001',
      containers: [
        {
          id: '1',
          number: 'CONT-001',
          type: 'مبرد',
          weight: 7500,
          dimensions: '6x2.5x2.5',
          notes: 'يحتاج تبريد مستمر'
        },
        {
          id: '2',
          number: 'CONT-002',
          type: 'مبرد',
          weight: 7500,
          dimensions: '6x2.5x2.5',
          notes: 'يحتاج تبريد مستمر'
        }
      ],
      shippingInstructions: 'التعامل بحذر - مواد قابلة للتلف',
      financial: {
        shipmentValue: 250000,
        currency: 'SAR',
        paymentMethod: 'bank_transfer',
        transportCost: 8500,
        insuranceCost: 2500,
        customsCost: 1200,
        totalCost: 12200,
        paymentStatus: 'paid',
        financialNotes: 'تم الدفع بالكامل'
      },
      signatures: {
        shipper: { name: 'أحمد محمد', date: '2024-02-15' },
        carrier: { name: 'مؤسسة القعوط', date: '2024-02-15' },
        receiver: { name: 'محمد أحمد', date: '2024-02-16' }
      },
      attachments: []
    },
    {
      id: '2',
      billNumber: 'SB-2024-002',
      date: '2024-02-18',
      shipper: {
        name: 'مصنع الأجهزة الإلكترونية',
        address: 'الدمام، المنطقة الصناعية',
        phone: '0138765432'
      },
      receiver: {
        name: 'متجر الإلكترونيات الحديثة',
        address: 'الرياض، حي العليا',
        phone: '0119876543'
      },
      pickupLocation: 'مصنع الدمام',
      deliveryLocation: 'مستودع الرياض',
      shippingMethod: 'land',
      transportMeans: 'truck',
      containerCount: 1,
      totalWeight: 5000,
      volume: 20,
      description: 'أجهزة إلكترونية',
      containers: [
        {
          id: '3',
          number: 'CONT-003',
          type: 'عادي',
          weight: 5000,
          dimensions: '4x2x2',
          notes: 'حساس للصدمات'
        }
      ],
      financial: {
        shipmentValue: 150000,
        currency: 'SAR',
        paymentMethod: 'cash',
        transportCost: 4500,
        insuranceCost: 1500,
        customsCost: 0,
        totalCost: 6000,
        paymentStatus: 'unpaid'
      },
      signatures: {
        shipper: { name: 'سالم أحمد', date: '2024-02-18' },
        carrier: { name: 'مؤسسة القعوط', date: '2024-02-18' },
        receiver: { name: '', date: '' }
      },
      attachments: []
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState<ShippingBill | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const handleAddBill = () => {
    setEditingBill(null);
    setShowForm(true);
  };

  const handleEditBill = (bill: ShippingBill) => {
    setEditingBill(bill);
    setShowForm(true);
  };

  const handleDeleteBill = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه البوليصة؟')) {
      setShippingBills(shippingBills.filter(bill => bill.id !== id));
    }
  };

  const handleSaveBill = (billData: Omit<ShippingBill, 'id'>) => {
    if (editingBill) {
      setShippingBills(shippingBills.map(bill => 
        bill.id === editingBill.id 
          ? { ...billData, id: editingBill.id }
          : bill
      ));
    } else {
      const newBill: ShippingBill = {
        ...billData,
        id: Date.now().toString()
      };
      setShippingBills([...shippingBills, newBill]);
    }
    setShowForm(false);
    setEditingBill(null);
  };

  const getShippingMethodText = (method: string) => {
    const methodMap: { [key: string]: string } = {
      sea: 'بحري',
      air: 'جوي',
      land: 'بري'
    };
    return methodMap[method] || method;
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      paid: 'مدفوع',
      unpaid: 'غير مدفوع',
      partial: 'مدفوع جزئياً'
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'unpaid':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredBills = shippingBills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.shipper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || bill.financial.paymentStatus === statusFilter;
    const matchesMethod = methodFilter === 'all' || bill.shippingMethod === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // إحصائيات سريعة
  const totalBills = shippingBills.length;
  const paidBills = shippingBills.filter(bill => bill.financial.paymentStatus === 'paid').length;
  const unpaidBills = shippingBills.filter(bill => bill.financial.paymentStatus === 'unpaid').length;
  const totalRevenue = shippingBills
    .filter(bill => bill.financial.paymentStatus === 'paid')
    .reduce((sum, bill) => sum + bill.financial.totalCost, 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              بوليصات الشحن
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              إدارة ومتابعة بوليصات الشحن والنقل
            </p>
          </div>
          <button
            onClick={handleAddBill}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة بوليصة شحن
          </button>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي البوليصات</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalBills}</p>
              </div>
              <Ship className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">مدفوعة</p>
                <p className="text-2xl font-bold text-green-600">{paidBills}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">غير مدفوعة</p>
                <p className="text-2xl font-bold text-red-600">{unpaidBills}</p>
              </div>
              <Package className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-blue-600">{totalRevenue.toLocaleString()} ر.س</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* البحث */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="البحث في البوليصات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* فلتر حالة الدفع */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">جميع حالات الدفع</option>
              <option value="paid">مدفوع</option>
              <option value="unpaid">غير مدفوع</option>
              <option value="partial">مدفوع جزئياً</option>
            </select>
          </div>

          {/* فلتر طريقة الشحن */}
          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">جميع طرق الشحن</option>
              <option value="sea">بحري</option>
              <option value="air">جوي</option>
              <option value="land">بري</option>
            </select>
          </div>
        </div>
      </div>

      {/* جدول البوليصات */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  رقم البوليصة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الشاحن
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  المستلم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  طريقة الشحن
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  التكلفة الإجمالية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  حالة الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {bill.billNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <div className="font-medium">{bill.shipper.name}</div>
                      <div className="text-gray-500 dark:text-gray-400">{bill.shipper.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <div className="font-medium">{bill.receiver.name}</div>
                      <div className="text-gray-500 dark:text-gray-400">{bill.receiver.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {getShippingMethodText(bill.shippingMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {bill.financial.totalCost.toLocaleString()} {bill.financial.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(bill.financial.paymentStatus)}`}>
                      {getPaymentStatusText(bill.financial.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(bill.date).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditBill(bill)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBill(bill.id)}
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

        {filteredBills.length === 0 && (
          <div className="text-center py-12">
            <Ship className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد بوليصات شحن</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'لا توجد بوليصات مطابقة للبحث' : 'ابدأ بإضافة بوليصة شحن جديدة'}
            </p>
          </div>
        )}
      </div>

      {/* نموذج إضافة/تعديل البوليصة */}
      {showForm && (
        <ShippingBillForm
          bill={editingBill}
          onSave={handleSaveBill}
          onCancel={() => {
            setShowForm(false);
            setEditingBill(null);
          }}
        />
      )}
    </div>
  );
};

export default ShippingBillsList;
