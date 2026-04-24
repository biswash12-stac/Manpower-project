"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, DollarSign, Filter } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ---------------- TYPES ---------------- */

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  createdAt: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Fetch jobs from API
  useEffect(() => {
    fetchJobs();
  }, [searchTerm, selectedCountry, selectedType]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCountry !== "all") params.append("location", selectedCountry);
      if (selectedType !== "all") params.append("type", selectedType);
      params.append("limit", "50");

      const response = await fetch(`/api/v1/jobs?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setJobs(result.data.jobs || []);
      } else {
        console.error("Failed to fetch jobs:", result.message);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const getPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

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
                className="w-full sm:w-[180px] border rounded-md p-2 text-[#1A1A1A] bg-white"
              >
                <option value="all">All Countries</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="UAE">UAE</option>
                <option value="Qatar">Qatar</option>
                <option value="Nepal">Nepal</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full sm:w-[180px] border rounded-md p-2 text-[#1A1A1A] bg-white"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="contract">Contract</option>
                <option value="part-time">Part-time</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-[#7E86B5]">
            Showing {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
          </div>
        </div>
      </section>

      {/* JOB LISTINGS */}
      <section className="py-12 bg-[#F5F5F5] min-h-[600px]">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 max-w-5xl mx-auto">
            {loading ? (
              <Card className="p-12 text-center border-0 bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A326D] mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Loading jobs...</h3>
                <p className="text-[#7E86B5]">Please wait while we fetch the latest opportunities</p>
              </Card>
            ) : jobs.length === 0 ? (
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
              jobs.map((job, index) => (
                <motion.div
                  key={job._id}
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
                            <h3 className="text-2xl font-semibold mb-1 text-[#1A1A1A]">
                              {job.title}
                            </h3>
                            <p className="text-[#7E86B5]">
                              {job.company}
                            </p>
                          </div>

                          <span className="text-xs ml-4 whitespace-nowrap text-[#7E86B5]">
                            {getPostedDate(job.createdAt)}
                          </span>
                        </div>

                        <p className="text-[#7E86B5] mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        {/* Info */}
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-[#1A326D]" />
                            <span className="text-[#1A1A1A]">{job.location}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="w-4 h-4 text-[#1A326D]" />
                            <span className="capitalize text-[#1A1A1A]">
                              {job.type.replace("-", " ")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-[#1A326D]" />
                            <span className="text-[#1A1A1A]">{job.salary}</span>
                          </div>
                        </div>

                        {/* Requirements */}
                        {job.requirements && job.requirements.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-2 text-[#1A1A1A]">
                              Requirements:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.slice(0, 3).map((req) => (
                                <span
                                  key={req}
                                  className="px-3 py-1 bg-[#F5F5F5] rounded-full text-xs text-black/80"
                                >
                                  {req}
                                </span>
                              ))}
                              {job.requirements.length > 3 && (
                                <span className="px-3 py-1 bg-[#F5F5F5] rounded-full text-xs text-black/80">
                                  +{job.requirements.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:w-auto">
                        <Link href={`/apply/${job._id}`}>
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
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                  
                  try {
                    const response = await fetch('/api/v1/contacts', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: 'Job Alert Subscriber',
                        email,
                        subject: 'Job Alert Subscription',
                        message: 'I would like to receive job alerts.',
                      }),
                    });
                    
                    if (response.ok) {
                      alert('Subscribed successfully! Check your email for confirmation.');
                      form.reset();
                    } else {
                      alert('Failed to subscribe. Please try again.');
                    }
                  } catch (error) {
                    console.error('Subscription error:', error);
                    alert('Something went wrong. Please try again.');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="bg-white text-[#1A1A1A] border-0 focus:bg-white transition-colors"
                />
                <Button type="submit" className="bg-[#D4AF37] hover:bg-[#1A326D]/90 text-white">
                  Subscribe
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}