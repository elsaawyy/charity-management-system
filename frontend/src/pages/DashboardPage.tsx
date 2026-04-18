import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Gift, DollarSign, Clock, TrendingUp, HeartHandshake } from 'lucide-react';
import caseService from '@/services/caseService';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({
    total_cases: 0,
    active_cases: 0,
    total_aids: 0,
    total_amount: 0,
    monthly_aid_cases: 0,
    pending_deliveries: 0,
    recent_activities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await caseService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'إجمالي الحالات',
      value: stats.total_cases || 0,
      icon: Users,
      color: 'bg-blue-500',
      link: '/cases'
    },
    {
      title: 'الحالات النشطة',
      value: stats.active_cases || 0,
      icon: Users,
      color: 'bg-green-500',
      link: '/cases'
    },
    {
      title: 'إجمالي المساعدات',
      value: stats.total_aids || 0,
      icon: Gift,
      color: 'bg-purple-500',
      link: '/aids'
    },
    {
      title: 'إجمالي المبلغ',
      value: `${(stats.total_amount || 0).toFixed(2)} ج.م`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      link: '/reports'
    },
    {
      title: 'مساعدات شهرية',
      value: stats.monthly_aid_cases || 0,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      link: '/monthly/dashboard'
    },
    {
      title: 'تسليمات معلقة',
      value: stats.pending_deliveries || 0,
      icon: Clock,
      color: 'bg-red-500',
      link: '/monthly/delivery'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900">جمعية النور المحمدي</h1>
        <p className="text-gray-500 mt-1">لوحة التحكم الرئيسية</p>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-full">
            <HeartHandshake size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">مرحباً بك في النظام</h2>
            <p className="text-white/80 mt-1">جمعية النور المحمدي — لوحة التحكم الرئيسية</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${card.color} bg-opacity-10`}>
                  <card.icon size={24} className={`${card.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-3xl font-bold text-gray-800">{card.value}</span>
              </div>
              <h3 className="text-gray-600 font-medium">{card.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">آخر الأنشطة</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {stats.recent_activities?.length > 0 ? (
            stats.recent_activities.map((activity: any, index: number) => (
              <div key={index} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="text-gray-800">{activity.description}</p>
                  <p className="text-sm text-gray-400 mt-1">بواسطة: {activity.user || 'نظام'}</p>
                </div>
                <p className="text-sm text-gray-400">
                  {new Date(activity.date).toLocaleDateString('ar-EG')}
                </p>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-400">
              لا توجد أنشطة حديثة
            </div>
          )}
        </div>
      </div>
    </div>
  );
}