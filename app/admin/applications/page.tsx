"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAdmin } from "@/contexts/AdminContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, CheckCircle, XCircle } from "lucide-react";

interface Application {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  country: string;
  status: string;
  appliedAt: string;
  jobId: {
    title: string;
    company: string;
  };
}

export default function AdminApplicationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAdmin();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated]);

  const fetchApplications = async () => {
    try {
      setError(null);
      console.log("Fetching applications...");
      
      const result = await api.get("/applications");
      console.log("API Response:", result);
      
      if (result.success) {
        // Handle different response structures
        let apps = [];
        if (result.data.applications) {
          apps = result.data.applications;
        } else if (Array.isArray(result.data)) {
          apps = result.data;
        } else {
          apps = [];
        }
        setApplications(apps);
        console.log(`Loaded ${apps.length} applications`);
        
        if (apps.length === 0) {
          setError("No applications found. Submit a test application first.");
        }
      } else {
        setError(result.message || "Failed to fetch applications");
      }
    } catch (err: any) {
      console.error("Error fetching applications:", err);
      setError(err.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-400 text-yellow-700">⏳ Pending</Badge>;
      case "reviewing":
        return <Badge className="bg-blue-100 text-blue-700">🔍 Reviewing</Badge>;
      case "shortlisted":
        return <Badge className="bg-green-100 text-green-700">⭐ Shortlisted</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">❌ Rejected</Badge>;
      case "hired":
        return <Badge className="bg-purple-100 text-purple-700">🎉 Hired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A2463]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2463]">Job Applications</h1>
          <p className="text-[#64748B] text-sm mt-1">
            Total: {applications.length} application(s)
          </p>
        </div>
        <Button onClick={fetchApplications} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="p-4 mb-4 bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {applications.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-[#64748B]">No applications received yet</p>
          <p className="text-sm text-[#64748B] mt-2">
            Submit a test application from the jobs page
          </p>
          <Link href="/jobs">
            <Button className="mt-4">Go to Jobs Page</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id} className="p-4 bg-white hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[#0A2463]">
                      {app.firstName} {app.lastName}
                    </h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="text-sm text-[#64748B]">
                    📧 {app.email} | 📞 {app.phone}
                  </p>
                  <p className="text-sm text-[#64748B] mt-1">
                    🎯 {app.position} at {app.jobId?.company || "Unknown"}
                  </p>
                  <p className="text-xs text-[#64748B] mt-2">
                    📅 Applied: {new Date(app.appliedAt).toLocaleString()}
                  </p>
                </div>
                <Link href={`/admin/applications/${app._id}`}>
                  <Button  className="bg-blue-500 text-white rounded" size="sm">
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}