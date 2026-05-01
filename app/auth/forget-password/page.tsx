"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import logo from "@/public/images/logo.png";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!email) {
    toast.error("Email required", {
      description: "Please enter your email address.",
    });
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch("/api/v1/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (response.ok) {
      setIsSent(true);
      toast.success("Reset link sent!", {
        description: "Check your email for password reset instructions.",
      });
    } else {
      toast.error("Failed", {
        description: result.message || "Something went wrong. Please try again.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    toast.error("Error", {
      description: "Something went wrong. Please try again.",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A326D] via-[#003366] to-[#003366] flex items-center justify-center px-4 relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#D4AF37] rounded-full blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-white rounded-full blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#D4AF37] rounded-full blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 px-4 sm:px-0"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl mb-4">
            <Image src={logo} alt="Logo" className="h-12 sm:h-16 w-auto" priority />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-white/80 text-sm sm:text-base">Gulf Empire Company</p>
        </div>

        <Card className="p-6 sm:p-8 bg-white/95 backdrop-blur">
          {!isSent ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-[#1A326D]">
                Forgot Password?
              </h2>
              <p className="text-center text-sm text-[#7E86B5] mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className="text-[#1A326D] text-sm sm:text-base">Email Address</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#7E86B5]" />
                    <Input
                      type="email"
                      value={email}
                      placeholder="admin@gulfempire.com"
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base text-[#7E86B5]"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-10 sm:h-12 text-sm sm:text-base bg-[#1A326D] hover:bg-[#0F2557] transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-[#1A326D] mb-2">Check Your Email</h2>
              <p className="text-sm text-[#7E86B5] mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link href="/auth/admin/login">
                <Button className="w-full bg-[#1A326D] hover:bg-[#0F2557]">
                  Back to Login
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link 
              href="/auth/admin/login"
              className="text-xs sm:text-sm text-[#1A326D] hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}