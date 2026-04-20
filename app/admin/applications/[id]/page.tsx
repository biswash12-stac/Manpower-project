"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function ViewApplication() {
  const params = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0A2463]">Application Details</h1>

      <Card className="p-6">
        <p className="text-[#64748B]">ID: {params.id}</p>
        <p className="text-[#64748B]">Show full applicant data here</p>
      </Card>
    </div>
  );
}