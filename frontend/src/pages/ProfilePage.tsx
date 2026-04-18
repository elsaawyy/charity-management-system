import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { User, Mail, Phone, Shield, Save, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';


console.log("ProfilePage component rendering");
export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
      });
    }
  }, [user]);

const handleUpdateProfile = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await api.put('/users/profile', formData);
    setUser(response.data);
    toast.success('تم تحديث الملف الشخصي بنجاح');
  } catch (error: any) {
    let errorMessage = 'حدث خطأ في تحديث الملف الشخصي';
    
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        errorMessage = error.response.data.detail[0]?.msg || errorMessage;
      } else if (typeof error.response.data.detail === 'string') {
        errorMessage = error.response.data.detail;
      }
    }
    
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};


const handleChangePassword = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (passwordData.new_password !== passwordData.confirm_password) {
    toast.error('كلمة المرور الجديدة وتأكيدها غير متطابقين');
    return;
  }
  
  if (passwordData.new_password.length < 6) {
    toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    return;
  }
  
  setLoading(true);
  try {
    await api.put('/users/change-password', {
      current_password: passwordData.current_password,
      new_password: passwordData.new_password,
    });
    toast.success('تم تغيير كلمة المرور بنجاح');
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
  } catch (error: any) {
    // Extract error message properly
    let errorMessage = 'حدث خطأ في تغيير كلمة المرور';
    
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        // Handle validation errors array
        errorMessage = error.response.data.detail[0]?.msg || errorMessage;
      } else if (typeof error.response.data.detail === 'string') {
        errorMessage = error.response.data.detail;
      } else if (error.response.data.detail?.msg) {
        errorMessage = error.response.data.detail.msg;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">الملف الشخصي</h1>
        <p className="text-gray-500 mt-1">إدارة معلومات حسابك الشخصية</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <User size={20} className="text-primary" />
              <h2 className="text-lg font-bold">المعلومات الشخصية</h2>
            </div>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم المستخدم</label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير اسم المستخدم</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">الدور</label>
              <input
                type="text"
                value={user?.role === 'Admin' ? 'مدير النظام' : 'موظف'}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <Lock size={20} className="text-primary" />
              <h2 className="text-lg font-bold">تغيير كلمة المرور</h2>
            </div>
          </div>
          
          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">كلمة المرور الحالية</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary pl-10"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">كلمة المرور الجديدة</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary pl-10"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">تأكيد كلمة المرور الجديدة</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
            >
              <Lock size={18} />
              {loading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
            </button>
          </form>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            <h2 className="text-lg font-bold">معلومات الحساب</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">تاريخ إنشاء الحساب</p>
              <p className="font-medium">
                {user?.created_at 
                  ? new Date(user.created_at).toLocaleDateString('ar-EG')
                  : 'غير محدد'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">آخر تحديث</p>
              <p className="font-medium">
                {user?.updated_at 
                  ? new Date(user.updated_at).toLocaleDateString('ar-EG')
                  : 'غير محدد'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">حالة الحساب</p>
              <p className="font-medium">
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  نشط
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}