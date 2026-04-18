import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const pageTitles: Record<string, string> = {
  "/dashboard": "الرئيسية",
  "/cases": "إدارة الحالات",
  "/cases/new": "إضافة حالة جديدة",
  "/aids": "المساعدات العامة",
  "/monthly/cycles": "إدارة الدورات الشهرية",
  "/monthly/delivery": "تسليم المساعدات",
  "/monthly/dashboard": "لوحة التحكم الشهرية",
  "/reports": "التقارير والإحصائيات",
  "/users": "إدارة المستخدمين",
  "/audit-logs": "سجل التدقيق",
  "/settings": "الإعدادات",
};

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Collapse sidebar on mobile automatically
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth < 768) setSidebarCollapsed(true);
    };
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Find the best matching title (handles dynamic routes like /cases/123)
  const pageTitle =
    pageTitles[location.pathname] ||
    Object.entries(pageTitles).find(([key]) => location.pathname.startsWith(key))?.[1] ||
    "";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar
          onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
          pageTitle={pageTitle}
        />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
