"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Download,
  Filter,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import { useAdmin } from "@/contexts/AdminContext";
import { useRouter } from "next/navigation";

interface DashboardStats {
  overview: {
    totalJobs: number;
    activeJobs: number;
    featuredJobs: number;
    totalJobViews: number;
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    totalContacts: number;
    unreadContacts: number;
  };
  trends: {
    applicationsToday: number;
    applicationsThisMonth: number;
    contactsToday: number;
  };
  recent: {
    applications: Array<{
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      status: string;
      appliedAt: string;
      jobId: { title: string };
    }>;
    jobs: Array<{
      _id: string;
      title: string;
      location: string;
      views: number;
      applicationsCount: number;
      createdAt: string;
    }>;
  };
}

export default function AdminDashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAdmin();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated]);

  const fetchDashboardStats = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch("/api/v1/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
        }
      } else if (response.status === 401) {
        // Token expired, redirect to login
        router.push("/auth/admin/login");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      if (diffHours === 1) return "1 hour ago";
      return `${diffHours} hours ago`;
    }
    
    const diffDays = Math.ceil(diffHours / 24);
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Get status config for applications
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
      case "hired":
        return {
          color: "bg-green-100 text-green-700",
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: "Approved",
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-700",
          icon: <Clock className="w-4 h-4" />,
          label: "Pending",
        };
      case "reviewing":
        return {
          color: "bg-blue-100 text-blue-700",
          icon: <FileText className="w-4 h-4" />,
          label: "Reviewing",
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-700",
          icon: <XCircle className="w-4 h-4" />,
          label: "Rejected",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          icon: null,
          label: status,
        };
    }
  };

  // Stats cards data from real API
  const stats = [
    {
      icon: Briefcase,
      label: "Active Jobs",
      value: dashboardData?.overview.activeJobs?.toString() || "0",
      change: "+" + (dashboardData?.overview.activeJobs || 0),
      changePercent: "12%",
      trend: "up",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: FileText,
      label: "New Applications",
      value: dashboardData?.trends.applicationsToday?.toString() || "0",
      change: "+" + (dashboardData?.trends.applicationsToday || 0),
      changePercent: "15%",
      trend: "up",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: Users,
      label: "Total Candidates",
      value: dashboardData?.overview.totalApplications?.toString() || "0",
      change: "+" + (dashboardData?.trends.applicationsThisMonth || 0),
      changePercent: "8%",
      trend: "up",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Placements",
      value: dashboardData?.overview.approvedApplications?.toString() || "0",
      change: "+" + (dashboardData?.overview.approvedApplications || 0),
      changePercent: "8.3%",
      trend: "up",
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2463] mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (handled by useEffect)

  return (
    <div className="space-y-6 bg-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-lg">
        <div>
          <h1 className="text-3xl font-bold text-[#0A2463] mb-1">
            Dashboard Overview
          </h1>
          <p className="text-[#64748B] flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Welcome back! Here's what's happening today
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-white text-black">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2 bg-white text-black">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 border-0 bg-white hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <MoreVertical className="w-4 h-4 text-[#64748B]" />
                </div>

                <p className="text-sm text-[#64748B]">{stat.label}</p>
                <p className="text-3xl font-bold text-black">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change} today</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Applications - From Real API */}
      <Card className="p-6 border-0 bg-white">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0A2463]">Recent Applications</h2>
          <Link href="/admin/applications" className="text-[#0A2463] hover:underline flex items-center gap-1">
            View All →
          </Link>
        </div>

        <div className="space-y-3">
          {dashboardData?.recent?.applications?.length === 0 ? (
            <div className="text-center py-8 text-[#64748B]">
              No applications yet
            </div>
          ) : (
            dashboardData?.recent?.applications?.slice(0, 5).map((app) => {
              const status = getStatusConfig(app.status);
              const fullName = `${app.firstName} ${app.lastName}`;

              return (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-4 bg-[#F1F5F9]/30 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[#0A2463]">{fullName}</p>
                    <p className="text-sm text-[#64748B]">
                      {app.jobId?.title || "Unknown Position"}
                    </p>
                    <p className="text-xs text-[#64748B] mt-1">
                      Applied {formatDate(app.appliedAt)}
                    </p>
                  </div>

                  <Badge className={status.color}>
                    <span className="flex items-center gap-1">
                      {status.icon}
                      {status.label}
                    </span>
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Top Jobs Section - From Real API */}
      <Card className="p-6 border-0 bg-white">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0A2463]">Top Performing Jobs</h2>
          <Link href="/admin/jobs" className="text-[#0A2463] hover:underline flex items-center gap-1">
            Manage Jobs →
          </Link>
        </div>

        <div className="space-y-3">
          {dashboardData?.recent?.jobs?.length === 0 ? (
            <div className="text-center py-8 text-[#64748B]">
              No jobs created yet
            </div>
          ) : (
            dashboardData?.recent?.jobs?.slice(0, 4).map((job, idx) => (
              <div
                key={job._id}
                className="flex items-center justify-between p-4 bg-[#F1F5F9]/30 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold text-[#0A2463]">{job.title}</p>
                  <p className="text-sm text-[#64748B]">{job.location}</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-lg font-bold text-[#0A2463]">{job.applicationsCount || 0}</p>
                  <p className="text-xs text-[#64748B]">Applications</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-lg font-bold text-[#0A2463]">{job.views || 0}</p>
                  <p className="text-xs text-[#64748B]">Views</p>
                </div>
                <div>
                  <Badge className="bg-green-100 text-green-700">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 border-0 bg-linear-to-r from-[#0A2463] via-[#003366] to-[#003366] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
          <p className="text-white/80 mb-6">Manage your recruitment operations efficiently</p>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/admin/jobs/new"
              className="p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/20 group"
            >
              <Briefcase className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-lg mb-1">Post New Job</p>
              <p className="text-sm text-white/80">Create a new job listing</p>
            </Link>
            <Link
              href="/admin/applications"
              className="p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/20 group"
            >
              <FileText className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-lg mb-1">Review Applications</p>
              <p className="text-sm text-white/80">
                {dashboardData?.overview.pendingApplications || 0} pending reviews
              </p>
            </Link>
            <Link
              href="/admin/contacts"
              className="p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/20 group"
            >
              <Users className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-lg mb-1">Contact Messages</p>
              <p className="text-sm text-white/80">
                {dashboardData?.overview.unreadContacts || 0} unread messages
              </p>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}