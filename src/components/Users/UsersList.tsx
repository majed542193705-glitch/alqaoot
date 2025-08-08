import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Eye, EyeOff, UserCheck, UserX, Key } from 'lucide-react';
import { User } from '../../types';
import UserForm from './UserForm';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      permissions: [
        { module: 'dashboard', canView: true, canEdit: true, canDelete: true },
        { module: 'employees', canView: true, canEdit: true, canDelete: true },
        { module: 'vehicles', canView: true, canEdit: true, canDelete: true },
        { module: 'advances', canView: true, canEdit: true, canDelete: true },
        { module: 'licenses', canView: true, canEdit: true, canDelete: true },
        { module: 'shipping', canView: true, canEdit: true, canDelete: true },
        { module: 'users', canView: true, canEdit: true, canDelete: true },
        { module: 'settings', canView: true, canEdit: true, canDelete: true }
      ],
      isActive: true
    },
    {
      id: '2',
      username: 'manager',
      password: 'manager123',
      role: 'manager',
      permissions: [
        { module: 'dashboard', canView: true, canEdit: false, canDelete: false },
        { module: 'employees', canView: true, canEdit: true, canDelete: false },
        { module: 'vehicles', canView: true, canEdit: true, canDelete: false },
        { module: 'advances', canView: true, canEdit: true, canDelete: false },
        { module: 'licenses', canView: true, canEdit: false, canDelete: false },
        { module: 'shipping', canView: true, canEdit: true, canDelete: false }
      ],
      isActive: true
    },
    {
      id: '3',
      username: 'employee1',
      password: 'emp123',
      role: 'employee',
      permissions: [
        { module: 'dashboard', canView: true, canEdit: false, canDelete: false },
        { module: 'employees', canView: true, canEdit: false, canDelete: false },
        { module: 'vehicles', canView: true, canEdit: false, canDelete: false },
        { module: 'shipping', canView: true, canEdit: false, canDelete: false }
      ],
      isActive: false
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (id: string) => {
    if (id === '1') {
      alert('لا يمكن حذف المستخدم الرئيسي');
      return;
    }
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleToggleUserStatus = (id: string) => {
    if (id === '1') {
      alert('لا يمكن تعطيل المستخدم الرئيسي');
      return;
    }
    setUsers(users.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const handleSaveUser = (userData: Omit<User, 'id'>) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...userData, id: editingUser.id }
          : user
      ));
    } else {
      const newUser: User = {
        ...userData,
        id: Date.now().toString()
      };
      setUsers([...users, newUser]);
    }
    setShowForm(false);
    setEditingUser(null);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getRoleText = (role: string) => {
    const roleMap: { [key: string]: string } = {
      admin: 'مدير النظام',
      manager: 'مدير',
      employee: 'موظف'
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'employee':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPermissionsCount = (user: User) => {
    const totalModules = 8; // عدد الوحدات الإجمالي
    const userModules = user.permissions.length;
    return `${userModules}/${totalModules}`;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // إحصائيات سريعة
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const adminUsers = users.filter(user => user.role === 'admin').length;
  const managerUsers = users.filter(user => user.role === 'manager').length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              إدارة المستخدمين
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              إدارة حسابات المستخدمين والصلاحيات
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة مستخدم
          </button>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المستخدمين النشطين</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المديرين</p>
                <p className="text-2xl font-bold text-red-600">{adminUsers}</p>
              </div>
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المشرفين</p>
                <p className="text-2xl font-bold text-blue-600">{managerUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-600" />
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
              placeholder="البحث في المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* فلتر الدور */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">جميع الأدوار</option>
              <option value="admin">مدير النظام</option>
              <option value="manager">مدير</option>
              <option value="employee">موظف</option>
            </select>
          </div>

          {/* فلتر الحالة */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
        </div>
      </div>

      {/* جدول المستخدمين */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  اسم المستخدم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  كلمة المرور
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الدور
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الصلاحيات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span className="font-mono">
                        {showPasswords[user.id] ? user.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(user.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPasswords[user.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>{getPermissionsCount(user)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {user.isActive ? (
                        <UserCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <UserX className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {user.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user.id)}
                        className={`${user.isActive ? 'text-red-600 hover:text-red-900 dark:text-red-400' : 'text-green-600 hover:text-green-900 dark:text-green-400'}`}
                        title={user.isActive ? 'تعطيل' : 'تفعيل'}
                      >
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      {user.id !== '1' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد مستخدمين</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'لا توجد مستخدمين مطابقين للبحث' : 'ابدأ بإضافة مستخدم جديد'}
            </p>
          </div>
        )}
      </div>

      {/* نموذج إضافة/تعديل المستخدم */}
      {showForm && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UsersList;
