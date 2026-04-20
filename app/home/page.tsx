"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users,
  Globe,
  Award,
  TrendingUp,
  Building2,
  Wrench,
  Hotel,
  ShieldCheck,
  FileText,
  UserCheck,
  GraduationCap,
  Plane,
  ArrowRight,
  CheckCircle2,
  LogIn,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/* ---------------- TYPES ---------------- */

type Stat = {
  icon: any;
  value: string;
  label: string;
};

type Service = {
  icon: any;
  title: string;
  description: string;
};

type Industry = {
  icon: any;
  title: string;
  image: string;
};

type Job = {
  id: number;
  title: string;
  location: string;
  type: string;
  salary: string;
};

type Testimonial = {
  name: string;
  role: string;
  content: string;
  rating: number;
};

/* ---------------- COMPONENT ---------------- */

export default function HomePage() {
  const stats: Stat[] = [
    { icon: Users, value: "25+", label: "Years of Experience" },
    { icon: Globe, value: "50,000+", label: "Workers Deployed" },
    { icon: Award, value: "500+", label: "Satisfied Clients" },
    { icon: TrendingUp, value: "98%", label: "Success Rate" },
  ];

  const services: Service[] = [
    {
      icon: FileText,
      title: "HR Planning",
      description: "Strategic workforce planning tailored to your business needs",
    },
    {
      icon: UserCheck,
      title: "Overseas Recruitment",
      description: "Global talent acquisition from vetted candidates worldwide",
    },
    {
      icon: GraduationCap,
      title: "Training & Orientation",
      description: "Comprehensive onboarding programs for smooth transitions",
    },
    {
      icon: Plane,
      title: "Visa & Emigration Support",
      description: "End-to-end visa processing and documentation assistance",
    },
  ];

  const industries: Industry[] = [
    {
      icon: Building2,
      title: "Construction",
      image:
        "https://images.unsplash.com/photo-1748956628042-b73331e0b479?auto=format&fit=crop&w=1080&q=80",
    },
    {
      icon: Wrench,
      title: "Oil & Gas",
      image:
        "https://images.unsplash.com/photo-1661263989536-d44cbe1c2ff0?auto=format&fit=crop&w=1080&q=80",
    },
    {
      icon: Hotel,
      title: "Hospitality",
      image:
        "https://images.unsplash.com/photo-1771812967957-2e32963cc31d?auto=format&fit=crop&w=1080&q=80",
    },
    {
      icon: ShieldCheck,
      title: "Security",
      image:
        "https://images.unsplash.com/photo-1764173038831-3ef384e6321e?auto=format&fit=crop&w=1080&q=80",
    },
  ];

  const jobs: Job[] = [
    {
      id: 1,
      title: "Construction Supervisor",
      location: "Kuwait City, Kuwait",
      type: "Full-time",
      salary: "KD 450 - 550",
    },
    {
      id: 2,
      title: "Oil Rig Technician",
      location: "Saudi Arabia",
      type: "Contract",
      salary: "SAR 5,000 - 7,000",
    },
    {
      id: 3,
      title: "Hotel Manager",
      location: "Dubai, UAE",
      type: "Full-time",
      salary: "AED 8,000 - 12,000",
    },
    {
      id: 4,
      title: "Security Officer",
      location: "Qatar",
      type: "Full-time",
      salary: "QAR 3,500 - 4,500",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Ahmed Al-Mansouri",
      role: "HR Director, Construction Co.",
      content:
        "Gulf Empire has been our trusted partner for manpower supply for over 5 years.",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Recruited Worker",
      content:
        "Thanks to Gulf Empire, I found an excellent opportunity in Kuwait.",
      rating: 5,
    },
    {
      name: "Sarah Al-Khalifa",
      role: "Operations Manager",
      content:
        "Reliable, efficient, and always delivers on promises.",
      rating: 5,
    },
  ];

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="relative bg-primary text-white py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
          
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Leading Manpower Supply & Recruitment
            </h1>

            <div className="flex gap-4 flex-wrap">
              <Link href="/contact">
                <Button>Hire Talent</Button>
              </Link>

              <Link href="/apply">
                <Button variant="outline">Find Job</Button>
              </Link>

              <Link href="/admin/login">
                <Button variant="outline">
                  <LogIn className="mr-2 w-4 h-4" />
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1758599543152-a73184816eba?auto=format&fit=crop&w=1080&q=80"
                alt="hero"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-white grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {stats.map((stat, i) => (
          <div key={i}>
            <stat.icon className="mx-auto mb-2 text-[#1A326D]" />
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-gray-50">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-4">
          {services.map((s, i) => (
            <Card key={i} className="p-6">
              <s.icon className="mb-3" />
              <h3 className="font-bold">{s.title}</h3>
              <p className="text-sm">{s.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-20 container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {industries.map((ind, i) => (
          <div key={i} className="relative h-60 rounded-xl overflow-hidden group">
            <Image src={ind.image} alt={ind.title} fill className="object-cover group-hover:scale-110 transition" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
              <ind.icon className="mr-2" />
              {ind.title}
            </div>
          </div>
        ))}
      </section>

      {/* JOBS */}
      <section className="py-20 bg-gray-50 container mx-auto px-4">
        {jobs.map((job) => (
          <div key={job.id} className="flex justify-between p-4 bg-white rounded mb-4">
            <div>
              <h3>{job.title}</h3>
              <p>{job.location}</p>
            </div>

            <Link
              href={`/apply/${job.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Button>Apply</Button>
            </Link>
          </div>
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 container mx-auto px-4 grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <Card key={i} className="p-6">
            <p>"{t.content}"</p>
            <h4 className="mt-4 font-bold">{t.name}</h4>
          </Card>
        ))}
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <Link href="/contact">
          <Button>Contact Us</Button>
        </Link>
      </section>
    </div>
  );
}