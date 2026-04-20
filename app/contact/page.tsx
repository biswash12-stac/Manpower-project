"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const offices = [
    {
      country: "Kuwait",
      address: "Al Farwaniyah, Kuwait City, Kuwait",
      phone: "+965 1234 5678",
      email: "kuwait@gulfempire.com",
      hours: "Sun - Thu: 8:00 AM - 6:00 PM",
    },
    {
      country: "India",
      address: "Andheri East, Mumbai, Maharashtra 400069",
      phone: "+91 22 1234 5678",
      email: "india@gulfempire.com",
      hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    },
    {
      country: "Nepal",
      address: "Kathmandu, Nepal",
      phone: "+01 4115960",
      email: "Nepal@gulfempire.com",
      hours: "Mon - Fri: 9:00 AM - 5:00 PM",
    },
  ];

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#19316C] to-[#19316C]/90 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-white/90">
              We're here to help. Get in touch with our team today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* OFFICES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {offices.map((office, index) => (
              <motion.div
                key={office.country}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full border-0 bg-secondary hover:shadow-lg">
                  <div className="w-12 h-12 bg-[#19316C]/10 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-[#19316C]" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-[#19316C]">
                    {office.country}
                  </h3>

                  <div className="space-y-3 text-sm text-[#7E86B5]">
                    <p>{office.address}</p>

                    <a href={`tel:${office.phone}`} className="text-[#19316C]">
                      {office.phone}
                    </a>
                    <br />

                    <a href={`mailto:${office.email}`} className="text-[#19316C]">
                      {office.email}
                    </a>

                    <p className="text-[#7E86B5]">{office.hours}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM + MAP */}
       <section className="py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 border-0 bg-white">
                <h2 className="text-3xl font-bold text-[#19316C] mb-2">
                  Send Us a Message
                </h2>
                <p className="text-[#7E86B5] mb-6">
                  Fill out the form below and we'll get back to you shortly
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-black">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-2 text-[#7E86B5] bg-secondary/50 border-border focus:bg-white transition-colors"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-black">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-2 text-[#7E86B5] bg-secondary/50 border-border focus:bg-white transition-colors"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-black">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-2 text-[#7E86B5] bg-secondary/50 border-border focus:bg-white transition-colors"
                      placeholder="+977 9761616161"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-black">Subject *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) =>
                        setFormData({ ...formData, subject: value })
                      }
                    >
                      <SelectTrigger className="mt-2 text-[#7E86B5]">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hire">
                          I want to hire workers
                        </SelectItem>
                        <SelectItem value="job">
                          I'm looking for a job
                        </SelectItem>
                        <SelectItem value="services">
                          Services inquiry
                        </SelectItem>
                        <SelectItem value="partnership">
                          Partnership opportunity
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-black">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="mt-2 text-[#7E86B5] bg-[#F5F5F5]/50 border-border focus:bg-white transition-colors"
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#19316C] hover:bg-[#19316C]/90"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Map & Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Map Placeholder */}
              <Card className="overflow-hidden border-0 bg-white">
                <div className="relative h-80 bg-secondary">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2967.1080025761307!2d85.3391676745661!3d27.68860162631961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb192a4c13f86f%3A0xae4e4dfbab6db4fd!2sGulf%20Empire%20Company%20Pvt.%20Ltd!5e1!3m2!1sne!2snp!4v1775470667164!5m2!1sne!2snp"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Kuwait Office Location"
                  ></iframe>
                </div>
              </Card>

              {/* Quick Contact Cards */}
              <Card className="p-6 border-0 bg-white">
                <h3 className="text-xl font-bold mb-4 text-[#19316C]" >Quick Contact</h3>
                <div className="space-y-4">
                  <a
                    href="tel:+014115960"
                    className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-lg hover:bg-[#19316C]/10 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#19316C]/10 rounded-full flex items-center justify-center group-hover:bg-[#19316C]/20 transition-colors">
                      <Phone className="w-6 h-6 text-[#19316C]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#7E86B5]">Call Us</p>
                      <p className="font-semibold text-[#19316C]">
                        +01 4115960
                      </p>
                    </div>
                  </a>

                  <a
                    href="mailto:nepal@gulfempire.com"
                    className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-lg hover:bg-[#19316C]/10 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#19316C]/10 rounded-full flex items-center justify-center group-hover:bg-[#19316C]/20 transition-colors">
                      <Mail className="w-6 h-6 text-[#19316C]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#7E86B5]">Email Us</p>
                      <p className="font-semibold text-[#19316C]">
                        Nepal@gulfempire.com
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/9761616161"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-[#25D366]/10 rounded-lg hover:bg-[#25D366]/20 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        WhatsApp Us
                      </p>
                      <p className="font-semibold text-[#25D366]">
                        Chat on WhatsApp
                      </p>
                    </div>
                  </a>
                </div>
              </Card>

              <Card className="p-6 border-0 bg-[#D4AF37]/10 border-[#D4AF37]/20">
                <h3 className="text-xl font-bold mb-2 text-[#19316C]">
                  24/7 Emergency Support
                </h3>
                <p className="text-[#7E86B5] text-sm">
                  For urgent matters, our emergency hotline is available round
                  the clock to assist you.
                </p>
                <a
                  href="tel:+977 9761616161"
                  className="inline-flex items-center gap-2 mt-4 text-[#19316C] font-semibold hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  +977 9761616161
                </a>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

     {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-[#19316C] mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                question: "What countries do you recruit from?",
                answer:
                  "We recruit skilled workers from India, Philippines, Bangladesh, Pakistan, Nepal, and many other countries worldwide.",
              },
              {
                question: "How long does the recruitment process take?",
                answer:
                  "Typically 4-8 weeks from initial consultation to worker deployment, depending on visa processing times and requirements.",
              },
              {
                question: "Do you provide visa processing services?",
                answer:
                  "Yes, we handle complete visa processing, documentation, medical examinations, and all emigration formalities.",
              },
              {
                question: "What industries do you specialize in?",
                answer:
                  "We specialize in Construction, Oil & Gas, Hospitality, Security, Healthcare, and other key sectors.",
              },
            ].map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 border-0 bg-[#F5F5F5] hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold mb-2 text-[#19316C]">{faq.question}</h3>
                  <p className="text-[#7E86B5]   text-sm">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}