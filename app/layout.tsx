"use client";

import { usePathname } from "next/navigation";
import { AdminProvider } from "@/contexts/AdminContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en" suppressHydrationWarning className={cn("font-mono", jetbrainsMono.variable)}>
      <body className="bg-gray-50" suppressHydrationWarning>  {/* ← Changed from bg-[#F1F5F9]/30 */}
        <AdminProvider>
          {!isAdmin && <Navbar />}
          {children}
          {!isAdmin && <Footer />}
        </AdminProvider>
      </body>
    </html>
  );
}