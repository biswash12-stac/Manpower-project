"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    country: "Nepal",
    type: "",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
    status: "active",
    isFeatured: false,
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.title || !form.company || !form.location || !form.type || !form.description) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
 
      const jobData = {
  title: form.title,
  company: form.company,
  location: form.location,
  country: form.country,
  type: form.type.toLowerCase(),
  salary: form.salary,
  description: form.description,
  requirements: form.requirements ? form.requirements.split(",").map(s => s.trim()) : [],
  benefits: form.benefits ? form.benefits.split(",").map(s => s.trim()) : [],
  status: form.status,
  isFeatured: form.isFeatured,
};

      await api.post("/jobs", jobData);
      
      toast.success("Job posted successfully");
      router.push("/admin/jobs");
    } catch (error) {
      console.error("Failed to create job:", error);
      toast.error("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <label className="text-sm font-medium text-[#0A2463]">Job Title *</label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Construction Supervisor"
              className="mt-1 text-[#64748B]"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Company *</label>
            <Input
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="Company name"
              className="mt-1 text-[#64748B]"
              required
            />
          </div>

          {/* Location & Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#0A2463]">Location *</label>
              <Input
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="City"
                className="mt-1 text-[#64748B]"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#0A2463]">Country</label>
              <Input
                value={form.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="Country"
                className="mt-1 text-[#64748B]"
              />
            </div>
          </div>

          {/* Job Type */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Job Type *</label>
            <Select onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger className="mt-1 text-[#64748B]">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="full-time" className="text-[#64748B]">Full-time</SelectItem>
                <SelectItem value="part-time" className="text-[#64748B]">Part-time</SelectItem>
                <SelectItem value="contract" className="text-[#64748B]">Contract</SelectItem>
                <SelectItem value="remote" className="text-[#64748B]">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Salary */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Salary</label>
            <Input
              value={form.salary}
              onChange={(e) => handleChange("salary", e.target.value)}
              placeholder="e.g. NPR 50,000 - 70,000"
              className="mt-1 text-[#64748B]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Description *</label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Job description, responsibilities, etc."
              className="mt-1 text-[#64748B]"
              rows={4}
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Requirements</label>
            <Input
              value={form.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              placeholder="Enter requirements"
              className="mt-1 text-[#64748B]"
            />
            <p className="text-xs text-[#64748B] mt-1">Separate each requirement with a comma</p>
          </div>

          {/* Benefits */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Benefits</label>
            <Input
              value={form.benefits}
              onChange={(e) => handleChange("benefits", e.target.value)}
              placeholder="Comma separated: Health Insurance, Remote Work"
              className="mt-1 text-[#64748B]"
            />
            <p className="text-xs text-[#64748B] mt-1">Separate each benefit with a comma</p>
          </div>

          {/* Featured Job */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              checked={form.isFeatured}
              onChange={(e) => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
              className="w-4 h-4 text-[#0A2463] rounded border-gray-300 focus:ring-[#0A2463]"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-[#0A2463]">
              Feature this job (appears on homepage)
            </label>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-[#0A2463]">Status</label>
            <Select defaultValue="active" onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger className="mt-1 text-[#64748B]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="active" className="text-[#64748B]">Active (Visible to public)</SelectItem>
                <SelectItem value="draft" className="text-[#64748B]">Draft (Hidden)</SelectItem>
                <SelectItem value="closed" className="text-[#64748B]">Closed (No longer accepting)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="bg-[#0A2463] hover:bg-[#0A2463]/90"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Job"}
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