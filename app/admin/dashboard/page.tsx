"use client";

import { motion } from "motion/react";
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

export default function AdminDashboardPage() {
  const stats = [
    {
      icon: Briefcase,
      label: "Active Jobs",
      value: "28",
      change: "+3",
      changePercent: "12%",
      trend: "up",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: FileText,
      label: "New Applications",
      value: "342",
      change: "+45",
      changePercent: "15%",
      trend: "up",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: Users,
      label: "Total Candidates",
      value: "1,248",
      change: "+89",
      changePercent: "8%",
      trend: "up",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Placements",
      value: "156",
      change: "+12",
      changePercent: "8.3%",
      trend: "up",
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  const recentApplications = [
    {
      id: 1,
      name: "Rajesh Kumar",
      avatar: "RK",
      position: "Construction Supervisor",
      company: "Al-Khaleej Construction",
      date: "2 hours ago",
      status: "pending",
      salary: "KD 450-550",
    },
    {
      id: 2,
      name: "Mohammed Ali",
      avatar: "MA",
      position: "Oil Rig Technician",
      company: "Arabian Oil Services",
      date: "5 hours ago",
      status: "reviewing",
      salary: "SAR 5,000-7,000",
    },
    {
      id: 3,
      name: "Priya Sharma",
      avatar: "PS",
      position: "Hotel Manager",
      company: "Luxury Hotels Group",
      date: "1 day ago",
      status: "approved",
      salary: "AED 8,000-12,000",
    },
    {
      id: 4,
      name: "Ahmed Hassan",
      avatar: "AH",
      position: "Security Supervisor",
      company: "Elite Security Services",
      date: "1 day ago",
      status: "rejected",
      salary: "QAR 3,500-4,500",
    },
    {
      id: 5,
      name: "Maria Santos",
      avatar: "MS",
      position: "Chef de Cuisine",
      company: "Premium Dining Group",
      date: "2 days ago",
      status: "approved",
      salary: "AED 6,000-8,000",
    },
  ];

  const topJobs = [
    { title: "Construction Supervisor", applications: 24, views: 156, trend: "up" },
    { title: "Oil Rig Technician", applications: 18, views: 132, trend: "up" },
    { title: "Hotel Manager", applications: 32, views: 245, trend: "down" },
    { title: "Security Supervisor", applications: 15, views: 98, trend: "up" },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
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
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Applications */}
      <Card className="p-6 border-0 bg-white">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0A2463]">Recent Applications</h2>
          <Link href="/admin/applications" className="text-[#0A2463] hover:underline flex items-center gap-1">
            View All →
          </Link>
        </div>

        <div className="space-y-3">
          {recentApplications.map((app) => {
            const status = getStatusConfig(app.status);

            return (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 bg-[#F1F5F9]/30 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-[#0A2463]">{app.name}</p>
                  <p className="text-sm text-[#64748B]">
                    {app.position}
                  </p>
                </div>

                <Badge className={status.color}>
                  {status.label}
                </Badge>
              </div>
            );
          })}
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
            <a
              href="/admin/jobs"
              className="p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/20 group"
            >
              <Briefcase className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-lg mb-1">Post New Job</p>
              <p className="text-sm text-white/80">Create a new job listing</p>
            </a>
            <a
              href="/admin/applications"
              className="p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/20 group"
            >
              <FileText className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-lg mb-1">Review Applications</p>
              <p className="text-sm text-white/80">45 pending reviews</p>
            </a>
            <a
              href="/admin/candidates"
              className="p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/20 group"
            >
              <Users className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-lg mb-1">Manage Candidates</p>
              <p className="text-sm text-white/80">1,248 in database</p>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}