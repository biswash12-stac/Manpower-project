import { Outlet, Link, useLocation, useNavigate } from "react-router";
// import { useAdmin } from "../contexts/AdminContext";
import { useAdmin } from "@/contexts/AdminContext";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
// import logo from "figma:asset/2a45adb838cec2b13d9fa57f78ef784fba7c2c6d.png";

export function AdminLayout() {
  const { logout, adminUser } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
      badge: null,
    },
    {
      icon: Briefcase,
      label: "Jobs",
      path: "/admin/jobs",
      badge: "28",
    },
    {
      icon: FileText,
      label: "Applications",
      path: "/admin/applications",
      badge: "45",
    },
    {
      icon: MessageSquare,
      label: "Contacts",
      path: "/admin/contacts",
      badge: "12",
    },
    {
      icon: Users,
      label: "Candidates",
      path: "/admin/candidates",
      badge: null,
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/admin/settings",
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Top Navigation */}
      <header className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <div className="flex items-center gap-3">
              {/* <img src={logo.src} alt="Gulf Empire" className="h-9 w-auto" /> */}
              <div className="hidden md:block h-8 w-px bg-border"></div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-[#1A326D]">Admin Portal</p>
                <p className="text-xs text-muted-foreground">Recruitment Management</p>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs, candidates, applications..."
                className="pl-10 bg-secondary/50 border-0 focus:bg-white"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{adminUser?.name}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  {adminUser?.name?.charAt(0)}
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-border z-50 p-2">
                    <div className="px-3 py-2 border-b border-border mb-2">
                      <p className="font-medium">{adminUser?.name}</p>
                      <p className="text-sm text-muted-foreground">{adminUser?.email}</p>
                    </div>
                    <button className="w-full text-left px-3 py-2 hover:bg-secondary rounded-md text-sm flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-border w-72 transition-transform duration-300 z-30 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Main Menu
              </p>
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all group ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "hover:bg-secondary text-[#7E86B5]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-muted-foreground group-hover:text-[#1A326D]"
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      className={`${
                        isActive
                          ? "bg-white/20 text-white hover:bg-white/20"
                          : "bg-primary/10 text-[#1A326D] hover:bg-primary/10"
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-secondary/30">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
                GE
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Gulf Empire</p>
                <p className="text-xs text-muted-foreground">Admin System</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}