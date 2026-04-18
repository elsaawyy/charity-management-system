import { Menu, Bell, User, Heart, LogOut, UserCircle, Settings } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { Link } from "react-router-dom";

interface TopBarProps {
  onToggleSidebar: () => void;
  pageTitle?: string;
}

export default function TopBar({ onToggleSidebar, pageTitle }: TopBarProps) {
  const { user, logout } = useAuthStore();
  const [logoError, setLogoError] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm shrink-0">
      {/* Left side: logo + toggle + title */}
      <div className="flex items-center gap-4">
        {/* Mobile Logo (visible when sidebar collapsed) */}
        <div className="flex items-center gap-2 md:hidden">
          {!logoError ? (
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-8 w-auto object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
          )}
        </div>
        
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        
        {pageTitle && (
          <h1 className="text-lg font-semibold text-primary-900 hidden sm:block">{pageTitle}</h1>
        )}
      </div>

      {/* Center - Page title for mobile */}
      {pageTitle && (
        <h1 className="text-md font-semibold text-primary-900 sm:hidden">{pageTitle}</h1>
      )}

      {/* Right side: notifications + user dropdown */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
          <Bell size={18} />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 pl-3 border-l border-gray-200"
          >
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-800 leading-tight">{user?.full_name}</p>
              <p className="text-xs text-gray-500">{user?.role === "Admin" ? "مدير النظام" : "موظف"}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
                <Link
                  to="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserCircle size={18} />
                  <span>الملف الشخصي</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t"
                >
                  <Settings size={18} />
                  <span>الإعدادات</span>
                </Link>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t w-full text-right"
                >
                  <LogOut size={18} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}