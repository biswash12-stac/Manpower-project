"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, DollarSign, Filter } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------------- TYPES ---------------- */

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  country: string;
  industry: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
};

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const jobs: Job[] = [
    {
      id: 1,
      title: "Construction Supervisor",
      company: "Al-Khaleej Construction",
      location: "Kuwait City, Kuwait",
      country: "kuwait",
      industry: "construction",
      type: "full-time",
      salary: "KD 450 - 550",
      description: "Oversee construction projects and manage teams",
      requirements: ["5+ years experience", "Driving license", "Safety cert"],
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Oil Rig Technician",
      company: "Arabian Oil Services",
      location: "Saudi Arabia",
      country: "saudi",
      industry: "oil-gas",
      type: "contract",
      salary: "SAR 5,000 - 7,000",
      description: "Maintain oil rig equipment",
      requirements: ["Technical cert", "3+ years exp"],
      posted: "1 week ago",
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    return (
      (searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCountry === "all" || job.country === selectedCountry) &&
      (selectedIndustry === "all" || job.industry === selectedIndustry) &&
      (selectedType === "all" || job.type === selectedType)
    );
  });

  return (
    <div className="pt-20">
      {/* HERO */}
       <section className="relative bg-linear-to-br from-[#1A326D] to-[#1A326D]/90 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-white/90">
              Explore exciting opportunities across the Middle East
            </p>
          </motion.div>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className="py-8 bg-white border-b sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7E86B5]" />

              <Input
                type="text"
                placeholder="Search jobs or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-[#7E86B5] bg-[#F5F5F5] border-0 focus:bg-white transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full sm:w-[180px] border rounded-md p-2 text-[#1A1A1A]"
              >
                <option value="all">All Countries</option>
                <option value="kuwait">Kuwait</option>
                <option value="saudi">Saudi Arabia</option>
                <option value="uae">UAE</option>
                <option value="qatar">Qatar</option>
              </select>

              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full sm:w-[180px] border rounded-md p-2 text-[#1A1A1A]"
              >
                <option value="all">All Industries</option>
                <option value="construction">Construction</option>
                <option value="oil-gas">Oil & Gas</option>
                <option value="hospitality">Hospitality</option>
                <option value="security">Security</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full sm:w-[180px] border rounded-md p-2 text-[#1A1A1A]"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="contract">Contract</option>
                <option value="part-time">Part-time</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-[#7E86B5]">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        </div>
      </section>

      {/* JOB LISTINGS */}
      <section className="py-12 bg-[#F5F5F5] min-h-[600px]">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 max-w-5xl mx-auto">
            {filteredJobs.length === 0 ? (
              <Card className="p-12 text-center border-0 bg-white">
                <Filter className="w-16 h-16 text-[#7E86B5] mx-auto mb-4" />

                <h3 className="text-2xl font-semibold mb-2">
                  No jobs found
                </h3>

                <p className="text-[#7E86B5]">
                  Try adjusting your filters or search terms
                </p>
              </Card>
            ) : (
              filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow border-0 bg-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-2xl font-semibold mb-1 text-[#1A1A1A] ">
                              {job.title}
                            </h3>
                            <p className="text-[#7E86B5]">
                              {job.company}
                            </p>
                          </div>

                          <span className="text-xs  ml-4 whitespace-nowrap text-[#7E86B5]">
                            {job.posted}
                          </span>
                        </div>

                        <p className="text-[#7E86B5] mb-4">
                          {job.description}
                        </p>

                        {/* Info */}
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-primary text-[#1A326D]" />
                            <span className="text-[#1A1A1A]">{job.location}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="w-4 h-4 text-[#1A326D]" />
                            <span className="capitalize text-[#1A1A1A] ">
                              {job.type.replace("-", " ")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-[#1A326D]" />
                            <span className="text-[#1A1A1A]">{job.salary}</span>
                          </div>
                        </div>

                        {/* Requirements */}
                        <div>
                          <p className="text-sm font-semibold mb-2 text-[#1A1A1A]">
                            Requirements:
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {job.requirements.map((req) => (
                              <span
                                key={req}
                                className="px-3 py-1 bg-[#F5F5F5] rounded-full text-xs text-black/80"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:w-auto">
                        <Link href={`/apply/${job.id}`}>
                          <Button className="w-full bg-[#1A326D] hover:bg-[#1A326D]/90">
                            Apply Now
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          className="w-full border-[#1A326D] text-[#1A326D] hover:bg-[#1A326D]/5 bg-white"
                        >
                          Save Job
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* JOB ALERTS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="p-8 lg:p-12 text-center border-0 bg-gradient-to-br from-[#1A326D] to-[#1A326D]/90 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Get Job Alerts Straight to Your Inbox
              </h2>

              <p className="text-white/90 mb-6">
                Subscribe to receive notifications about new job openings
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white text-[#1A1A1A] border-0 focus:bg-white transition-colors"
                />

                <Button className="bg-[#D4AF37] hover:bg-[#1A326D]/90 text-white">
                  Subscribe
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}