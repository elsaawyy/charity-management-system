import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Search, Filter } from 'lucide-react';
import caseService from '@/services/caseService';

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [actionType, setActionType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [actionTypes, setActionTypes] = useState<string[]>([]);

  const { data, refetch } = useQuery({
    queryKey: ['audit-logs', page, search, actionType, startDate, endDate],
    queryFn: () => caseService.getAuditLogs({
      page,
      size: pageSize,
      search: search || undefined,
      action_type: actionType || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    }),
  });

  // Load action types for filter
  useQuery({
    queryKey: ['action-types'],
    queryFn: async () => {
      const res = await caseService.getActionTypes();
      setActionTypes(res.data);
      return res.data;
    },
  });

  const handleExport = async () => {
    try {
      const response = await caseService.exportAuditLogs({
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('حدث خطأ في تصدير البيانات');
    }
  };

  const logs = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const getActionTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      LOGIN: 'bg-purple-100 text-purple-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
      GENERATE: 'bg-yellow-100 text-yellow-800',
      DELIVER: 'bg-teal-100 text-teal-800',
      BULK_DELIVER: 'bg-indigo-100 text-indigo-800',
      OPEN: 'bg-orange-100 text-orange-800',
      CLOSE: 'bg-pink-100 text-pink-800',
      CREATE_USER: 'bg-cyan-100 text-cyan-800',
      UPDATE_USER: 'bg-cyan-100 text-cyan-800',
      DELETE_USER: 'bg-cyan-100 text-cyan-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">سجل التدقيق</h1>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Download size={18} />
          تصدير إلى Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">بحث</label>
            <input
              type="text"
              placeholder="بحث..."
              className="w-full px-3 py-2 border rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">نوع الإجراء</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
            >
              <option value="">الكل</option>
              {actionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">من تاريخ</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">إلى تاريخ</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right">التاريخ</th>
                <th className="px-6 py-3 text-right">المستخدم</th>
                <th className="px-6 py-3 text-right">نوع الإجراء</th>
                <th className="px-6 py-3 text-right">الكيان</th>
                <th className="px-6 py-3 text-right">الوصف</th>
                <th className="px-6 py-3 text-right">عنوان IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {new Date(log.action_date).toLocaleString('ar-EG')}
                  </td>
                  <td className="px-6 py-4">
                    {log.user_full_name || log.username || 'نظام'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getActionTypeBadge(log.action_type)}`}>
                      {log.action_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{log.entity_name} {log.entity_id ? `#${log.entity_id}` : ''}</td>
                  <td className="px-6 py-4">{log.description}</td>
                  <td className="px-6 py-4">{log.ip_address || '-'}</td>
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
    </div>
  );
}