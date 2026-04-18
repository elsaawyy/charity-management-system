import { Menu, Bell, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface TopBarProps {
  onToggleSidebar: () => void;
  pageTitle?: string;
}

export default function TopBar({ onToggleSidebar, pageTitle }: TopBarProps) {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm shrink-0">
      {/* Left side: toggle + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        {pageTitle && (
          <h1 className="text-lg font-semibold text-primary-900">{pageTitle}</h1>
        )}
      </div>

      {/* Right side: notifications + user */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-800 leading-tight">{user?.full_name}</p>
            <p className="text-xs text-gray-500">{user?.role === "Admin" ? "مدير النظام" : "موظف"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
