import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Shield, Check } from 'lucide-react';
import { User, Permission } from '../../types';

interface UserFormProps {
  user: User | null;
  onSave: (user: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'employee' as User['role'],
    permissions: [] as Permission[],
    isActive: true
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // قائمة الوحدات المتاحة
  const availableModules = [
    { id: 'dashboard', name: 'لوحة التحكم', description: 'عرض الإحصائيات والتقارير' },
    { id: 'employees', name: 'الموظفين', description: 'إدارة بيانات الموظفين' },
    { id: 'vehicles', name: 'المركبات', description: 'إدارة المركبات والتفاويض' },
    { id: 'advances', name: 'السلف', description: 'إدارة السلف والمستحقات' },
    { id: 'licenses', name: 'التراخيص', description: 'إدارة تراخيص المنشأة' },
    { id: 'shipping', name: 'بوليصات الشحن', description: 'إدارة بوليصات الشحن' },
    { id: 'users', name: 'المستخدمين', description: 'إدارة حسابات المستخدمين' },
    { id: 'settings', name: 'الإعدادات', description: 'إعدادات النظام' }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: user.password,
        confirmPassword: user.password,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive
      });
    } else {
      // تعيين صلاحيات افتراضية للموظف الجديد
      const defaultPermissions: Permission[] = [
        { module: 'dashboard', canView: true, canEdit: false, canDelete: false }
      ];
      setFormData(prev => ({ ...prev, permissions: defaultPermissions }));
    }
  }, [user]);

  // تحديث الصلاحيات عند تغيير الدور
  useEffect(() => {
    let newPermissions: Permission[] = [];
    
    switch (formData.role) {
      case 'admin':
        newPermissions = availableModules.map(module => ({
          module: module.id,
          canView: true,
          canEdit: true,
          canDelete: true
        }));
        break;
      case 'manager':
        newPermissions = availableModules
          .filter(module => module.id !== 'users' && module.id !== 'settings')
          .map(module => ({
            module: module.id,
            canView: true,
            canEdit: module.id !== 'licenses',
            canDelete: false
          }));
        break;
      case 'employee':
        newPermissions = availableModules
          .filter(module => ['dashboard', 'employees', 'vehicles', 'shipping'].includes(module.id))
          .map(module => ({
            module: module.id,
            canView: true,
            canEdit: false,
            canDelete: false
          }));
        break;
    }
    
    setFormData(prev => ({ ...prev, permissions: newPermissions }));
  }, [formData.role]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'اسم المستخدم مطلوب';
    } else if (formData.username.length < 3) {
      newErrors.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'يجب تحديد صلاحية واحدة على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { confirmPassword, ...userData } = formData;
      onSave(userData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // إزالة رسالة الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePermissionChange = (moduleId: string, permissionType: 'canView' | 'canEdit' | 'canDelete', value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.map(permission =>
        permission.module === moduleId
          ? { ...permission, [permissionType]: value }
          : permission
      )
    }));
  };

  const getModulePermission = (moduleId: string) => {
    return formData.permissions.find(p => p.module === moduleId) || {
      module: moduleId,
      canView: false,
      canEdit: false,
      canDelete: false
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* رأس النموذج */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {user ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* محتوى النموذج */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* البيانات الأساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم المستخدم *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="اسم المستخدم"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الدور *
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="employee">موظف</option>
                <option value="manager">مدير</option>
                <option value="admin">مدير النظام</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كلمة المرور *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-10 ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تأكيد كلمة المرور *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-10 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="تأكيد كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* حالة المستخدم */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900 dark:text-white">
              المستخدم نشط
            </label>
          </div>

          {/* الصلاحيات */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">الصلاحيات</h3>
            </div>
            
            {errors.permissions && (
              <p className="mb-4 text-sm text-red-600 dark:text-red-400">{errors.permissions}</p>
            )}

            <div className="space-y-4">
              {availableModules.map((module) => {
                const permission = getModulePermission(module.id);
                return (
                  <div key={module.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{module.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{module.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permission.canView}
                          onChange={(e) => handlePermissionChange(module.id, 'canView', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">عرض</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permission.canEdit}
                          onChange={(e) => handlePermissionChange(module.id, 'canEdit', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">تعديل</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permission.canDelete}
                          onChange={(e) => handlePermissionChange(module.id, 'canDelete', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">حذف</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
            >
              {user ? 'تحديث' : 'إضافة'} المستخدم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
