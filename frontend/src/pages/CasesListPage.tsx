import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Eye, FileDown } from 'lucide-react';
import caseService, { Case } from '../services/caseService';

export default function CasesListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
  const { data, refetch } = useQuery({
    queryKey: ['cases', page, search],
    queryFn: () => caseService.getCases({ page, size: pageSize, search }),
  });

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الحالة؟')) {
      await caseService.deleteCase(id);
      refetch();
    }
  };

  const cases = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
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

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="بحث بالاسم أو رقم الهاتف أو رقم الملف..."
            className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:border-primary-light"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
                <th className="px-6 py-3 text-right">تاريخ الانضمام</th>
                <th className="px-6 py-3 text-right">مساعدات شهرية</th>
                <th className="px-6 py-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem: Case) => (
                <tr key={caseItem.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{caseItem.file_number}</td>
                  <td className="px-6 py-4">{caseItem.full_name}</td>
                  <td className="px-6 py-4">{caseItem.phone_number_1}</td>
                  <td className="px-6 py-4">{caseItem.city}</td>
                  <td className="px-6 py-4">{caseItem.join_date}</td>
                  <td className="px-6 py-4">
                    {caseItem.is_monthly_aid ? 'نعم' : 'لا'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/cases/${caseItem.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        to={`/cases/${caseItem.id}/edit`}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(caseItem.id)}
                        className="text-red-600 hover:text-red-800"
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
        <div className="flex justify-between items-center px-6 py-4 border-t">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
          >
            السابق
          </button>
          <span>
            الصفحة {page} من {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}