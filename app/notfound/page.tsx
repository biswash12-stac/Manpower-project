"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#1A326D] mb-4">404</h1>
          <h2 className="text-3xl font-bold text-[#7E86B5] mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          {/* ✅ FIXED LINK */}
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>

          <Link href="/jobs">
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              Browse Jobs
            </Button>
          </Link>

        </div>
      </motion.div>
    </div>
  );
}