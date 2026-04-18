import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, Search, Edit, Trash2, Eye, Filter, X, 
  Calendar, Home, DollarSign, Building2, Phone,
  Download, ChevronDown, ChevronUp
} from 'lucide-react';
import caseService, { Case } from '@/services/caseService';

export default function CasesListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    city: '',
    housing_type: '',
    receives_government_aid: '',
    is_monthly_aid: '',
    start_date: '',
    end_date: '',
    min_income: '',
    max_income: '',
  });
  
  const [cities, setCities] = useState<string[]>([]);
  
  const { data, refetch } = useQuery({
    queryKey: ['cases', page, search, filters],
    queryFn: () => caseService.getCases({ 
      page, 
      size: pageSize, 
      search: search || undefined,
      city: filters.city || undefined,
      housing_type: filters.housing_type || undefined,
      receives_government_aid: filters.receives_government_aid === '' ? undefined : filters.receives_government_aid === 'true',
      is_monthly_aid: filters.is_monthly_aid === '' ? undefined : filters.is_monthly_aid === 'true',
      start_date: filters.start_date || undefined,
      end_date: filters.end_date || undefined,
      min_income: filters.min_income ? parseFloat(filters.min_income) : undefined,
      max_income: filters.max_income ? parseFloat(filters.max_income) : undefined,
    }),
  });

useEffect(() => {
  if (data?.data?.items && Array.isArray(data.data.items)) {
    const uniqueCities = [...new Set(data.data.items.map((c: any) => c.city).filter(Boolean))] as string[];
    setCities(uniqueCities);
  }
}, [data]);

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الحالة؟')) {
      await caseService.deleteCase(id);
      refetch();
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      housing_type: '',
      receives_government_aid: '',
      is_monthly_aid: '',
      start_date: '',
      end_date: '',
      min_income: '',
      max_income: '',
    });
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(v => v !== '') || search !== '';
  };

  const cases = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const housingTypes = [
    { value: 'ملك', label: 'ملك' },
    { value: 'إيجار', label: 'إيجار' },
    { value: 'غير ذلك', label: 'غير ذلك' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الحالات</h1>
        <Link
          to="/cases/new"
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-light"
        >
          <Plus size={20} />
          إضافة حالة جديدة
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="بحث بالاسم أو رقم الهاتف أو رقم الملف..."
              className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showFilters || hasActiveFilters()
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter size={18} />
            فلتر متقدم
            {hasActiveFilters() && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.values(filters).filter(v => v !== '').length + (search ? 1 : 0)}
              </span>
            )}
          </button>
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <X size={18} />
              مسح الفلتر
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">المدينة</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                >
                  <option value="">جميع المدن</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Housing Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">نوع السكن</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={filters.housing_type}
                  onChange={(e) => handleFilterChange('housing_type', e.target.value)}
                >
                  <option value="">الكل</option>
                  {housingTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Government Aid Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">مساعدات حكومية</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={filters.receives_government_aid}
                  onChange={(e) => handleFilterChange('receives_government_aid', e.target.value)}
                >
                  <option value="">الكل</option>
                  <option value="true">نعم</option>
                  <option value="false">لا</option>
                </select>
              </div>

              {/* Monthly Aid Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">مساعدات شهرية</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={filters.is_monthly_aid}
                  onChange={(e) => handleFilterChange('is_monthly_aid', e.target.value)}
                >
                  <option value="">الكل</option>
                  <option value="true">مفعلة</option>
                  <option value="false">غير مفعلة</option>
                </select>
              </div>

              {/* Date Range - From */}
              <div>
                <label className="block text-sm font-medium mb-1">من تاريخ</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange('start_date', e.target.value)}
                />
              </div>

              {/* Date Range - To */}
              <div>
                <label className="block text-sm font-medium mb-1">إلى تاريخ</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={filters.end_date}
                  onChange={(e) => handleFilterChange('end_date', e.target.value)}
                />
              </div>

              {/* Income Range - Min */}
              <div>
                <label className="block text-sm font-medium mb-1">الحد الأدنى للدخل</label>
                <input
                  type="number"
                  placeholder="أدخل المبلغ"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={filters.min_income}
                  onChange={(e) => handleFilterChange('min_income', e.target.value)}
                />
              </div>

              {/* Income Range - Max */}
              <div>
                <label className="block text-sm font-medium mb-1">الحد الأقصى للدخل</label>
                <input
                  type="number"
                  placeholder="أدخل المبلغ"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={filters.max_income}
                  onChange={(e) => handleFilterChange('max_income', e.target.value)}
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters() && (
              <div className="mt-4 flex flex-wrap gap-2">
                {search && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    بحث: {search}
                    <button onClick={() => setSearch('')} className="hover:text-blue-600">
                      <X size={14} />
                    </button>
                  </span>
                )}
                {filters.city && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    مدينة: {filters.city}
                  </span>
                )}
                {filters.housing_type && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    سكن: {filters.housing_type}
                  </span>
                )}
                {filters.receives_government_aid && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    مساعدات حكومية: {filters.receives_government_aid === 'true' ? 'نعم' : 'لا'}
                  </span>
                )}
                {filters.is_monthly_aid && (
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                    مساعدات شهرية: {filters.is_monthly_aid === 'true' ? 'مفعلة' : 'غير مفعلة'}
                  </span>
                )}
                {(filters.start_date || filters.end_date) && (
                  <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                    تاريخ: {filters.start_date || 'بداية'} → {filters.end_date || 'نهاية'}
                  </span>
                )}
                {(filters.min_income || filters.max_income) && (
                  <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                    دخل: {filters.min_income || 0} - {filters.max_income || '∞'} ج.م
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-500">
        عدد النتائج: {total} حالة
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right">رقم الملف</th>
                <th className="px-6 py-3 text-right">الاسم الكامل</th>
                <th className="px-6 py-3 text-right">رقم الهاتف</th>
                <th className="px-6 py-3 text-right">المدينة</th>
                <th className="px-6 py-3 text-right">نوع السكن</th>
                <th className="px-6 py-3 text-right">تاريخ الانضمام</th>
                <th className="px-6 py-3 text-right">مساعدات شهرية</th>
                <th className="px-6 py-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem: Case) => (
                <tr key={caseItem.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{caseItem.file_number}</td>
                  <td className="px-6 py-4 font-medium">{caseItem.full_name}</td>
                  <td className="px-6 py-4 dir-ltr">{caseItem.phone_number_1}</td>
                  <td className="px-6 py-4">{caseItem.city}</td>
                  <td className="px-6 py-4">{caseItem.housing_type}</td>
                  <td className="px-6 py-4">{caseItem.join_date}</td>
                  <td className="px-6 py-4">
                    {caseItem.is_monthly_aid ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {caseItem.monthly_aid_amount} ج.م
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">لا</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/cases/${caseItem.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="عرض التفاصيل"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        to={`/cases/${caseItem.id}/edit`}
                        className="text-green-600 hover:text-green-800"
                        title="تعديل"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(caseItem.id)}
                        className="text-red-600 hover:text-red-800"
                        title="حذف"
                      >
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
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
              السابق
            </button>
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      page === pageNum
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
}