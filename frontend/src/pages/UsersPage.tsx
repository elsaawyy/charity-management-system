import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, UserPlus } from 'lucide-react';
import caseService from '@/services/caseService';

export default function UsersPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'Staff',
    is_active: true,
  });

  const { data, refetch } = useQuery({
    queryKey: ['users', page, search, roleFilter],
    queryFn: () => caseService.getUsers({
      page,
      size: pageSize,
      search: search || undefined,
      role: roleFilter || undefined,
    }),
  });

 const createMutation = useMutation({
  mutationFn: (data: any) => caseService.createUser(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    setShowModal(false);
    resetForm();
    alert('✅ تم إضافة المستخدم بنجاح');
  },
  onError: (error: any) => {
    console.error('Error details:', error.response?.data);
    
    // Extract validation errors
    const errorData = error.response?.data;
    if (errorData?.detail) {
      // Handle validation errors
      if (Array.isArray(errorData.detail)) {
        const errorMessages = errorData.detail.map((err: any) => {
          if (err.msg === 'Value error, Username must be alphanumeric') {
            return '❌ اسم المستخدم يجب أن يحتوي على حروف وأرقام فقط (بدون رموز أو مسافات)';
          }
          if (err.loc?.includes('username')) {
            return '❌ اسم المستخدم غير صالح. استخدم الحروف والأرقام فقط';
          }
          if (err.loc?.includes('email')) {
            return '❌ البريد الإلكتروني غير صالح';
          }
          return `❌ ${err.msg}`;
        });
        alert(errorMessages.join('\n'));
      } else if (errorData.detail === 'Username already exists') {
        alert('❌ اسم المستخدم موجود بالفعل. الرجاء اختيار اسم آخر');
      } else if (errorData.detail === 'Email already exists') {
        alert('❌ البريد الإلكتروني موجود بالفعل. الرجاء استخدام بريد آخر');
      } else {
        alert(`❌ خطأ: ${errorData.detail}`);
      }
    } else {
      alert('❌ حدث خطأ في إضافة المستخدم. الرجاء المحاولة مرة أخرى');
    }
  },
});



const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: number; data: any }) => caseService.updateUser(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    setShowModal(false);
    resetForm();
    alert('✅ تم تحديث المستخدم بنجاح');
  },
  onError: (error: any) => {
    const errorData = error.response?.data;
    if (errorData?.detail === 'Username already exists') {
      alert('❌ اسم المستخدم موجود بالفعل. الرجاء اختيار اسم آخر');
    } else if (errorData?.detail === 'Email already exists') {
      alert('❌ البريد الإلكتروني موجود بالفعل. الرجاء استخدام بريد آخر');
    } else {
      alert('❌ حدث خطأ في تحديث المستخدم');
    }
  },
});

const deleteMutation = useMutation({
  mutationFn: (id: number) => caseService.deleteUser(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    alert('✅ تم حذف المستخدم بنجاح');
  },
  onError: () => {
    alert('❌ لا يمكن حذف هذا المستخدم');
  },
});

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      full_name: '',
      password: '',
      role: 'Staff',
      is_active: true,
    });
    setEditingUser(null);
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Prepare data exactly as backend expects
  const userData = {
    username: formData.username,
    email: formData.email,
    full_name: formData.full_name,
    password: formData.password,
    role: formData.role,  // Should be "Staff" or "Admin"
    is_active: formData.is_active === true,
  };
  
  console.log("Sending user data:", userData);  // Debug log
  
  if (editingUser) {
    const updateData: any = {};
    if (userData.username !== editingUser.username) updateData.username = userData.username;
    if (userData.email !== editingUser.email) updateData.email = userData.email;
    if (userData.full_name !== editingUser.full_name) updateData.full_name = userData.full_name;
    if (userData.role !== editingUser.role) updateData.role = userData.role;
    if (userData.is_active !== editingUser.is_active) updateData.is_active = userData.is_active;
    if (userData.password) updateData.password = userData.password;
    updateMutation.mutate({ id: editingUser.id, data: updateData });
  } else {
    createMutation.mutate(userData);
  }
};


  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      password: '',
      role: user.role,
      is_active: user.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`هل أنت متأكد من حذف المستخدم "${name}"؟`)) {
      deleteMutation.mutate(id);
    }
  };

  const users = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-light"
        >
          <UserPlus size={18} />
          مستخدم جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">بحث</label>
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد الإلكتروني..."
              className="w-full px-3 py-2 border rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الدور</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">الكل</option>
              <option value="Admin">مدير النظام</option>
              <option value="Staff">موظف</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right">اسم المستخدم</th>
                <th className="px-6 py-3 text-right">الاسم الكامل</th>
                <th className="px-6 py-3 text-right">البريد الإلكتروني</th>
                <th className="px-6 py-3 text-right">الدور</th>
                <th className="px-6 py-3 text-right">الحالة</th>
                <th className="px-6 py-3 text-right">تاريخ الإنشاء</th>
                <th className="px-6 py-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4 font-medium">{user.full_name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'Admin' ? 'مدير النظام' : 'موظف'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.is_active ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">نشط</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">غير نشط</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString('ar-EG')}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(user)} className="text-green-600 hover:text-green-800">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(user.id, user.full_name)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              السابق
            </button>
            <span>الصفحة {page} من {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">
                {editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
<div>
  <label className="block text-sm font-medium mb-1">اسم المستخدم *</label>
  <input
    type="text"
    required
    className={`w-full px-3 py-2 border rounded-lg ${
      formData.username && !/^[a-zA-Z0-9]+$/.test(formData.username) 
        ? 'border-red-500' 
        : 'border-gray-300'
    }`}
    value={formData.username}
    onChange={(e) => {
      // Allow only letters and numbers
              const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                  setFormData({ ...formData, username: value });
                }}
                    placeholder="مثال: ahmed123"
                  />
                  {formData.username && !/^[a-zA-Z0-9]+$/.test(formData.username) && (
                <p className="text-red-500 text-xs mt-1">❌ يُسمح فقط بالحروف والأرقام</p>
              )}
        <p className="text-xs text-gray-500 mt-1">⚠️ ملاحظة: يُسمح فقط بالحروف والأرقام (بدون مسافات أو رموز)</p>
            </div>
              <div>
                <label className="block text-sm font-medium mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">البريد الإلكتروني *</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {editingUser ? 'كلمة المرور (اتركها فارغة للتعديل)' : 'كلمة المرور *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الدور</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Staff">موظف</option>
                  <option value="Admin">مدير النظام</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <span>مفعل</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  {editingUser ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}