import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, HeartHandshake, CalendarRange,
  BarChart3, UserCog, ClipboardList, Settings, LogOut,
  ChevronDown, ChevronUp, Heart,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to?: string;
  adminOnly?: boolean;
  children?: { label: string; to: string }[];
}

const navItems: NavItem[] = [
  { label: "الرئيسية", icon: <LayoutDashboard size={18} />, to: "/dashboard" },
  {
    label: "الحالات",
    icon: <Users size={18} />,
    children: [
      { label: "عرض الحالات", to: "/cases" },
      { label: "إضافة حالة جديدة", to: "/cases/new" },
    ],
  },
  { label: "المساعدات العامة", icon: <HeartHandshake size={18} />, to: "/aids" },
  {
    label: "المساعدات الشهرية",
    icon: <CalendarRange size={18} />,
    children: [
      { label: "إدارة الدورات", to: "/monthly/cycles" },
      { label: "تسليم المساعدات", to: "/monthly/delivery" },
      { label: "لوحة التحكم", to: "/monthly/dashboard" },
    ],
  },
  { label: "التقارير والإحصائيات", icon: <BarChart3 size={18} />, to: "/reports" },
  { label: "المستخدمين", icon: <UserCog size={18} />, to: "/users", adminOnly: true },
  { label: "سجل التدقيق", icon: <ClipboardList size={18} />, to: "/audit-logs", adminOnly: true },
  { label: "الإعدادات", icon: <Settings size={18} />, to: "/settings", adminOnly: true },
];

interface SidebarProps {
  collapsed: boolean;
}

function NavGroup({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const isAnyChildActive = item.children?.some((c) => location.pathname.startsWith(c.to));
  const [open, setOpen] = useState(!!isAnyChildActive);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "sidebar-item w-full",
          isAnyChildActive && "active"
        )}
      >
        <span className="sidebar-item-icon">{item.icon}</span>
        {!collapsed && (
          <>
            <span className="flex-1 text-right">{item.label}</span>
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </>
        )}
      </button>
      {open && !collapsed && (
        <div className="mr-8 mt-1 space-y-0.5 border-r border-white/20 pr-3">
          {item.children?.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                cn(
                  "block px-3 py-1.5 rounded-md text-xs transition-colors",
                  isActive
                    ? "text-white bg-white/15 font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                )
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const { user, logout } = useAuthStore();

  const visible = navItems.filter((item) => !item.adminOnly || user?.role === "Admin");

  return (
    <aside
      className={cn(
        "h-full bg-primary-900 flex flex-col transition-all duration-300 shadow-xl",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
          <Heart size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight">نظام إدارة</p>
            <p className="text-gray-400 text-xs">الحالات الخيرية</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {visible.map((item) =>
          item.children ? (
            <NavGroup key={item.label} item={item} collapsed={collapsed} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to!}
              className={({ isActive }) =>
                cn("sidebar-item", isActive && "active")
              }
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        )}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-white/10 p-3 space-y-1">
        {!collapsed && (
          <div className="px-2 py-2">
            <p className="text-white text-sm font-medium truncate">{user?.full_name}</p>
            <p className="text-gray-400 text-xs">{user?.role === "Admin" ? "مدير النظام" : "موظف"}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}
