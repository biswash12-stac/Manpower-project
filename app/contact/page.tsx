"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/v1/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ 
          name: "", 
          email: "", 
          phone: "", 
          subject: "General Inquiry", 
          message: "" 
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-white pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1A326D] mb-4">
            Send Us a Message
          </h1>
          <p className="text-lg text-[#7E86B5]">
            Fill out the form below and we'll get back to you shortly
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
            ✅ Message sent successfully! Check your email for confirmation.
          </div>
        )}

        {/* Contact Form Card */}
        <Card className="p-8 shadow-lg border-0 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-[#1A326D] mb-2">
                Full Name *
              </label>
              <Input
                required
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#F5F5F5] border-0 focus:bg-white transition-colors text-[#1A1A1A] placeholder:text-[#7E86B5]"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-[#1A326D] mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                required
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#F5F5F5] border-0 focus:bg-white transition-colors text-[#1A1A1A] placeholder:text-[#7E86B5]"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-[#1A326D] mb-2">
                Phone Number
              </label>
              <Input
                placeholder="+977 9761616161"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#F5F5F5] border-0 focus:bg-white transition-colors text-[#1A1A1A] placeholder:text-[#7E86B5]"
              />
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-sm font-semibold text-[#1A326D] mb-2">
                Subject *
              </label>
              <select
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-[#F5F5F5] border-0 rounded-md px-3 py-2 text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A326D]/20 transition-colors"
              >
                <option>General Inquiry</option>
                <option>Job Application Help</option>
                <option>Partnership</option>
                <option>Support</option>
                <option>Other</option>
              </select>
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-semibold text-[#1A326D] mb-2">
                Message *
              </label>
              <Textarea
                required
                rows={6}
                placeholder="Tell us how we can help you..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#F5F5F5] border-0 focus:bg-white transition-colors resize-none text-[#1A1A1A] placeholder:text-[#7E86B5]"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A326D] hover:bg-[#1A326D]/90 text-white py-6 text-lg font-semibold transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}