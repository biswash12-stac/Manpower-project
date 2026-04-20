"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Lock, Mail, Eye, EyeOff, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import Image from "next/image";
import logo from "@/public/images/logo.png";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAdmin();

  // ✅ FIX: useEffect for redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = await login(email, password);

    if (success) {
      toast.success("Welcome back!", {
        description: "Redirecting to dashboard...",
      });

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 500);
    } else {
      toast.error("Authentication Failed", {
        description: "Invalid email or password.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A326D] via-[#003366] to-[#003366] flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#D4AF37] rounded-full blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-white rounded-full blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#D4AF37] rounded-full blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl mb-4">
            <Image src={logo} alt="Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-white/80">Gulf Empire Company</p>
        </div>

        {/* Card */}
        <Card className="p-8 bg-white/95 backdrop-blur">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#1A326D]">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <Label className="text-[#1A326D]">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" color="#7E86B5"  />
                <Input
                  type="email"
                  value={email}
                  placeholder="Enter your Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 text-[#7E86B5]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label className="text-[#1A326D]">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" color="#7E86B5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="admin@123"
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 text-[#7E86B5]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E86B5]"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button className="w-full h-12" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Demo */}
          <div className="mt-6 text-sm text-center text-muted-foreground">
            <p className="text-[#7E86B5]">Email: admin@gulfempire.com</p>
            <p className="text-[#7E86B5]">Password: admin123</p>
          </div>

          {/* Back */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm hover:underline text-[#1A326D]">
              ← Back to Website
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}