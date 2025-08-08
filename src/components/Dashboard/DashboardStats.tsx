import React from 'react';
import { Users, Car, CreditCard, AlertTriangle, FileText, TrendingUp, Briefcase, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { DashboardStats as StatsType } from '../../types';

interface DashboardStatsProps {
  stats: StatsType;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'إجمالي الموظفين',
      value: stats.totalEmployees,
      subValue: `${stats.activeEmployees} نشط`,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'إجمالي المركبات',
      value: stats.totalVehicles,
      subValue: `${stats.workingVehicles} تعمل`,
      icon: Car,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'إجمالي السلف',
      value: stats.totalAdvances,
      subValue: `${stats.totalAdvanceAmount.toLocaleString()} ريال`,
      icon: CreditCard,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'السلف المسددة',
      value: `${stats.paidAdvanceAmount.toLocaleString()}`,
      subValue: 'ريال',
      icon: CheckCircle,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      textColor: 'text-teal-600 dark:text-teal-400'
    },
    {
      title: 'السلف غير المسددة',
      value: `${stats.unpaidAdvanceAmount.toLocaleString()}`,
      subValue: 'ريال',
      icon: XCircle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'إجمالي الخدمات المقدمة',
      value: stats.totalServices,
      subValue: 'خدمة',
      icon: Briefcase,
      color: 'bg-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      textColor: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      title: 'إجمالي مبالغ الخدمات',
      value: `${stats.totalServicesAmount.toLocaleString()}`,
      subValue: 'ريال',
      icon: DollarSign,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'مبالغ الخدمات المسددة',
      value: `${stats.paidServicesAmount.toLocaleString()}`,
      subValue: 'ريال',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'مبالغ الخدمات غير المسددة',
      value: `${stats.unpaidServicesAmount.toLocaleString()}`,
      subValue: 'ريال',
      icon: XCircle,
      color: 'bg-rose-500',
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
      textColor: 'text-rose-600 dark:text-rose-400'
    },
    {
      title: 'الوثائق المنتهية',
      value: stats.expiredDocuments,
      subValue: 'تحتاج تجديد',
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      title: 'بوليصات الشحن',
      value: stats.totalShippingBills,
      subValue: 'هذا الشهر',
      icon: FileText,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'معدل النمو',
      value: '12%',
      subValue: 'مقارنة بالشهر الماضي',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.textColor} mb-1`}>
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {card.subValue}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;