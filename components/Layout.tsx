"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {WhatsAppButton} from "./WhatsAppButton";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;