"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
// 👉 Move logo to /public/images/logo.png
import logo from "@/public/images/logo.png";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const services = [
    { name: "HR Planning", path: "/services#hr-planning" },
    { name: "Overseas Recruitment", path: "/services#overseas" },
    { name: "Training & Orientation", path: "/services#training" },
    { name: "Visa & Emigration", path: "/services#visa" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-3"
          : "bg-white/95 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
          <Image 
  src={logo} 
  alt="gulfEmpire-Logo" 
  className="h-16 w-auto" 
  loading="eager"
  priority
/>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-black">
            
            <Link
              href="/"
              className={`hover:text-[#1A326D] transition-colors ${
                pathname === "/" ? "text-[#1A326D]" : "text-[#7E86B5]"
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={`hover:text-[#1A326D] transition-colors ${
                pathname === "/about" ? "text-[#1A326D]" : "text-[#7E86B5]"
              }`}
            >
              About Us
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("services")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 hover:text-[#1A326D] transition-colors text-[#7E86B5]">
                Services
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {activeDropdown === "services" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border overflow-hidden"
                  >
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        href={service.path}
                        className="block px-4 py-3 hover:bg-secondary transition-colors"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/jobs"
              className={`hover:text-[#1A326D] transition-colors ${
                pathname === "/jobs" ? "text-[#1A326D]" : "text-[#7E86B5]"
              }`}
            >
              Jobs
            </Link>

            <Link
              href="/contact"
              className={`hover:text-[#1A326D] transition-colors ${
                pathname === "/contact" ? "text-[#1A326D]" : "text-[#7E86B5]"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4 text-black" >
            <button className="flex items-center gap-2 text-muted-foreground hover:text-[#1A326D] transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm">EN</span>
            </button>

            <Link href={`/jobs`}>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                Apply Now
              </Button>
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 bg-slate-600"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden  "
            >
              <nav className="flex flex-col gap-4 pt-6 pb-4">
                
                <Link href="/" className="hover:text-[#1A326D]">
                  Home
                </Link>

                <Link href="/about" className="hover:text-[#1A326D]">
                  About Us
                </Link>

                <div className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-sm">
                    Services
                  </span>

                  <div className="flex flex-col gap-2 pl-4">
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        href={service.path}
                        className="hover:text-[#1A326D] text-sm"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link href="/jobs" className="hover:text-[#1A326D]">
                  Jobs
                </Link>

                <Link href="/contact" className="hover:text-[#1A326D]">
                  Contact
                </Link>

                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <button className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">EN</span>
                  </button>

                  <Link href="/apply" className="flex-1">
                    <Button className="w-full bg-[#D4AF37] text-white ">
                      Apply Now
                    </Button>
                  </Link>
                </div>

              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;