"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function DemandsSection() {
  const demands = [
    "/demand/demand1.jpg",
    "/demand/demand2.jpg",
    "/demand/demand3.jpg",
    "/demand/demad4.jpg",
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0A2463] mb-3">
            Our Latest Available Demands
          </h2>

          <div className="w-20 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

          {demands.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
            >
              <div className="relative w-full h-[250px]">
                <Image
                  src={img}
                  alt="Demand"
                  fill
                  className="object-cover hover:scale-105 transition duration-300"
                />
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}