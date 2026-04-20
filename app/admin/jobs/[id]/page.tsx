"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Dummy data (replace later with API)
  const job = {
    id: params.id,
    title: "Construction Supervisor",
    company: "Al-Khaleej Construction",
    location: "Kuwait City, Kuwait",
    type: "Full-time",
    salary: "KD 450 - 550",
    status: "active",
    description:
      "Responsible for supervising construction activities, ensuring safety and quality standards.",
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0A2463]">
            Job Details
          </h1>
          <p className="text-[#64748B]">
            View detailed job information
          </p>
        </div>

        <Button
          onClick={() => router.push(`/admin/jobs/edit/${params.id}`)}
          className="bg-[#0A2463] text-white"
        >
          Edit Job
        </Button>
      </div>

      {/* Details */}
      <Card className="p-6 bg-white shadow-sm space-y-4">

        <div>
          <p className="text-sm text-[#64748B]">Job Title</p>
          <p className="font-semibold text-[#0A2463]">{job.title}</p>
        </div>

        <div>
          <p className="text-sm text-[#0A2463]">Company</p>
          <p className="text-[#0A2463]">{job.company}</p>
        </div>

        <div>
          <p className="text-sm text-[#0A2463]">Location</p>
          <p className="text-[#64748B]">{job.location}</p>
        </div>

        <div>
          <p className="text-sm text-[#0A2463]">Type</p>
          <p className="text-[#64748B]">{job.type}</p>
        </div>

        <div>
          <p className="text-sm text-[#0A2463]">Salary</p>
          <p className="text-[#64748B]">{job.salary}</p>
        </div>

        <div>
          <p className="text-sm text-[#0A2463]">Status</p>
          <p className="capitalize text-[#64748B]">{job.status}</p>
        </div>

        <div>
          <p className="text-sm text-[#0A2463]">Description</p>
          <p className="text-[#64748B]">{job.description}</p>
        </div>

      </Card>

    </div>
  );
}