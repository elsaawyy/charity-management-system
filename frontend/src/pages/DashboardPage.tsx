import { Users, HeartHandshake, TrendingUp, Clock } from "lucide-react";

const stats = [
  { label: "إجمالي الحالات", value: "—", icon: Users, color: "bg-blue-500", bg: "bg-blue-50" },
  { label: "الحالات النشطة", value: "—", icon: TrendingUp, color: "bg-green-500", bg: "bg-green-50" },
  { label: "إجمالي المساعدات", value: "—", icon: HeartHandshake, color: "bg-purple-500", bg: "bg-purple-50" },
  { label: "مساعدات معلقة", value: "—", icon: Clock, color: "bg-orange-500", bg: "bg-orange-50" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="card">
        <h2 className="text-xl font-bold text-primary-900 mb-1">مرحباً بك في النظام 👋</h2>
        <p className="text-gray-500 text-sm">نظام إدارة الحالات الخيرية — لوحة التحكم الرئيسية</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon size={22} className={s.color.replace("bg-", "text-")} />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon placeholder */}
      <div className="card text-center py-12 text-gray-400">
        <HeartHandshake size={48} className="mx-auto mb-3 text-gray-300" />
        <p className="font-medium">سيتم إضافة الإحصائيات التفصيلية في المرحلة القادمة</p>
        <p className="text-sm mt-1">Phase 2 — Dashboard Statistics</p>
      </div>
    </div>
  );
}
