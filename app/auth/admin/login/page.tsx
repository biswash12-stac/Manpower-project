"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

  // ✅ Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast.error("Missing Fields", {
        description: "Please enter both email and password.",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // ✅ Call the real login API via AdminContext
      const success = await login(email, password);

      if (success) {
        toast.success("Welcome back!", {
          description: "Redirecting to dashboard...",
        });
        // Router push happens automatically via useEffect when isAuthenticated changes
      } else {
        toast.error("Authentication Failed", {
          description: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login Error", {
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
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
        className="w-full max-w-md relative z-10 px-4 sm:px-0"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl mb-4">
            <Image src={logo} alt="Logo" className="h-12 sm:h-16 w-auto" priority />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-white/80 text-sm sm:text-base">Gulf Empire Company</p>
        </div>

        {/* Card */}
        <Card className="p-6 sm:p-8 bg-white/95 backdrop-blur">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-[#1A326D]">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <Label className="text-[#1A326D] text-sm sm:text-base">Email</Label>
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

            {/* Password */}
            <div>
              <Label className="text-[#1A326D] text-sm sm:text-base">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#7E86B5]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 sm:pl-10 pr-9 sm:pr-10 h-10 sm:h-12 text-sm sm:text-base text-[#7E86B5]"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E86B5] hover:text-[#1A326D] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-10 sm:h-12 text-sm sm:text-base bg-[#1A326D] hover:bg-[#0F2557] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Demo Credentials (Updated to real credentials) */}
          <div className="mt-6 text-xs sm:text-sm text-center text-muted-foreground">
            <p className="text-[#7E86B5]">Demo Credentials:</p>
            <p className="text-[#7E86B5] text-xs sm:text-sm">Email: admin@gulfempire.com</p>
            <p className="text-[#7E86B5] text-xs sm:text-sm">Password: Admin123!</p>
          </div>

          {/* Back to Website */}
          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-xs sm:text-sm text-[#1A326D] hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1"
            >
              ← Back to Website
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}