import React, { useState, useEffect } from 'react';
import { Save, Building, Shield, Bell, Database, Globe, Palette, Clock, Upload, X, Image } from 'lucide-react';
import { SystemSettings, CompanyInfo } from '../../types';
import { useCompany } from '../../contexts/CompanyContext';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [hasChanges, setHasChanges] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // استخدام CompanyContext
  const { companyInfo, updateCompanyInfo } = useCompany();

  // إعدادات النظام
  const [systemSettings, setSystemSettings] = useState<Partial<SystemSettings>>({
    systemName: 'نظام إدارة مؤسسة القعوط',
    systemVersion: '1.0.0',
    defaultLanguage: 'ar',
    defaultTheme: 'light',
    timezone: 'Asia/Riyadh',
    dateFormat: 'DD/MM/YYYY',
    currency: 'SAR',
    security: {
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: false,
      sessionTimeout: 30,
      maxLoginAttempts: 3,
      lockoutDuration: 15,
      enableTwoFactor: false
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      systemAlerts: true,
      documentExpiry: true,
      paymentReminders: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      retentionDays: 30,
      backupLocation: '/backups'
    }
  });

  const tabs = [
    { id: 'company', label: 'معلومات الشركة', icon: Building },
    { id: 'system', label: 'إعدادات النظام', icon: Globe },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: Database }
  ];

  // تحميل الشعار المحفوظ عند تحميل المكون
  useEffect(() => {
    if (companyInfo.logo) {
      setLogoPreview(companyInfo.logo);
    }
  }, [companyInfo.logo]);

  const handleCompanyChange = (field: string, value: string) => {
    const updatedInfo = { ...companyInfo, [field]: value };
    updateCompanyInfo(updatedInfo);
    setHasChanges(true);
  };

  const handleSystemChange = (field: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSecurityChange = (field: string, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      security: { ...prev.security!, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setSystemSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications!, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleBackupChange = (field: string, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      backup: { ...prev.backup!, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صالح');
        return;
      }

      // التحقق من حجم الملف (أقل من 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        updateCompanyInfo({ ...companyInfo, logo: result });
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    updateCompanyInfo({ ...companyInfo, logo: undefined });
    setHasChanges(true);
  };

  const handleSave = () => {
    // هنا يتم حفظ الإعدادات
    console.log('Company Info:', companyInfo);
    console.log('System Settings:', systemSettings);
    setHasChanges(false);
    alert('تم حفظ الإعدادات بنجاح');
  };

  const renderCompanySettings = () => (
    <div className="space-y-6">
      {/* قسم الشعار */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">شعار المؤسسة</h3>
        <div className="flex items-start gap-6">
          {/* عرض الشعار الحالي */}
          <div className="flex-shrink-0">
            {logoPreview || companyInfo.logo ? (
              <div className="relative">
                <img
                  src={logoPreview || companyInfo.logo}
                  alt="شعار المؤسسة"
                  className="w-32 h-32 object-contain border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  title="حذف الشعار"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                <div className="text-center">
                  <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">لا يوجد شعار</p>
                </div>
              </div>
            )}
          </div>

          {/* منطقة رفع الشعار */}
          <div className="flex-1">
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">انقر لرفع الشعار</span> أو اسحب وأفلت
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF حتى 5MB
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  الحجم المفضل: 200x200 بكسل
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>

            {/* معلومات إضافية */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <h4 className="font-medium mb-2">إرشادات الشعار:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>استخدم صورة عالية الجودة مع خلفية شفافة</li>
                <li>تأكد من وضوح الشعار في الأحجام الصغيرة</li>
                <li>يُفضل استخدام تنسيق PNG للشفافية</li>
                <li>سيظهر الشعار في رأس النظام والتقارير</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اسم الشركة (عربي) *
          </label>
          <input
            type="text"
            value={companyInfo.name || ''}
            onChange={(e) => handleCompanyChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اسم الشركة (إنجليزي)
          </label>
          <input
            type="text"
            value={companyInfo.nameEn || ''}
            onChange={(e) => handleCompanyChange('nameEn', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            العنوان *
          </label>
          <input
            type="text"
            value={companyInfo.address || ''}
            onChange={(e) => handleCompanyChange('address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            المدينة *
          </label>
          <input
            type="text"
            value={companyInfo.city || ''}
            onChange={(e) => handleCompanyChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الهاتف *
          </label>
          <input
            type="tel"
            value={companyInfo.phone || ''}
            onChange={(e) => handleCompanyChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            البريد الإلكتروني *
          </label>
          <input
            type="email"
            value={companyInfo.email || ''}
            onChange={(e) => handleCompanyChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الموقع الإلكتروني
          </label>
          <input
            type="url"
            value={companyInfo.website || ''}
            onChange={(e) => handleCompanyChange('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            السجل التجاري *
          </label>
          <input
            type="text"
            value={companyInfo.commercialRegister || ''}
            onChange={(e) => handleCompanyChange('commercialRegister', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الرقم الضريبي *
          </label>
          <input
            type="text"
            value={companyInfo.taxNumber || ''}
            onChange={(e) => handleCompanyChange('taxNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            رقم ضريبة القيمة المضافة
          </label>
          <input
            type="text"
            value={companyInfo.vatNumber || ''}
            onChange={(e) => handleCompanyChange('vatNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اسم النظام
          </label>
          <input
            type="text"
            value={systemSettings.systemName || ''}
            onChange={(e) => handleSystemChange('systemName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            إصدار النظام
          </label>
          <input
            type="text"
            value={systemSettings.systemVersion || ''}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اللغة الافتراضية
          </label>
          <select
            value={systemSettings.defaultLanguage || 'ar'}
            onChange={(e) => handleSystemChange('defaultLanguage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            المظهر الافتراضي
          </label>
          <select
            value={systemSettings.defaultTheme || 'light'}
            onChange={(e) => handleSystemChange('defaultTheme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="light">فاتح</option>
            <option value="dark">داكن</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            المنطقة الزمنية
          </label>
          <select
            value={systemSettings.timezone || 'Asia/Riyadh'}
            onChange={(e) => handleSystemChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="Asia/Riyadh">الرياض (GMT+3)</option>
            <option value="Asia/Dubai">دبي (GMT+4)</option>
            <option value="UTC">UTC (GMT+0)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            تنسيق التاريخ
          </label>
          <select
            value={systemSettings.dateFormat || 'DD/MM/YYYY'}
            onChange={(e) => handleSystemChange('dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            العملة الافتراضية
          </label>
          <select
            value={systemSettings.currency || 'SAR'}
            onChange={(e) => handleSystemChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="SAR">ريال سعودي (SAR)</option>
            <option value="USD">دولار أمريكي (USD)</option>
            <option value="EUR">يورو (EUR)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الحد الأدنى لطول كلمة المرور
          </label>
          <input
            type="number"
            min="6"
            max="20"
            value={systemSettings.security?.passwordMinLength || 8}
            onChange={(e) => handleSecurityChange('passwordMinLength', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            مهلة انتهاء الجلسة (دقيقة)
          </label>
          <input
            type="number"
            min="5"
            max="480"
            value={systemSettings.security?.sessionTimeout || 30}
            onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            عدد محاولات تسجيل الدخول
          </label>
          <input
            type="number"
            min="3"
            max="10"
            value={systemSettings.security?.maxLoginAttempts || 3}
            onChange={(e) => handleSecurityChange('maxLoginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            مدة الحظر (دقيقة)
          </label>
          <input
            type="number"
            min="5"
            max="60"
            value={systemSettings.security?.lockoutDuration || 15}
            onChange={(e) => handleSecurityChange('lockoutDuration', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">متطلبات كلمة المرور</h4>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={systemSettings.security?.passwordRequireUppercase || false}
              onChange={(e) => handleSecurityChange('passwordRequireUppercase', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
              يجب أن تحتوي على أحرف كبيرة
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={systemSettings.security?.passwordRequireNumbers || false}
              onChange={(e) => handleSecurityChange('passwordRequireNumbers', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
              يجب أن تحتوي على أرقام
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={systemSettings.security?.passwordRequireSymbols || false}
              onChange={(e) => handleSecurityChange('passwordRequireSymbols', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
              يجب أن تحتوي على رموز خاصة
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={systemSettings.security?.enableTwoFactor || false}
              onChange={(e) => handleSecurityChange('enableTwoFactor', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
              تفعيل المصادقة الثنائية
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">إعدادات الإشعارات</h3>

      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              إشعارات البريد الإلكتروني
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              إرسال إشعارات عبر البريد الإلكتروني
            </p>
          </div>
          <input
            type="checkbox"
            checked={systemSettings.notifications?.emailNotifications || false}
            onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              إشعارات الرسائل النصية
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              إرسال إشعارات عبر الرسائل النصية
            </p>
          </div>
          <input
            type="checkbox"
            checked={systemSettings.notifications?.smsNotifications || false}
            onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              تنبيهات النظام
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              عرض تنبيهات النظام في الواجهة
            </p>
          </div>
          <input
            type="checkbox"
            checked={systemSettings.notifications?.systemAlerts || false}
            onChange={(e) => handleNotificationChange('systemAlerts', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              تنبيهات انتهاء الوثائق
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              تنبيه عند اقتراب انتهاء صلاحية الوثائق
            </p>
          </div>
          <input
            type="checkbox"
            checked={systemSettings.notifications?.documentExpiry || false}
            onChange={(e) => handleNotificationChange('documentExpiry', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              تذكير المدفوعات
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              تذكير بالمدفوعات المستحقة
            </p>
          </div>
          <input
            type="checkbox"
            checked={systemSettings.notifications?.paymentReminders || false}
            onChange={(e) => handleNotificationChange('paymentReminders', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </label>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">إعدادات النسخ الاحتياطي</h3>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={systemSettings.backup?.autoBackup || false}
            onChange={(e) => handleBackupChange('autoBackup', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            تفعيل النسخ الاحتياطي التلقائي
          </span>
        </label>

        {systemSettings.backup?.autoBackup && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تكرار النسخ الاحتياطي
              </label>
              <select
                value={systemSettings.backup?.backupFrequency || 'daily'}
                onChange={(e) => handleBackupChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="daily">يومياً</option>
                <option value="weekly">أسبوعياً</option>
                <option value="monthly">شهرياً</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                وقت النسخ الاحتياطي
              </label>
              <input
                type="time"
                value={systemSettings.backup?.backupTime || '02:00'}
                onChange={(e) => handleBackupChange('backupTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                مدة الاحتفاظ (أيام)
              </label>
              <input
                type="number"
                min="7"
                max="365"
                value={systemSettings.backup?.retentionDays || 30}
                onChange={(e) => handleBackupChange('retentionDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                مجلد النسخ الاحتياطي
              </label>
              <input
                type="text"
                value={systemSettings.backup?.backupLocation || '/backups'}
                onChange={(e) => handleBackupChange('backupLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">إجراءات النسخ الاحتياطي</h4>
          <div className="flex gap-4">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              إنشاء نسخة احتياطية الآن
            </button>
            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              استعادة من نسخة احتياطية
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              إعدادات النظام
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              إدارة إعدادات النظام والشركة
            </p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              حفظ التغييرات
            </button>
          )}
        </div>
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
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* محتوى التبويبات */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {activeTab === 'company' && renderCompanySettings()}
        {activeTab === 'system' && renderSystemSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'backup' && renderBackupSettings()}
      </div>
    </div>
  );
};

export default Settings;
