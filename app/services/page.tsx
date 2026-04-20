"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  UserCheck,
  GraduationCap,
  Plane,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ---------------- TYPES ---------------- */

type Service = {
  id: string;
  icon: any;
  title: string;
  description: string;
  features: string[];
  benefits: string[];
};

type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

/* ---------------- COMPONENT ---------------- */

export default function ServicesPage() {
  const services: Service[] = [
    {
      id: "hr-planning",
      icon: FileText,
      title: "HR Planning & Consulting",
      description:
        "Strategic workforce planning and HR consulting services.",
      features: ["Workforce planning", "HR policy", "Talent strategy"],
      benefits: ["Better efficiency", "Lower costs", "Better retention"],
    },
    {
      id: "overseas",
      icon: UserCheck,
      title: "Overseas Recruitment",
      description: "Global talent acquisition services.",
      features: ["Candidate sourcing", "Screening", "Verification"],
      benefits: ["Global talent", "Faster hiring", "Quality candidates"],
    },
    {
      id: "training",
      icon: GraduationCap,
      title: "Training & Orientation",
      description: "Training programs for smooth onboarding.",
      features: ["Orientation", "Skills training", "Safety training"],
      benefits: ["Faster productivity", "Better integration"],
    },
    {
      id: "visa",
      icon: Plane,
      title: "Visa & Emigration Support",
      description: "Complete visa processing support.",
      features: ["Work permits", "Documentation", "Travel support"],
      benefits: ["Faster approvals", "Less paperwork"],
    },
  ];

  const process: ProcessStep[] = [
    { step: 1, title: "Consultation", description: "Understand needs" },
    { step: 2, title: "Sourcing", description: "Find candidates" },
    { step: 3, title: "Screening", description: "Evaluate candidates" },
    { step: 4, title: "Documentation", description: "Visa process" },
    { step: 5, title: "Training", description: "Prepare workers" },
    { step: 6, title: "Deployment", description: "Final placement" },
  ];

  return (
    <div className="pt-20 bg-white">
      {/* HERO */}
      <section className="bg-[#1A326D] text-white py-20 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold">Our Services</h1>
        <p className="mt-4">Comprehensive manpower solutions</p>
      </section>

      {/* SERVICES */}
      <section className="py-20 container mx-auto px-4 space-y-16 ">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="grid lg:grid-cols-2 gap-10">
              <div>
                <service.icon className="mb-4 text-[#1A326D]" />
                <h2 className="text-3xl font-bold mb-3 text-[#1A326D]">{service.title}</h2>
                <p className="mb-6 text-[#7E86B5]">{service.description}</p>

                <div className="space-y-2">
                  {service.features.map((f) => (
                    <div key={f} className="flex gap-2">
                      <CheckCircle2 className="text-[#D4AF37] w-5 h-5 mt-0.5" />
                     <span className="text-[#7E86B5]">
                       {f}
                     </span>
                    </div>
                  ))}
                </div>

                <Link href="/contact">
                  <Button className="mt-6 bg-[#1A326D] hover:bg-[#1A326D]/90 text-white">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <Card className="p-8 border-0 bg-[#F5F5F5]">
                      <h3 className="text-xl font-semibold mb-6 text-black">
                        Key Benefits
                      </h3>
                      <div className="space-y-4">
                        {service.benefits.map((benefit, idx) => (
                          <motion.div
                            key={benefit}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-3 p-4 bg-white rounded-lg"
                          >
                            <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-[#D4AF37] font-bold text-sm">
                                {idx + 1}
                              </span>
                            </div>
                            <p className="font-medium text-[#7E86B5]">
                              {benefit}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </div>
            </div>
          </motion.div>
        ))}
      </section>

       {/* Our Process */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A326D] mb-4">
              Our Process
            </h2>

            <p className="text-lg text-[#7E86B5] max-w-2xl mx-auto">
              A streamlined approach to delivering exceptional manpower solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full border-0 bg-white hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#1A326D] rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
                    {item.step}
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-black">
                    {item.title}
                  </h3>

                  <p className="text-[#7E86B5] text-sm">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1A326D] to-[#1A326D]/90 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Workforce?
            </h2>

            <p className="text-xl text-white/90 mb-8">
              Let's discuss how our services can meet your specific needs and
              help you achieve your business goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-[#C1A23C] hover:bg-[#C1A23C]/90 text-white w-full sm:w-auto"
                >
                  Contact Us Today
                </Button>
              </Link>

              <Link href="/jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#1A326D] w-full sm:w-auto"
                >
                  View Job Openings
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A326D] mb-4">
              Why Choose Gulf Empire?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Proven Track Record",
                description:
                  "25+ years of successful placements and satisfied clients across the Middle East",
              },
              {
                title: "Global Network",
                description:
                  "Extensive network of candidates and partners across multiple countries",
              },
              {
                title: "End-to-End Service",
                description:
                  "Complete support from sourcing to deployment and beyond",
              },
              {
                title: "Industry Expertise",
                description:
                  "Deep understanding of various industries and their unique requirements",
              },
              {
                title: "Compliance Focused",
                description:
                  "Full adherence to local and international labor laws and regulations",
              },
              {
                title: "Dedicated Support",
                description:
                  "24/7 customer service and ongoing post-placement assistance",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full text-center border-0 bg-[#F5F5F5] hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3 text-[#1A1A1A]">
                    {item.title}
                  </h3>

                  <p className="text-[#7E86B5] text-sm">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}