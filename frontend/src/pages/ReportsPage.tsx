import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Calendar, TrendingUp, Users, Gift, DollarSign } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import caseService from '@/services/caseService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('comprehensive');
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch dashboard stats
  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => caseService.getDashboardStats(),
  });

  // Fetch aid distribution
  const { data: distributionData } = useQuery({
    queryKey: ['aid-distribution', startDate, endDate],
    queryFn: () => caseService.getAidDistribution({ start_date: startDate || undefined, end_date: endDate || undefined }),
  });

  // Fetch monthly stats
  const { data: monthlyData } = useQuery({
    queryKey: ['monthly-stats'],
    queryFn: () => caseService.getMonthlyStats(),
  });

  // Fetch top beneficiaries
  const { data: beneficiariesData } = useQuery({
    queryKey: ['top-beneficiaries', startDate, endDate],
    queryFn: () => caseService.getTopBeneficiaries({ start_date: startDate || undefined, end_date: endDate || undefined, limit: 10 }),
  });

  const stats = statsData?.data || {};
  const distribution = distributionData?.data || [];
  const monthlyStats = monthlyData?.data || [];
  const beneficiaries = beneficiariesData?.data || [];

  // Prepare chart data
  const aidDistributionChart = {
    labels: distribution.map((item: any) => item.name),
    datasets: [
      {
        label: 'عدد المساعدات',
        data: distribution.map((item: any) => item.count),
        backgroundColor: ['#2C3E50', '#3498DB', '#27AE60', '#F39C12', '#E74C3C'],
      },
    ],
  };

  const monthlyAidChart = {
    labels: monthlyStats.map((item: any) => {
      const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      return monthNames[item.month - 1];
    }),
    datasets: [
      {
        label: 'المبلغ (ج.م)',
        data: monthlyStats.map((item: any) => item.aid_amount),
        backgroundColor: '#2C3E50',
        borderColor: '#3498DB',
        borderWidth: 1,
      },
    ],
  };

  const handleExport = async () => {
    try {
      const response = await caseService.exportReports({
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        report_type: reportType,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('حدث خطأ في تصدير التقرير');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6" ref={printRef}>
      {/* Print Styles */}
      <style>
        {`
          @media print {
                body * {
                visibility: hidden;
              }
              .print-area, .print-area * {
                visibility: visible;
              }
              .print-area {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
              }
              .no-print {
                display: none !important;
              }
              .chart-container {
                page-break-inside: avoid;
              }
              table {
                page-break-inside: avoid;
              }
              h1, h2 {
                page-break-after: avoid;
              }
            }
        `}
      </style>

      {/* Header - Hide on print */}
      <div className="flex justify-between items-center mb-6 no-print">
        <h1 className="text-2xl font-bold">التقارير والإحصائيات</h1>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            طباعة
          </button>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <Download size={18} />
            تصدير إلى Excel
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div className="print-area">
        {/* Report Title for Print */}
        <div className="text-center mb-6 hidden-print-header" style={{ display: 'none' }}>
          <h1 className="text-2xl font-bold">جمعية النور المحمدي</h1>
          <h2 className="text-xl mt-2">تقرير إحصائيات</h2>
          <p className="text-gray-500 mt-1">تاريخ التقرير: {new Date().toLocaleDateString('ar-EG')}</p>
          <hr className="my-4" />
        </div>

        {/* Filters - Hide on print */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 no-print">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">نوع التقرير</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="comprehensive">تقرير شامل</option>
                <option value="aids">توزيع المساعدات</option>
                <option value="beneficiaries">المستفيدين</option>
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total_cases || 0}</div>
                <div className="text-sm text-gray-500">إجمالي الحالات</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <Gift size={24} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total_aids || 0}</div>
                <div className="text-sm text-gray-500">إجمالي المساعدات</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign size={24} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{Number(stats.total_amount || 0).toFixed(2)} ج.م</div>
                <div className="text-sm text-gray-500">إجمالي المبلغ</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp size={24} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total_beneficiaries || 0}</div>
                <div className="text-sm text-gray-500">إجمالي المستفيدين</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 chart-container">
            <h2 className="text-xl font-bold mb-4">توزيع المساعدات حسب النوع</h2>
            {distribution.length > 0 ? (
              <Pie data={aidDistributionChart} options={{ responsive: true }} />
            ) : (
              <p className="text-center text-gray-500 py-8">لا توجد بيانات</p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 chart-container">
            <h2 className="text-xl font-bold mb-4">المساعدات الشهرية</h2>
            {monthlyStats.length > 0 ? (
              <Bar data={monthlyAidChart} options={{ responsive: true }} />
            ) : (
              <p className="text-center text-gray-500 py-8">لا توجد بيانات</p>
            )}
          </div>
        </div>

        {/* Top Beneficiaries Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <h2 className="text-xl font-bold p-4 border-b">أكثر 10 مستفيدين</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right">#</th>
                  <th className="px-6 py-3 text-right">رقم الملف</th>
                  <th className="px-6 py-3 text-right">اسم المستفيد</th>
                  <th className="px-6 py-3 text-right">عدد المساعدات</th>
                  <th className="px-6 py-3 text-right">إجمالي المبلغ</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map((ben: any, idx: number) => (
                  <tr key={ben.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4">{ben.file_number}</td>
                    <td className="px-6 py-4 font-medium">{ben.full_name}</td>
                    <td className="px-6 py-4">{ben.aid_count}</td>
                    <td className="px-6 py-4">{ben.total_amount.toFixed(2)} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold p-4 border-b">آخر الأنشطة</h2>
          <div className="divide-y">
            {stats.recent_activities?.map((activity: any, idx: number) => (
              <div key={idx} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-gray-500">بواسطة: {activity.user || 'نظام'}</p>
                </div>
                <p className="text-sm text-gray-400">
                  {new Date(activity.date).toLocaleDateString('ar-EG')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}