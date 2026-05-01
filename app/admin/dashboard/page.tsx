// app/admin/dashboard/page.tsx
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
  Eye,
  Mail,
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

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
      case "hired":
        return { color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-3 h-3" />, label: "Approved" };
      case "pending":
        return { color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3 h-3" />, label: "Pending" };
      case "reviewing":
        return { color: "bg-blue-100 text-blue-700", icon: <Eye className="w-3 h-3" />, label: "Reviewing" };
      case "rejected":
        return { color: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" />, label: "Rejected" };
      default:
        return { color: "bg-gray-100 text-gray-700", icon: null, label: status };
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2463] mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A2463]">Dashboard Overview</h1>
        <p className="text-[#64748B] text-sm mt-1 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Welcome back! Here's what's happening today
        </p>
      </div>

      {/* Stats Cards - Vertical Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-white hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-green-600">+{dashboardData?.overview.activeJobs || 0}</span>
          </div>
          <p className="text-2xl font-bold text-[#0A2463]">{dashboardData?.overview.activeJobs || 0}</p>
          <p className="text-sm text-[#64748B] mt-1">Active Jobs</p>
        </Card>

        <Card className="p-5 bg-white hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-green-600">+{dashboardData?.trends.applicationsToday || 0}</span>
          </div>
          <p className="text-2xl font-bold text-[#0A2463]">{dashboardData?.trends.applicationsToday || 0}</p>
          <p className="text-sm text-[#64748B] mt-1">New Applications Today</p>
        </Card>

        <Card className="p-5 bg-white hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-green-600">+{dashboardData?.trends.applicationsThisMonth || 0}</span>
          </div>
          <p className="text-2xl font-bold text-[#0A2463]">{dashboardData?.overview.totalApplications || 0}</p>
          <p className="text-sm text-[#64748B] mt-1">Total Candidates</p>
        </Card>

        <Card className="p-5 bg-white hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs text-green-600">+{dashboardData?.overview.approvedApplications || 0}</span>
          </div>
          <p className="text-2xl font-bold text-[#0A2463]">{dashboardData?.overview.approvedApplications || 0}</p>
          <p className="text-sm text-[#64748B] mt-1">Placements</p>
        </Card>
      </div>

      {/* Recent Applications - Vertical Card */}
      <Card className="p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0A2463]">Recent Applications</h2>
            <p className="text-sm text-[#64748B]">Latest job applications received</p>
          </div>
          <Link href="/admin/applications">
            <Button variant="ghost" size="sm" className="text-[#0A2463]">
              View All →
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {dashboardData?.recent?.applications?.length === 0 ? (
            <div className="text-center py-8 text-[#64748B]">No applications yet</div>
          ) : (
            dashboardData?.recent?.applications?.slice(0, 5).map((app) => {
              const status = getStatusConfig(app.status);
              return (
                <div key={app._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <p className="font-semibold text-[#0A2463]">{app.firstName} {app.lastName}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{app.jobId?.title || "Unknown Position"}</p>
                    <p className="text-xs text-[#64748B] mt-1">📅 {formatDate(app.appliedAt)}</p>
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

      {/* Top Performing Jobs - Vertical Card */}
      <Card className="p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0A2463]">Top Performing Jobs</h2>
            <p className="text-xs text-[#64748B]">Most viewed and applied jobs</p>
          </div>
          <Link href="/admin/jobs">
            <Button variant="ghost" size="sm" className="text-[#0A2463]">
              Manage Jobs →
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {dashboardData?.recent?.jobs?.length === 0 ? (
            <div className="text-center py-8 text-[#64748B]">No jobs created yet</div>
          ) : (
            dashboardData?.recent?.jobs?.slice(0, 4).map((job) => (
              <div key={job._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-[#0A2463]">{job.title}</p>
                  <p className="text-xs text-[#64748B]">📍 {job.location}</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#0A2463]">{job.applicationsCount || 0}</p>
                    <p className="text-xs text-[#64748B]">Applications</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#0A2463]">{job.views || 0}</p>
                    <p className="text-xs text-[#64748B]">Views</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions - Full Width Feature Card */}
      <Card className="p-6 bg-gradient-to-r from-[#0A2463] to-[#003366] text-white">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
          <p className="text-white/80 text-sm mb-6">Manage your recruitment operations efficiently</p>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/admin/jobs/new" className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition border border-white/20">
              <Briefcase className="w-8 h-8" />
              <div>
                <p className="font-semibold">Post New Job</p>
                <p className="text-xs text-white/70">Create a new job listing</p>
              </div>
            </Link>
            <Link href="/admin/applications" className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition border border-white/20">
              <FileText className="w-8 h-8" />
              <div>
                <p className="font-semibold">Review Applications</p>
                <p className="text-xs text-white/70">{dashboardData?.overview.pendingApplications || 0} pending reviews</p>
              </div>
            </Link>
            <Link href="/admin/contacts" className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition border border-white/20">
              <Mail className="w-8 h-8" />
              <div>
                <p className="font-semibold">Contact Messages</p>
                <p className="text-xs text-white/70">{dashboardData?.overview.unreadContacts || 0} unread messages</p>
              </div>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}