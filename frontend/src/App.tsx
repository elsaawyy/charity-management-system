import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import PlaceholderPage from "@/pages/PlaceholderPage";

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { fetchMe, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Try to restore session from HTTP-only cookie
    if (!isAuthenticated) {
      fetchMe();
    }
  }, []);

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInitializer>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected – all staff */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Cases (Phase 3) */}
              <Route
                path="/cases"
                element={<PlaceholderPage title="إدارة الحالات" phase="Phase 3 — Case Management" />}
              />
              <Route
                path="/cases/new"
                element={<PlaceholderPage title="إضافة حالة جديدة" phase="Phase 3 — Case Management" />}
              />
              <Route
                path="/cases/:id"
                element={<PlaceholderPage title="تفاصيل الحالة" phase="Phase 3 — Case Management" />}
              />
              <Route
                path="/cases/:id/edit"
                element={<PlaceholderPage title="تعديل الحالة" phase="Phase 3 — Case Management" />}
              />
              <Route
                path="/cases/:caseId/family"
                element={<PlaceholderPage title="أفراد الأسرة" phase="Phase 3 — Case Management" />}
              />
              <Route
                path="/cases/:caseId/work"
                element={<PlaceholderPage title="سجل العمل" phase="Phase 3 — Case Management" />}
              />

              {/* Aids (Phase 4) */}
              <Route
                path="/aids"
                element={<PlaceholderPage title="المساعدات العامة" phase="Phase 4 — General Aids" />}
              />
              <Route
                path="/aids/create"
                element={<PlaceholderPage title="إضافة مساعدة" phase="Phase 4 — General Aids" />}
              />

              {/* Monthly (Phase 5) */}
              <Route
                path="/monthly/cycles"
                element={<PlaceholderPage title="إدارة الدورات الشهرية" phase="Phase 5 — Monthly Aid System" />}
              />
              <Route
                path="/monthly/delivery"
                element={<PlaceholderPage title="تسليم المساعدات" phase="Phase 5 — Monthly Aid System" />}
              />
              <Route
                path="/monthly/dashboard"
                element={<PlaceholderPage title="لوحة التحكم الشهرية" phase="Phase 5 — Monthly Aid System" />}
              />

              {/* Reports (Phase 6) */}
              <Route
                path="/reports"
                element={<PlaceholderPage title="التقارير والإحصائيات" phase="Phase 6 — Reports" />}
              />
            </Route>
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route element={<AppLayout />}>
              <Route
                path="/users"
                element={<PlaceholderPage title="إدارة المستخدمين" phase="Phase 7 — Admin Features" />}
              />
              <Route
                path="/audit-logs"
                element={<PlaceholderPage title="سجل التدقيق" phase="Phase 7 — Admin Features" />}
              />
              <Route
                path="/settings"
                element={<PlaceholderPage title="الإعدادات" phase="Phase 7 — Admin Features" />}
              />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppInitializer>
    </BrowserRouter>
  );
}
