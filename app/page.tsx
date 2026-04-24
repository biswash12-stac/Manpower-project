"use client";

import { useState, useEffect } from "react";
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
  LogIn,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ClientsSection from "@/components/ClientsSection";
import DemandsSection from "@/components/DemandsSection";

type Testimonial = {
  name: string;
  role: string;
  content: string;
  rating: number;
};

type Job = {
  _id: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  company: string;
};

export default function HomePage() {
  // ⭐ NEW: State for featured jobs
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // ⭐ NEW: Fetch featured jobs on component mount
  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const res = await fetch('/api/v1/jobs/featured?limit=6');
      const data = await res.json();
      if (data.success) {
        setFeaturedJobs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: Users, value: "25+", label: "Years of Experience" },
    { icon: Globe, value: "50,000+", label: "Workers Deployed" },
    { icon: Award, value: "500+", label: "Satisfied Clients" },
    { icon: TrendingUp, value: "98%", label: "Success Rate" },
  ];

  const services = [
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
      description: "Comprehensive onboarding programs",
    },
    {
      icon: Plane,
      title: "Visa Support",
      description: "End-to-end visa processing assistance",
    },
  ];

  const industries = [
    {
      icon: Building2,
      title: "Construction",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=500&q=60",
    },
    {
      icon: Wrench,
      title: "Maintenance",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60",
    },
    {
      icon: Hotel,
      title: "Hospitality",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=60",
    },
    {
      icon: ShieldCheck,
      title: "Security",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=60",
    },
  ];

  // ⭐ REMOVED: Hardcoded jobs array (now using featuredJobs from API)

  const testimonials: Testimonial[] = [
    {
      name: "Ahmed Al-Mansouri",
      role: "HR Manager, Construction Company",
      content: "Gulf Empire provided us with highly skilled workers who exceeded our expectations. Their professionalism and reliability are outstanding.",
      rating: 5,
    },
    {
      name: "Fatima Al-Kaabi",
      role: "Operations Director, Hospitality Sector",
      content: "The entire recruitment process was smooth and efficient. We found the right talent within weeks. Highly recommended!",
      rating: 5,
    },
    {
      name: "Mohammed Al-Dosari",
      role: "Project Lead, Maintenance Services",
      content: "Working with Gulf Empire has been a game-changer. Their candidates are well-trained and committed to excellence.",
      rating: 5,
    },
  ];

  // Helper function to create URL-friendly job slug
  const getJobSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
  };

  return (
    <div className="pt-20">

      {/* HERO */}
      <section className="bg-[#0A2463] text-white py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">

          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Leading Manpower Supply & Recruitment Across the Middle East
            </h1>
            <h3 className="py-5">Connecting skilled professionals with leading companies across Kuwait, UAE, Saudi Arabia, and Qatar.</h3>

            <div className="flex gap-4 flex-wrap">
              <Link href="/contact">
                <Button className="bg-[#D4AF37] text-black hover:bg-gray-200">
                  Hire Talent
                </Button>
              </Link>

              <Link href="/apply">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-black bg-white hover:text-[white] w-full sm:w-auto"
                >
                  Find Your Job
                </Button>
              </Link>

              <Link href="auth/admin/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white w-full sm:w-auto bg-white/10 backdrop-blur-sm"
                >
                  <LogIn className="mr-2 w-5 h-5" />
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1758599543152-a73184816eba?auto=format&fit=crop&w=1080&q=80"
                alt="hero"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"  
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-white grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="p-4">
            <stat.icon className="mx-auto mb-2 text-[#D4AF37]" />
            <h3 className="text-2xl font-bold mb-2 text-[#152E6A]">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-[#152E6A] mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Comprehensive recruitment and HR solutions tailored to your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service: any, index: number) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition h-full bg-white">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-black">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {service.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/services">
              <Button className="bg-[#152E6A] hover:bg-blue-700 text-white">
                View All Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-blue-600 mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Expertise across multiple sectors in the Middle East region
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry: any, index: number) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl h-64 cursor-pointer"
              >
                <Image
                  src={industry.image}
                  alt={industry.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <industry.icon className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold">{industry.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS - UPDATED WITH REAL API DATA */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
                Featured Jobs
              </h2>
              <p className="text-gray-500 mt-2">
                Find your next opportunity in top Gulf countries
              </p>
            </div>

            <Link href="/jobs">
              <Button className="bg-black text-white hover:bg-gray-800">
                Browse All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* ⭐ REPLACED: Hardcoded jobs with dynamic API data + loading state */}
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-500">Loading jobs...</p>
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No featured jobs available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {featuredJobs.map((job: Job, index: number) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span>{job.type}</span>
                      <span className="font-medium text-gray-700">
                        {job.salary}
                      </span>
                    </div>
                  </div>

                  <Link href={`/apply/${getJobSlug(job.title)}`}>
                    <Button className="rounded-full px-6 bg-blue-600 text-white hover:bg-blue-700">
                      Apply
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-[#0A2463] mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-[#6B7280]">
              Trusted by employers and job seekers across the region
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full border-0 bg-gray-50 shadow-sm hover:shadow-md transition">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-[#D4AF37]"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic text-[#6B7280]">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-black">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground text-[#6B7280]">
                      {testimonial.role}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-linear-to-r from-[#0A2463] to-[#0A2463]/90 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Whether you're looking to hire talent or find your dream job, we're
              here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white px-6 py-3 rounded-lg w-full sm:w-auto">
                  Contact Our Team
                </button>
              </Link>
              <Link href="/jobs">
                <button className="border-2 bg-white border-white text-black hover:bg-white hover:text-[#D4AF37] px-6 py-3 rounded-lg w-full sm:w-auto">
                  Browse Jobs
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-[#0A2463] mb-6">
                Why Choose Gulf Empire?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-[#6B7280]">
                With over 25 years of experience, we've built a reputation for
                excellence in manpower recruitment across the Middle East.
              </p>
              <div className="space-y-4 text-[#6B7280]">
                {[
                  "Rigorous candidate screening and verification",
                  "Fast and efficient placement process",
                  "Complete visa and documentation support",
                  "Post-placement support and follow-up",
                  "Industry expertise across multiple sectors",
                  "Transparent pricing and no hidden fees",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1739298061766-e2751d92e9db"
                  alt="Happy team"
                  width={800}
                  height={600}
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D4AF37]/20 rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <ClientsSection />
      <DemandsSection />
    </div>
  );
}