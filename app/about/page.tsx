"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  Globe,
  TrendingUp,
} from "lucide-react";

import { Card } from "@/components/ui/card";

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering the highest quality service",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Honest and transparent in all our dealings",
    },
    {
      icon: Users,
      title: "People-First",
      description: "Putting candidates and clients at the heart of everything",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting talent across borders and cultures",
    },
  ];

  const timeline = [
    { year: "1999", event: "Gulf Empire Company founded in Kuwait" },
    { year: "2005", event: "Expanded operations to India" },
    { year: "2010", event: "Reached milestone of 10,000+ placements" },
    { year: "2015", event: "Opened office in Poland for European recruitment" },
    { year: "2020", event: "Digital transformation and online services launch" },
    { year: "2024", event: "Celebrating 25 years of excellence" },
  ];

  const leadership = [
    {
      name: "Ali H. Akdiusare",
      role: "Managing Partner",
      image:
        "https://gulf-empire.com/uploads/icon_image/1568967232_Ali%20H%20A%20%20(1).JPG",
    },
    {
      name: "Rastra Bhushan",
      role: "General Manager",
      image:
        "https://gulf-empire.com/uploads/icon_image/1568967298_Rastra%20Bhushan%20Photo%20(1).jpg",
    },
    {
      name: "Ghassan Al-Shaikh",
      role: "Director of Operations",
      image:
        "https://gulf-empire.com/uploads/icon_image/1568967361_Ghassan%20Al-Shaikh%20Photo%20(1).JPG",
    },
  ];

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A326D] to-[#1A326D]/90 text-white py-20 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-white/90">
            Building bridges between talent and opportunity for over 25 years
          </p>
        </motion.div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center px-4">

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A326D] mb-6">
              Pioneering Manpower Solutions Since 1999
            </h2>

              <p className="text-lg text-[#6B7280] mb-6">
                Gulf Empire Company has been a trusted name in manpower
                recruitment and supply across the Middle East for over two
                decades. Founded in Kuwait, we've grown to become one of the
                region's most respected recruitment agencies.
              </p>
              <p className="text-lg text-[#6B7280] mb-6">
                Our success is built on a foundation of trust, excellence, and
                unwavering commitment to both our clients and candidates. We
                specialize in connecting skilled professionals with leading
                companies across various industries, from construction and oil &
                gas to hospitality and security.
              </p>
              <p className="text-lg text-[#6B7280]">
                With offices in Kuwait, India, and Poland, we maintain a truly
                global presence while understanding the unique needs of the
                Middle Eastern market.
              </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1760246964044-1384f71665b9"
                alt="Corporate building"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full border-0 bg-white">
                <div className="w-16 h-16 bg-[#0A2463]/10 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-[#0A2463]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">Our Mission</h3>
                <p className="text-[#7E86B5]">
                  To be the leading manpower recruitment company in the Middle
                  East by providing exceptional talent acquisition services,
                  fostering long-term partnerships, and creating opportunities
                  that transform lives and businesses.
                </p>
              </Card>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 h-full border-0 bg-white">
                <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">Our Vision</h3>
                <p className="text-[#7E86B5]">
                  To create a world where every talented individual finds their
                  perfect opportunity, and every business discovers the ideal
                  talent to achieve their goals, making us the most trusted
                  partner in manpower solutions.
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Core Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-[#0A2463] mb-4">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full text-center border-0 bg-white hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-[#0A2463]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-[#0A2463]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      {value.title}
                    </h3>
                    <p className="text-[#7E86B5] text-sm">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-[#0A2463] mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-lg text-[#7E86B5] max-w-2xl mx-auto">
              Experienced professionals dedicated to your success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {leadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 hover:shadow-lg transition-shadow">
                  <div className="relative h-64">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/80 to-transparent" />
                  </div>

                  <div className="p-6 text-center bg-white">
                    <h3 className="text-xl font-semibold mb-1 text-[#1A1A1A]">
                      {leader.name}
                    </h3>
                    <p className="text-[#7E86B5] text-sm">
                      {leader.role}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-[#0A2463] mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-[#7E86B5] max-w-2xl mx-auto">
              Key milestones in our growth and success
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-8">
                  <span className="px-4 py-2 bg-[#D4AF37] text-white rounded-full font-bold w-24 text-center">
                    {item.year}
                  </span>

                  <Card className="p-6 border-0 bg-white flex-1">
                    <p className="text-lg text-[#1A1A1A]">{item.event}</p>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#0A2463] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "50,000+", label: "Workers Deployed" },
              { icon: Globe, value: "500+", label: "Partner Companies" },
              { icon: TrendingUp, value: "98%", label: "Success Rate" },
              { icon: Award, value: "25+", label: "Years of Excellence" },
            ].map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-white/80">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}