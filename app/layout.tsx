"use client";

import { usePathname } from "next/navigation";
import { AdminProvider } from "@/contexts/AdminContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="bg-[#F1F5F9]/30">
        <AdminProvider>
          {!isAdmin && <Navbar />}
          
          {children}
          
          {!isAdmin && <Footer />}
        </AdminProvider>
      </body>
    </html>
  );
}