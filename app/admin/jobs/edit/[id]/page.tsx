"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();

  // Dummy initial values (later replace with API)
  const [title, setTitle] = useState("Construction Supervisor");
  const [company, setCompany] = useState("Al-Khaleej Construction");
  const [location, setLocation] = useState("Kuwait City, Kuwait");
  const [salary, setSalary] = useState("KD 450 - 550");

  const handleUpdate = () => {
    toast.success("Job updated successfully");
    router.push(`/admin/jobs/${params.id}`);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2463]">
          Edit Job
        </h1>
        <p className="text-[#64748B]">
          Update job details
        </p>
      </div>

      {/* Form */}
      <Card className="p-6 bg-white shadow-sm space-y-3">

        <div>
          <Label className="text-[#0A2463] my-2">Job Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-[#64748B]"
          />
        </div>

        <div>
          <Label className="text-[#0A2463] my-2">Company</Label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="text-[#64748B]"
          />
        </div>

        <div>
          <Label className="text-[#0A2463] my-2">Location</Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-[#64748B]"
          />
        </div>

        <div>
          <Label className="text-[#0A2463] my-2">Salary</Label>
          <Input
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="text-[#64748B]"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleUpdate}
            className="bg-[#0A2463] text-white"
          >
            Save Changes
          </Button>

          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>

      </Card>

    </div>
  );
}