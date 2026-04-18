import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Search } from 'lucide-react';
import caseService from '@/services/caseService';

export default function AddAidPage() {
  const { id } = useParams(); // ← ADD THIS to get aid ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingCases, setLoadingCases] = useState(false);
  const [aidTypes, setAidTypes] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [showCaseDropdown, setShowCaseDropdown] = useState(false);
  const [caseSearch, setCaseSearch] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    case_id: '',
    case_name: '',
    case_file_number: '',
    aid_type_id: '',
    aid_date: new Date().toISOString().split('T')[0],
    amount: '',
    quantity_or_description: '',
    notes: '',
  });

  useEffect(() => {
    loadAidTypes();
    loadCases();
    
    // Check if we're in edit mode
    if (id) {
      setIsEditMode(true);
      loadAidData(parseInt(id));
    }
  }, [id]);

  // ← ADD THIS FUNCTION to load existing aid data for editing
  const loadAidData = async (aidId: number) => {
    setLoading(true);
    try {
      const res = await caseService.getAid(aidId);
      const aid = res.data;
      console.log('Loading aid for edit:', aid);
      
      setFormData({
        case_id: aid.case_id,
        case_name: aid.case_full_name || '',
        case_file_number: aid.case_file_number || '',
        aid_type_id: aid.aid_type_id,
        aid_date: aid.aid_date,
        amount: aid.amount || '',
        quantity_or_description: aid.quantity_or_description || '',
        notes: aid.notes || '',
      });
      
      setCaseSearch(`${aid.case_file_number} - ${aid.case_full_name}`);
    } catch (error) {
      console.error('Error loading aid:', error);
      alert('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const loadAidTypes = async () => {
    try {
      const res = await caseService.getAidTypes();
      setAidTypes(res.data);
    } catch (error) {
      console.error('Error loading aid types:', error);
    }
  };

  const loadCases = async () => {
    setLoadingCases(true);
    try {
      const res = await caseService.getCasesForDropdown();
      const casesData = res.data?.items || [];
      setCases(casesData);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoadingCases(false);
    }
  };

  const selectedAidType = aidTypes.find(t => t.id === parseInt(formData.aid_type_id));
  const isFinancial = selectedAidType?.category === 'Financial';

  const filteredCases = cases.filter(c => 
    (c.full_name && c.full_name.includes(caseSearch)) || 
    (c.file_number && c.file_number.includes(caseSearch))
  );

  const selectCase = (caseItem: any) => {
    setFormData({
      ...formData,
      case_id: caseItem.id,
      case_name: caseItem.full_name,
      case_file_number: caseItem.file_number,
    });
    setCaseSearch(`${caseItem.file_number} - ${caseItem.full_name}`);
    setShowCaseDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.case_id) {
      alert('الرجاء اختيار الحالة أولاً');
      return;
    }
    
    if (!formData.aid_type_id) {
      alert('الرجاء اختيار نوع المساعدة');
      return;
    }
    
    setLoading(true);
    try {
      const aidData: any = {
        case_id: parseInt(formData.case_id),
        aid_type_id: parseInt(formData.aid_type_id),
        aid_date: formData.aid_date,
      };
      
      if (isFinancial) {
        if (!formData.amount) {
          alert('الرجاء إدخال المبلغ');
          setLoading(false);
          return;
        }
        aidData.amount = parseFloat(formData.amount);
      } else {
        if (formData.quantity_or_description) {
          aidData.quantity_or_description = formData.quantity_or_description;
        }
      }
      
      if (formData.notes) {
        aidData.notes = formData.notes;
      }
      
      if (isEditMode && id) {
        // Update existing aid
        await caseService.updateAid(parseInt(id), aidData);
      } else {
        // Create new aid
        await caseService.createAid(aidData);
      }
      
      navigate('/aids');
    } catch (error: any) {
      console.error('Error saving aid:', error);
      alert(error.response?.data?.detail || 'حدث خطأ في حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b px-6 py-4">
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'تعديل مساعدة' : 'إضافة مساعدة جديدة'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Case Selection - Disabled in edit mode */}
            <div>
              <label className="block text-sm font-medium mb-1">اختر الحالة *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  disabled={isEditMode}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary pl-10 ${isEditMode ? 'bg-gray-100' : ''}`}
                  placeholder="ابحث برقم الملف أو الاسم..."
                  value={caseSearch}
                  onChange={(e) => {
                    setCaseSearch(e.target.value);
                    setShowCaseDropdown(true);
                  }}
                  onFocus={() => setShowCaseDropdown(true)}
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                {showCaseDropdown && !isEditMode && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {loadingCases ? (
                      <div className="px-4 py-2 text-gray-500">جاري التحميل...</div>
                    ) : filteredCases.length > 0 ? (
                      filteredCases.map(c => (
                        <div
                          key={c.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectCase(c)}
                        >
                          {c.file_number} - {c.full_name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">لا توجد نتائج</div>
                    )}
                  </div>
                )}
              </div>
              {formData.case_id && (
                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                  <p><strong>رقم الملف:</strong> {formData.case_file_number}</p>
                  <p><strong>الاسم:</strong> {formData.case_name}</p>
                </div>
              )}
            </div>

            {/* Aid Type */}
            <div>
              <label className="block text-sm font-medium mb-1">نوع المساعدة *</label>
              <select
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                value={formData.aid_type_id}
                onChange={(e) => setFormData({ ...formData, aid_type_id: e.target.value, amount: '', quantity_or_description: '' })}
              >
                <option value="">اختر نوع المساعدة</option>
                {aidTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1">تاريخ المساعدة</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                value={formData.aid_date}
                onChange={(e) => setFormData({ ...formData, aid_date: e.target.value })}
              />
            </div>

            {/* Conditional Fields */}
            {formData.aid_type_id && (
              <div>
                {selectedAidType?.category === 'Financial' ? (
                  <div>
                    <label className="block text-sm font-medium mb-1">المبلغ (ج.م) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="أدخل المبلغ"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1">الوصف / الكمية</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      value={formData.quantity_or_description}
                      onChange={(e) => setFormData({ ...formData, quantity_or_description: e.target.value })}
                      placeholder="وصف المساعدة (مثال: 2 كرتونة مواد غذائية، 3 قطع ملابس)"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">ملاحظات</label>
              <textarea
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/aids')}
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