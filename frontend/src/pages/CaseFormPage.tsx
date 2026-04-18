import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Upload, FileText, Home, DollarSign, Heart } from 'lucide-react';
import caseService from '../services/caseService';

export default function CaseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number_1: '',
    phone_number_2: '',
    country: '',
    city: '',
    street_address: '',
    notes: '',
    housing_type: 'ملك',
    join_date: new Date().toISOString().split('T')[0],
    family_income: 0,
    property_rental_income: 0,
    other_income: 0,
    receives_government_aid: false,
    government_aid_organization: '',
    is_parent_deceased: false,
    is_monthly_aid: false,
    monthly_aid_amount: 0,
  });

  useEffect(() => {
    if (id) {
      loadCase();
    }
  }, [id]);

  const loadCase = async () => {
    setLoading(true);
    try {
      const response = await caseService.getCase(parseInt(id!));
      setFormData(response.data);
    } catch (error) {
      console.error('Error loading case:', error);
    } finally {
      setLoading(false);
    }
  };

  // Validation Functions
  const validateName = (name: string) => {
    if (!name || name.trim().length < 6) {
      return 'الاسم يجب أن يتكون من 4 كلمات على الأقل';
    }
    const wordCount = name.trim().split(/\s+/).length;
    if (wordCount < 4) {
      return 'الاسم يجب أن يحتوي على 4 أسماء على الأقل (الاسم الرباعي)';
    }
    return '';
  };

  const validatePhone = (phone: string) => {
    if (!phone) return 'رقم الهاتف مطلوب';
    const phoneRegex = /^01[0-2]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return 'رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012';
    }
    return '';
  };

  const validateCity = (city: string) => {
    if (!city || city.trim().length < 2) {
      return 'المدينة مطلوبة';
    }
    return '';
  };

  const validateJoinDate = (date: string) => {
    if (!date) return 'تاريخ الانضمام مطلوب';
    const joinDate = new Date(date);
    const today = new Date();
    if (joinDate > today) {
      return 'تاريخ الانضمام لا يمكن أن يكون في المستقبل';
    }
    return '';
  };

  const validateMonthlyAmount = (isMonthly: boolean, amount: number) => {
    if (isMonthly && (!amount || amount <= 0)) {
      return 'المبلغ الشهري مطلوب عند تفعيل المساعدات الشهرية';
    }
    if (amount && amount < 0) return 'المبلغ لا يمكن أن يكون سالباً';
    return '';
  };

  const validateIncome = (value: number, fieldName: string) => {
    if (value && value < 0) return `${fieldName} لا يمكن أن يكون سالباً`;
    return '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Tab 1 validation
    const nameError = validateName(formData.full_name);
    if (nameError) newErrors.full_name = nameError;
    
    const phoneError = validatePhone(formData.phone_number_1);
    if (phoneError) newErrors.phone_number_1 = phoneError;
    
    const cityError = validateCity(formData.city);
    if (cityError) newErrors.city = cityError;
    
    // Tab 2 validation
    const dateError = validateJoinDate(formData.join_date);
    if (dateError) newErrors.join_date = dateError;
    
    const familyIncomeError = validateIncome(formData.family_income, 'دخل الأسرة');
    if (familyIncomeError) newErrors.family_income = familyIncomeError;
    
    const rentalIncomeError = validateIncome(formData.property_rental_income, 'دخل الإيجار');
    if (rentalIncomeError) newErrors.property_rental_income = rentalIncomeError;
    
    const otherIncomeError = validateIncome(formData.other_income, 'دخل آخر');
    if (otherIncomeError) newErrors.other_income = otherIncomeError;
    
    // Tab 3 validation
    const monthlyAmountError = validateMonthlyAmount(formData.is_monthly_aid, formData.monthly_aid_amount);
    if (monthlyAmountError) newErrors.monthly_aid_amount = monthlyAmountError;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Find which tab has the first error
      if (newErrors.full_name || newErrors.phone_number_1 || newErrors.city) {
        setActiveTab(0);
      } else if (newErrors.join_date || newErrors.family_income || newErrors.property_rental_income || newErrors.other_income) {
        setActiveTab(1);
      } else if (newErrors.monthly_aid_amount) {
        setActiveTab(2);
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('الرجاء تصحيح الأخطاء في النموذج');
      return;
    }
    
    setLoading(true);
    try {
      if (id) {
        await caseService.updateCase(parseInt(id), formData);
      } else {
        await caseService.createCase(formData);
      }
      navigate('/cases');
    } catch (error) {
      console.error('Error saving case:', error);
      alert('حدث خطأ في حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = Number(formData.family_income || 0) + 
                       Number(formData.property_rental_income || 0) + 
                       Number(formData.other_income || 0);

  const tabs = [
    { id: 0, name: 'المعلومات الشخصية', icon: FileText },
    { id: 1, name: 'السكن والدخل', icon: Home },
    { id: 2, name: 'المساعدات الشهرية', icon: DollarSign },
    { id: 3, name: 'معلومات الوالدين', icon: Heart },
  ];

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h1 className="text-2xl font-bold">
            {id ? 'تعديل حالة' : 'إضافة حالة جديدة'}
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b px-6">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Tab 1: Personal Information */}
          {activeTab === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">الاسم الكامل (الاسم الرباعي) *</label>
                  <input
                    type="text"
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.full_name ? 'border-red-500' : ''
                    }`}
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="مثال: أحمد محمد محمود علي"
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف 1 *</label>
                  <input
                    type="tel"
                    pattern="01[0-2][0-9]{8}"
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.phone_number_1 ? 'border-red-500' : ''
                }`}
                    value={formData.phone_number_1}
                    onChange={(e) => setFormData({ ...formData, phone_number_1: e.target.value })}
                    placeholder="01012345678"
                  />
                  {errors.phone_number_1 && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone_number_1}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف 2</label>
                  <input
                    type="tel"
                    pattern="01[0-2][0-9]{8}"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    value={formData.phone_number_2}
                    onChange={(e) => setFormData({ ...formData, phone_number_2: e.target.value })}
                    placeholder="01012345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الدولة</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="مصر"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">المدينة *</label>
                  <input
                    type="text"
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.city ? 'border-red-500' : ''
                    }`}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">العنوان بالتفصيل</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    value={formData.street_address}
                    onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">ملاحظات</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Housing & Income */}
          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">نوع السكن *</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    value={formData.housing_type}
                    onChange={(e) => setFormData({ ...formData, housing_type: e.target.value })}
                  >
                    <option value="ملك">ملك</option>
                    <option value="إيجار">إيجار</option>
                    <option value="غير ذلك">غير ذلك</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ الانضمام *</label>
                  <input
                    type="date"
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.join_date ? 'border-red-500' : ''
                    }`}
                    value={formData.join_date}
                    onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                  />
                  {errors.join_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.join_date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">دخل الأسرة (ج.م)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.family_income ? 'border-red-500' : ''
                    }`}
                    value={formData.family_income}
                    onChange={(e) => setFormData({ ...formData, family_income: parseFloat(e.target.value) || 0 })}
                  />
                  {errors.family_income && (
                    <p className="text-red-500 text-sm mt-1">{errors.family_income}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">دخل الإيجار (ج.م)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.property_rental_income ? 'border-red-500' : ''
                    }`}
                    value={formData.property_rental_income}
                    onChange={(e) => setFormData({ ...formData, property_rental_income: parseFloat(e.target.value) || 0 })}
                  />
                  {errors.property_rental_income && (
                    <p className="text-red-500 text-sm mt-1">{errors.property_rental_income}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">دخل آخر (ج.م)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.other_income ? 'border-red-500' : ''
                    }`}
                    value={formData.other_income}
                    onChange={(e) => setFormData({ ...formData, other_income: parseFloat(e.target.value) || 0 })}
                  />
                  {errors.other_income && (
                    <p className="text-red-500 text-sm mt-1">{errors.other_income}</p>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="block text-sm font-medium mb-1">إجمالي الدخل</label>
                  <div className="text-xl font-bold text-primary">{totalIncome.toFixed(2)} ج.م</div>
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.receives_government_aid}
                      onChange={(e) => setFormData({ ...formData, receives_government_aid: e.target.checked })}
                    />
                    <span>يتلقى مساعدات حكومية</span>
                  </label>
                </div>
                {formData.receives_government_aid && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">الجهة الحكومية</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      value={formData.government_aid_organization}
                      onChange={(e) => setFormData({ ...formData, government_aid_organization: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Monthly Financial Aid */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={formData.is_monthly_aid}
                      onChange={(e) => setFormData({ ...formData, is_monthly_aid: e.target.checked })}
                    />
                    <span>تفعيل المساعدات الشهرية</span>
                  </label>
                </div>
                {formData.is_monthly_aid && (
                  <div>
                    <label className="block text-sm font-medium mb-1">المبلغ الشهري (ج.م)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                        errors.monthly_aid_amount ? 'border-red-500' : ''
                      }`}
                      value={formData.monthly_aid_amount}
                      onChange={(e) => setFormData({ ...formData, monthly_aid_amount: parseFloat(e.target.value) || 0 })}
                    />
                    {errors.monthly_aid_amount && (
                      <p className="text-red-500 text-sm mt-1">{errors.monthly_aid_amount}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      ملاحظة: سيتم إضافة هذه الحالة تلقائياً إلى دورات المساعدات الشهرية
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Parent Information */}
          {activeTab === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={formData.is_parent_deceased}
                      onChange={(e) => setFormData({ ...formData, is_parent_deceased: e.target.checked })}
                    />
                    <span>الوالدين متوفيين</span>
                  </label>
                </div>
                {formData.is_parent_deceased && (
                  <div>
                    <label className="block text-sm font-medium mb-1">رفع شهادة الوفاة</label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                      <p className="text-sm text-gray-500 mb-2">اضغط أو اسحب الملف للإرفاق</p>
                      <input type="file" accept="image/*,.pdf" className="hidden" />
                      <button className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                        اختيار ملف
                      </button>
                    </div>
                    {previewImage && (
                      <div className="mt-4">
                        <img src={previewImage} alt="Preview" className="max-w-xs rounded-lg" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/cases')}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <X size={18} />
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light flex items-center gap-2"
            >
              <Save size={18} />
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}