"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAdmin } from "@/contexts/AdminContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, Star } from "lucide-react";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  status: string;
  views: number;
  applicationsCount: number;
  isFeatured: boolean;
  createdAt: string;
}

export default function AdminJobsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAdmin();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch jobs
  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs();
    }
  }, [isAuthenticated]);

  const fetchJobs = async () => {
    try {
      const result = await api.get("/jobs?status=all&limit=100");
      if (result.success) {
        setJobs(result.data.jobs || []);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Failed to delete job");
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      if (isFeatured) {
        await api.delete(`/jobs/${id}/feature`);
      } else {
        await api.post(`/jobs/${id}/feature`, { durationDays: 30 });
      }
      fetchJobs(); // Refresh the list
    } catch (error) {
      console.error("Failed to toggle featured:", error);
      alert("Failed to update featured status");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2463] mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 bg-[#F1F5F9] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2463]">Manage Jobs</h1>
          <p className="text-[#64748B] mt-1">Create, edit, and manage job listings</p>
        </div>
        <Link href="/admin/jobs/new">
          <Button className="bg-[#0A2463] hover:bg-[#0A2463]/90">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card className="p-12 text-center bg-white">
          <p className="text-[#64748B] mb-4">No jobs created yet</p>
          <Link href="/admin/jobs/new">
            <Button className="bg-[#0A2463] hover:bg-[#0A2463]/90">
              Create Your First Job
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job._id} className="p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[#0A2463]">{job.title}</h3>
                    {job.isFeatured && (
                      <span className="px-2 py-0.5 bg-[#D4AF37] text-white text-xs rounded-full">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      job.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#64748B] mb-2">{job.company} • {job.location}</p>
                  <p className="text-sm text-[#64748B] mb-1">💰 {job.salary}</p>
                  <div className="flex gap-4 mt-2 text-xs text-[#64748B]">
                    <span>👁️ {job.views} views</span>
                    <span>📝 {job.applicationsCount} applications</span>
                    <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeatured(job._id, job.isFeatured)}
                    className={job.isFeatured ? "bg-[#D4AF37]/10 border-[#D4AF37]" : ""}
                  >
                    <Star className={`w-4 h-4 ${job.isFeatured ? "text-[#D4AF37] fill-[#D4AF37]" : ""}`} />
                  </Button>
                  <Link href={`/admin/jobs/${job._id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/jobs/${job._id}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => deleteJob(job._id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}