"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Candidate = {
  id: number;
  name: string;
  email: string;
  position: string;
  experience: string;
  country: string;
};

export default function AdminCandidatesPage() {
  const [search, setSearch] = useState("");

  const candidates: Candidate[] = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh@email.com",
      position: "Construction Supervisor",
      experience: "5-10 years",
      country: "India",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@email.com",
      position: "Hotel Manager",
      experience: "10+ years",
      country: "India",
    },
  ];

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2463]">
          Candidates Database
        </h1>
        <p className="text-[#64748B]">
          Manage candidate profiles
        </p>
      </div>

      {/* SEARCH */}
      <Card className="p-4 border-0 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <Input
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-[#0A2463] bg-[#F1F5F9] border-0 focus:bg-white"
          />
        </div>
      </Card>

      {/* LIST */}
      <Card className="p-6 border-0 bg-white">
        {filtered.length === 0 ? (
          <p className="text-center text-[#64748B]">
            No candidates found
          </p>
        ) : (
          <div className="space-y-4">
            {filtered.map((candidate, i) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex justify-between items-center p-4 bg-secondary/40 rounded-lg hover:bg-secondary/60 transition"
              >
                <div>
                  <p className="font-semibold text-[#0A2463]">
                    {candidate.name}
                  </p>
                  <p className="text-sm text-[#64748B]">
                    {candidate.email}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {candidate.position} • {candidate.experience} •{" "}
                    {candidate.country}
                  </p>
                </div>

                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}