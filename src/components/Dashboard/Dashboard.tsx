import React from 'react';
import DashboardStats from './DashboardStats';
import { DashboardStats as StatsType } from '../../types';
import { Calendar, Clock, AlertCircle, CheckCircle, Briefcase, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  // بيانات تجريبية
  const stats: StatsType = {
    totalEmployees: 45,
    activeEmployees: 42,
    totalVehicles: 28,
    workingVehicles: 25,
    totalAdvances: 15,
    totalAdvanceAmount: 125000,
    paidAdvanceAmount: 85000,
    unpaidAdvanceAmount: 40000,
    expiredDocuments: 8,
    totalShippingBills: 156,
    // إحصائيات الخدمات
    totalServices: 24,
    totalServicesAmount: 18500,
    paidServicesAmount: 12300,
    unpaidServicesAmount: 6200
  };

  const recentActivities = [
    {
      id: 1,
      type: 'employee',
      message: 'تم إضافة موظف جديد: أحمد محمد علي',
      time: 'منذ ساعتين',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'vehicle',
      message: 'تحديث صيانة المركبة رقم: ABC-123',
      time: 'منذ 4 ساعات',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'document',
      message: 'تنبيه: انتهاء صلاحية رخصة القيادة للموظف محمد أحمد',
      time: 'منذ يوم',
      icon: AlertCircle,
      color: 'text-red-600'
    },
    {
      id: 4,
      type: 'shipping',
      message: 'تم إنشاء بوليصة شحن جديدة رقم: SH-2024-001',
      time: 'منذ يومين',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: 'تجديد رخصة البلدية',
      dueDate: '2024-02-15',
      priority: 'high'
    },
    {
      id: 2,
      task: 'صيانة دورية للمركبة رقم XYZ-456',
      dueDate: '2024-02-20',
      priority: 'medium'
    },
    {
      id: 3,
      task: 'مراجعة عقود الموظفين',
      dueDate: '2024-02-25',
      priority: 'low'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          لوحة التحكم
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          نظرة عامة على أداء مؤسسة القعوط للخدمات اللوجستية
        </p>
      </div>

      {/* الإحصائيات */}
      <DashboardStats stats={stats} />

      {/* إحصائيات الخدمات المفصلة */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            تفاصيل إحصائيات الخدمات
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            نظرة شاملة على الخدمات والمدفوعات
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* إجمالي عدد الخدمات */}
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-800/30 rounded-full mx-auto mb-3">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalServices}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                إجمالي عدد الخدمات
              </p>
            </div>

            {/* إجمالي مبالغ الخدمات */}
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-800/30 rounded-full mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalServicesAmount.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                إجمالي مبالغ الخدمات (ريال)
              </p>
            </div>

            {/* إجمالي المسدد */}
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-800/30 rounded-full mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.paidServicesAmount.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                إجمالي المسدد (ريال)
              </p>
            </div>

            {/* إجمالي غير المسدد */}
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-800/30 rounded-full mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.unpaidServicesAmount.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                إجمالي غير المسدد (ريال)
              </p>
            </div>
          </div>

          {/* نسبة السداد */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                نسبة السداد
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {((stats.paidServicesAmount / stats.totalServicesAmount) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(stats.paidServicesAmount / stats.totalServicesAmount) * 100}%`
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>مسدد: {stats.paidServicesAmount.toLocaleString()} ريال</span>
              <span>غير مسدد: {stats.unpaidServicesAmount.toLocaleString()} ريال</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الأنشطة الأخيرة */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              الأنشطة الأخيرة
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700`}>
                      <Icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* المهام القادمة */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              المهام القادمة
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.task}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task.dueDate}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;