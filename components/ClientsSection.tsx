"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ClientsSection() {
    const [activeTab, setActiveTab] = useState("kuwait");

    const tabs = [
        { key: "kuwait", label: "Kuwait" },
        { key: "qatar", label: "Qatar" },
        { key: "UAE", label: "UAE" },
        { key: "KSA", label: "KSA" },
        { key: "malaysia", label: "Malaysia" },
    ];
    const clientsData: Record<string, string[]> = {
        kuwait: [
            "/clients/kuwait 1.jpg",
            "/clients/kuwait 2.jpg",
            "/clients/kuwait 3.png",
            "/clients/kuwait 4.jpg",
            "/clients/kuwait.png",
        ],
        qatar: ["/clients/qatar 1.jpg", "/clients/qatar 2.svg", "/clients/qatar 3.png"],
        UAE: ["/clients/uae1.png", "/clients/uae2.svg", "/clients/uae3.png"],
        KSA: ["/clients/ksa1.jpg", "/clients/ksa2.png"],
        malaysia: ["/clients/malaysia1.png", "/clients/malaysia2.jpg"],
    };

    return (
        <section className="py-20 bg-[#0A2463] text-white relative overflow-hidden">
            <div className="container mx-auto px-4">

                {/* Heading */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-2">
                        Our Clients
                    </h2>
                    <div className="w-20 h-1 bg-[#D4AF37] mx-auto"></div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 flex-wrap mb-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === tab.key
                                    ? "bg-[#D72638] text-white"
                                    : "bg-white/10 hover:bg-white/20"
                                }`}
                        >
                            {tab.label.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t border-white/20 mb-10"></div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {clientsData[activeTab].map((logo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-4 rounded-md flex items-center justify-center h-25"
                        >
                            <Image
                                src={logo}
                                alt="client logo"
                                width={100}
                                height={60}
                                className="object-contain max-h-15"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}