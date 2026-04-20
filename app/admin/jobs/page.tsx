"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  MapPin,
  DollarSign,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [jobs, setJobs] = useState<any[]>([]);

  // ✅ LOAD DATA SAFELY
  useEffect(() => {
    const storedJobs = localStorage.getItem("jobs");

    if (storedJobs) {
      const parsed = JSON.parse(storedJobs);

      const cleaned = parsed.map((job: any) => ({
        ...job,
        applications: Number(job.applications) || 0,
        views: Number(job.views) || 0,
        posted: job.posted || "N/A",
        type: job.type || "N/A",
        status: job.status || "draft",
      }));

      setJobs(cleaned);
    }
  }, []);

  // ✅ SAVE DATA ALWAYS
  useEffect(() => {
    if (jobs.length > 0) {
      localStorage.setItem("jobs", JSON.stringify(jobs));
    }
  }, [jobs]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ✅ DELETE FIXED
  const handleDelete = (id: number, title: string) => {
    const updatedJobs = jobs.filter((job) => job.id !== id);

    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));

    toast.success(`Job "${title}" deleted successfully`);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "closed":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      case "draft":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-6 w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0A2463]">
            Job Management
          </h1>
          <p className="text-[#64748B]">
            Manage all job postings and listings
          </p>
        </div>

        <Link href="/admin/jobs/new">
          <Button className="bg-[#0A2463] hover:bg-[#0A2463]/90 gap-2 shadow-lg">
            <Plus className="w-4 h-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-[#64748B] mb-1">Active Jobs</p>
          <p className="text-2xl font-bold text-green-600">
            {jobs.filter((j) => j.status === "active").length || 0}
          </p>
        </Card>

        <Card className="p-4 border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-[#64748B] mb-1">
            Total Applications
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {jobs.reduce(
              (sum, j) => sum + (Number(j.applications) || 0),
              0
            )}
          </p>
        </Card>

        <Card className="p-4 border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-[#64748B] mb-1">Closed Jobs</p>
          <p className="text-2xl font-bold text-gray-600">
            {jobs.filter((j) => j.status === "closed").length || 0}
          </p>
        </Card>

        <Card className="p-4 border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-[#64748B] mb-1">Draft Jobs</p>
          <p className="text-2xl font-bold text-yellow-600">
            {jobs.filter((j) => j.status === "draft").length || 0}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <Input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-2xl bg-[#F1F5F9] border-0 focus:bg-white text-[#0A2463]"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px] text-[#0A2463] bg-[#F1F5F9] border-0 focus:bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-0 shadow-lg">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-0 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F1F5F9]/50">
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead className="text-center">Applications</TableHead>
                  <TableHead className="text-center">Views</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredJobs.map((job, index) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <TableCell>
                      <p className="font-semibold text-[#0A2463]">
                        {job.title}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        Posted: {job.posted || "N/A"}
                      </p>
                    </TableCell>

                    <TableCell className="text-[#64748B]">
                      {job.company}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-black">
                        <MapPin className="w-3 h-3 text-[#64748B]" />
                        {job.location}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{job.type || "N/A"}</Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm font-medium text-black">
                        <DollarSign className="w-3 h-3 text-[#64748B]" />
                        {job.salary}
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-black">
                      {Number(job.applications) || 0}
                    </TableCell>

                    <TableCell className="text-center text-black">
                      {Number(job.views) || 0}
                    </TableCell>

                    <TableCell>
                      <Badge className={getStatusConfig(job.status || "draft")}>
                        {job.status || "draft "}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/jobs/${job.id}`}>
                          <Button size="sm" variant="ghost" className="text-[#64748B]">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Link href={`/admin/jobs/edit/${job.id}`}>
                          <Button size="sm" variant="ghost" className="text-[#64748B]">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(job.id, job.title)}
                          className="text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}