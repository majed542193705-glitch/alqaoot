import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ServiceRequest } from '../../types';

const ServicesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // بيانات تجريبية للطلبات
  const [serviceRequests] = useState<ServiceRequest[]>([
    {
      id: '1',
      serviceId: 'srv-001',
      serviceName: 'خدمة النقل المحلي',
      requestNumber: 'SR-2024-001',
      client: {
        name: 'أحمد محمد علي',
        phone: '0501234567',
        email: 'ahmed@example.com',
        address: 'الرياض، حي النخيل'
      },
      description: 'نقل بضائع من المستودع إلى العميل',
      urgency: 'medium',
      requestedDate: '2024-02-15',
      expectedCompletionDate: '2024-02-17',
      status: 'in_progress',
      estimatedCost: 500,
      finalCost: 450,
      createdAt: '2024-02-10T10:00:00Z',
      updatedAt: '2024-02-12T14:30:00Z',
      assignedTo: 'emp-001'
    },
    {
      id: '2',
      serviceId: 'srv-002',
      serviceName: 'خدمة التخليص الجمركي',
      requestNumber: 'SR-2024-002',
      client: {
        name: 'شركة التجارة المتقدمة',
        phone: '0112345678',
        email: 'info@trade.com',
        companyName: 'شركة التجارة المتقدمة',
        taxNumber: '123456789'
      },
      description: 'تخليص جمركي لشحنة مواد غذائية',
      urgency: 'high',
      requestedDate: '2024-02-20',
      status: 'pending',
      estimatedCost: 1200,
      createdAt: '2024-02-14T09:15:00Z',
      updatedAt: '2024-02-14T09:15:00Z'
    },
    {
      id: '3',
      serviceId: 'srv-003',
      serviceName: 'خدمة التوثيق والأوراق',
      requestNumber: 'SR-2024-003',
      client: {
        name: 'فاطمة عبدالله',
        phone: '0551234567',
        email: 'fatima@example.com'
      },
      description: 'توثيق مستندات تجارية',
      urgency: 'low',
      requestedDate: '2024-02-25',
      status: 'completed',
      estimatedCost: 300,
      finalCost: 300,
      createdAt: '2024-02-08T11:20:00Z',
      updatedAt: '2024-02-18T16:45:00Z',
      completedAt: '2024-02-18T16:45:00Z'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'في الانتظار',
      approved: 'موافق عليه',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      rejected: 'مرفوض'
    };
    return statusMap[status] || status;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyText = (urgency: string) => {
    const urgencyMap: { [key: string]: string } = {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية',
      urgent: 'عاجلة'
    };
    return urgencyMap[urgency] || urgency;
  };

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePayment = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowPaymentForm(true);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          إدارة الخدمات
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          إدارة طلبات الخدمات والمدفوعات
        </p>
      </div>

      {/* شريط الأدوات */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* البحث */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white w-full sm:w-64"
              />
            </div>

            {/* فلتر الحالة */}
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">في الانتظار</option>
                <option value="approved">موافق عليه</option>
                <option value="in_progress">قيد التنفيذ</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowRequestForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              طلب خدمة جديد
            </button>
          </div>
        </div>
      </div>

      {/* جدول الطلبات */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  رقم الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الخدمة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الأولوية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  التكلفة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  تاريخ الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {request.requestNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {request.serviceName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <div className="font-medium">{request.client.name}</div>
                      <div className="text-gray-500 dark:text-gray-400">{request.client.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(request.urgency)}`}>
                      {getUrgencyText(request.urgency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className="text-sm text-gray-900 dark:text-white">
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <div>المقدرة: {request.estimatedCost.toLocaleString()} ر.س</div>
                      {request.finalCost && (
                        <div className="text-green-600 dark:text-green-400">
                          النهائية: {request.finalCost.toLocaleString()} ر.س
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(request.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      {(request.status === 'completed' || request.status === 'approved') && (
                        <button
                          onClick={() => handlePayment(request)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 text-xs bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded"
                        >
                          دفع
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              لا توجد طلبات خدمات مطابقة للبحث
            </div>
          </div>
        )}
      </div>

      {/* النماذج المنبثقة */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-bold mb-4">طلب خدمة جديد</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">سيتم إضافة نموذج طلب الخدمة هنا</p>
            <button
              onClick={() => setShowRequestForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {showPaymentForm && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-bold mb-4">سداد قيمة الخدمة</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              طلب رقم: {selectedRequest.requestNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">سيتم إضافة نموذج الدفع هنا</p>
            <button
              onClick={() => {
                setShowPaymentForm(false);
                setSelectedRequest(null);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesList;
