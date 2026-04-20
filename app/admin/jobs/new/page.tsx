"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function NewJobPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    status: "active",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // simple validation
    if (!form.title || !form.company || !form.location) {
      toast.error("Please fill all required fields");
      return;
    }

    console.log("NEW JOB:", form);

    toast.success("Job posted successfully");

    // redirect back to jobs page
    router.push("/admin/jobs");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2463]">Post New Job</h1>
        <p className="text-[#64748B]">Create a new job listing</p>
      </div>

      {/* Form */}
      <Card className="p-6 bg-white shadow-sm border-0">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Job Title */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Job Title</label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Construction Supervisor"
              className="mt-1 text-[#64748B]"
            />
          </div>

          {/* Company */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Company</label>
            <Input
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="Company name"
              className="mt-1 text-[#64748B]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Location</label>
            <Input
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="City, Country"
              className="mt-1 text-[#64748B]"
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Job Type</label>
            <Select onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger className="mt-1 text-[#64748B]">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Full-time" className="text-[#64748B]">Full-time</SelectItem>
                <SelectItem value="Part-time" className="text-[#64748B]">Part-time</SelectItem>
                <SelectItem value="Contract" className="text-[#64748B]">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Salary */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Salary</label>
            <Input
              value={form.salary}
              onChange={(e) => handleChange("salary", e.target.value)}
              placeholder="e.g. Rs 50,000 - 70,000"
              className="mt-1 text-[#64748B]"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Status</label>
            <Select defaultValue="active" onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger className="mt-1 text-[#64748B]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="active" className="text-[#64748B]">Active</SelectItem>
                <SelectItem value="draft" className="text-[#64748B]">Draft</SelectItem>
                <SelectItem value="closed" className="text-[#64748B]">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-[#0A2463] hover:bg-[#0A2463]/90">
              Post Job
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/jobs")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}