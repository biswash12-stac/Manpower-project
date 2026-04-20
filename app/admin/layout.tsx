

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/contexts/AdminContext";
import logo from "@/public/images/logo.png";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout, adminUser } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard", badge: null },
    { icon: Briefcase, label: "Jobs", path: "/admin/jobs", badge: "6" },
    { icon: FileText, label: "Applications", path: "/admin/applications", badge: "6" },
    { icon: MessageSquare, label: "Contacts", path: "/admin/contacts", badge: "4" },
    { icon: Users, label: "Candidates", path: "/admin/candidates", badge: null },
    { icon: Settings, label: "Settings", path: "/admin/settings", badge: null },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] overflow-x-hidden">
      {/* Top Navigation */}
      <header className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">

          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <Image src={logo} alt="Gulf Empire" className="h-9 w-auto cursor-pointer" />
              </Link>
              <div className="hidden md:block h-8 w-px bg-border"></div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-[#0A2463]">Admin Portal</p>
                <p className="text-xs text-[#64748B]">Recruitment Management</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <Input
                type="text"
                placeholder="Search jobs, candidates, applications..."
                className="pl-10 bg-[#F1F5F9] border-0 focus:bg-white text-[#0A2463]"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            <button className="relative p-2 hover:bg-[#F1F5F9] rounded-lg">
              <Bell className="w-5 h-5 text-[#64748B]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-[#F1F5F9] rounded-lg"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-[#0A2463]">{adminUser?.name}</p>
                  <p className="text-xs text-[#64748B]">Administrator</p>
                </div>

                <div className="w-10 h-10 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-semibold">
                  {adminUser?.name?.charAt(0)}
                </div>

                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />

                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50 p-2">
                    <div className="px-3 py-2 border-b mb-2">
                      <p className="font-medium text-[#0A2463]">{adminUser?.name}</p>
                      <p className="text-sm text-[#64748B]">
                        {adminUser?.email}
                      </p>
                    </div>

                    <button className="w-full text-left px-3 py-2 hover:bg-[#F1F5F9] rounded-md text-sm flex items-center gap-2 text-[#0A2463]">
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
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r w-72 transition-transform z-30 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
        >
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-semibold text-[#64748B] uppercase">
                Main Menu
              </p>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg ${isActive
                      ? "bg-[#0A2463] text-white"
                      : "hover:bg-[#F1F5F9] text-[#7E86B5]"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>

                  {item.badge && (
                    <Badge
                      className={
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#0A2463]/10 text-[#0A2463]"
                      }
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-[#7E86B5]/30">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-10 h-10 bg-[#0A2463] text-white rounded-lg flex items-center justify-center">
                GE
              </div>
              <div>
                <p className="text-sm font-medium text-[#0A2463]">Gulf Empire</p>
                <p className="text-xs text-[#64748B]">Admin System</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT (replaces Outlet) */}
        <main className="flex-1 min-w-0 p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}