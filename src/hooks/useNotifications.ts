import { useMemo } from 'react';
import { VehiclePermit, VehicleInsurance, VehicleOperatingCard, DriverCard, Vehicle } from '../types';

interface Notification {
  id: string;
  type: 'permit' | 'insurance' | 'operating-card' | 'driver-card';
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  status: 'expired' | 'expiring_soon';
  expiryDate: string;
  daysRemaining: number;
  title: string;
  message: string;
}

interface UseNotificationsProps {
  permits?: VehiclePermit[];
  insurances?: VehicleInsurance[];
  operatingCards?: VehicleOperatingCard[];
  driverCards?: DriverCard[];
  vehicles?: Vehicle[];
  language?: 'ar' | 'en';
}

export const useNotifications = ({
  permits = [],
  insurances = [],
  operatingCards = [],
  driverCards = [],
  vehicles = [],
  language = 'ar'
}: UseNotificationsProps = {}) => {
  
  const notifications = useMemo(() => {
    const today = new Date();
    const allNotifications: Notification[] = [];

    // دالة مساعدة للحصول على معلومات المركبة
    const getVehicleInfo = (vehicleId: string) => {
      return vehicles.find(v => v.id === vehicleId);
    };

    // دالة مساعدة لحساب الأيام المتبقية
    const calculateDaysRemaining = (expiryDate: string) => {
      const expiry = new Date(expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // دالة مساعدة لتحديد حالة الوثيقة
    const getDocumentStatus = (expiryDate: string): 'expired' | 'expiring_soon' | 'valid' => {
      const daysRemaining = calculateDaysRemaining(expiryDate);
      if (daysRemaining < 0) return 'expired';
      if (daysRemaining <= 30) return 'expiring_soon';
      return 'valid';
    };

    // معالجة التفاويض
    permits.forEach(permit => {
      if (!permit.endDate) return; // تجاهل التفاويض بدون تاريخ انتهاء
      
      const status = getDocumentStatus(permit.endDate);
      if (status === 'expired' || status === 'expiring_soon') {
        const vehicle = getVehicleInfo(permit.vehicleId);
        const daysRemaining = calculateDaysRemaining(permit.endDate);
        
        allNotifications.push({
          id: `permit-${permit.id}`,
          type: 'permit',
          vehicleId: permit.vehicleId,
          vehiclePlate: vehicle?.plateNumber || 'غير محدد',
          vehicleModel: vehicle?.model || 'غير محدد',
          status,
          expiryDate: permit.endDate,
          daysRemaining,
          title: status === 'expired' 
            ? (language === 'ar' ? 'تفويض منتهي' : 'Expired Permit')
            : (language === 'ar' ? 'تفويض ينتهي قريباً' : 'Permit Expiring Soon'),
          message: status === 'expired'
            ? (language === 'ar' ? `تفويض المركبة منتهي منذ ${Math.abs(daysRemaining)} يوم` : `Vehicle permit expired ${Math.abs(daysRemaining)} days ago`)
            : (language === 'ar' ? `تفويض المركبة ينتهي خلال ${daysRemaining} يوم` : `Vehicle permit expires in ${daysRemaining} days`)
        });
      }
    });

    // معالجة التأمين
    insurances.forEach(insurance => {
      const status = getDocumentStatus(insurance.expiryDate);
      if (status === 'expired' || status === 'expiring_soon') {
        const vehicle = getVehicleInfo(insurance.vehicleId);
        const daysRemaining = calculateDaysRemaining(insurance.expiryDate);
        
        allNotifications.push({
          id: `insurance-${insurance.id}`,
          type: 'insurance',
          vehicleId: insurance.vehicleId,
          vehiclePlate: vehicle?.plateNumber || 'غير محدد',
          vehicleModel: vehicle?.model || 'غير محدد',
          status,
          expiryDate: insurance.expiryDate,
          daysRemaining,
          title: status === 'expired' 
            ? (language === 'ar' ? 'تأمين منتهي' : 'Expired Insurance')
            : (language === 'ar' ? 'تأمين ينتهي قريباً' : 'Insurance Expiring Soon'),
          message: status === 'expired'
            ? (language === 'ar' ? `تأمين المركبة منتهي منذ ${Math.abs(daysRemaining)} يوم` : `Vehicle insurance expired ${Math.abs(daysRemaining)} days ago`)
            : (language === 'ar' ? `تأمين المركبة ينتهي خلال ${daysRemaining} يوم` : `Vehicle insurance expires in ${daysRemaining} days`)
        });
      }
    });

    // معالجة كروت التشغيل
    operatingCards.forEach(card => {
      const status = getDocumentStatus(card.expiryDate);
      if (status === 'expired' || status === 'expiring_soon') {
        const vehicle = getVehicleInfo(card.vehicleId);
        const daysRemaining = calculateDaysRemaining(card.expiryDate);
        
        allNotifications.push({
          id: `operating-card-${card.id}`,
          type: 'operating-card',
          vehicleId: card.vehicleId,
          vehiclePlate: vehicle?.plateNumber || 'غير محدد',
          vehicleModel: vehicle?.model || 'غير محدد',
          status,
          expiryDate: card.expiryDate,
          daysRemaining,
          title: status === 'expired' 
            ? (language === 'ar' ? 'كرت تشغيل منتهي' : 'Expired Operating Card')
            : (language === 'ar' ? 'كرت تشغيل ينتهي قريباً' : 'Operating Card Expiring Soon'),
          message: status === 'expired'
            ? (language === 'ar' ? `كرت تشغيل المركبة منتهي منذ ${Math.abs(daysRemaining)} يوم` : `Vehicle operating card expired ${Math.abs(daysRemaining)} days ago`)
            : (language === 'ar' ? `كرت تشغيل المركبة ينتهي خلال ${daysRemaining} يوم` : `Vehicle operating card expires in ${daysRemaining} days`)
        });
      }
    });

    // معالجة بطاقات السائقين
    driverCards.forEach(card => {
      const status = getDocumentStatus(card.expiryDate);
      if (status === 'expired' || status === 'expiring_soon') {
        const vehicle = getVehicleInfo(card.vehicleId);
        const daysRemaining = calculateDaysRemaining(card.expiryDate);
        
        allNotifications.push({
          id: `driver-card-${card.id}`,
          type: 'driver-card',
          vehicleId: card.vehicleId,
          vehiclePlate: vehicle?.plateNumber || 'غير محدد',
          vehicleModel: vehicle?.model || 'غير محدد',
          status,
          expiryDate: card.expiryDate,
          daysRemaining,
          title: status === 'expired' 
            ? (language === 'ar' ? 'بطاقة سائق منتهية' : 'Expired Driver Card')
            : (language === 'ar' ? 'بطاقة سائق تنتهي قريباً' : 'Driver Card Expiring Soon'),
          message: status === 'expired'
            ? (language === 'ar' ? `بطاقة السائق منتهية منذ ${Math.abs(daysRemaining)} يوم` : `Driver card expired ${Math.abs(daysRemaining)} days ago`)
            : (language === 'ar' ? `بطاقة السائق تنتهي خلال ${daysRemaining} يوم` : `Driver card expires in ${daysRemaining} days`)
        });
      }
    });

    // ترتيب التنبيهات حسب الأولوية (المنتهية أولاً، ثم التي تنتهي قريباً)
    return allNotifications.sort((a, b) => {
      if (a.status === 'expired' && b.status !== 'expired') return -1;
      if (b.status === 'expired' && a.status !== 'expired') return 1;
      return a.daysRemaining - b.daysRemaining;
    });
  }, [permits, insurances, operatingCards, driverCards, vehicles, language]);

  const expiredCount = notifications.filter(n => n.status === 'expired').length;
  const expiringSoonCount = notifications.filter(n => n.status === 'expiring_soon').length;
  const totalCount = notifications.length;

  return {
    notifications,
    expiredCount,
    expiringSoonCount,
    totalCount
  };
};

export default useNotifications;
