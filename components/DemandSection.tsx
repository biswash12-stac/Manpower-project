"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";

interface Demand {
  _id: string;
  title: string;
  category: string;
  quantity: number;
  gender: string;
  ageRange: { min: number; max: number };
  location: string;
  salary: string;
  deadline: string;
}

export default function DemandsSection() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemands();
  }, []);

  const fetchDemands = async () => {
    try {
      const response = await fetch("/api/v1/Demand?limit=50");
      const result = await response.json();
      if (result.success) {
        setDemands(result.data.demands);
      }
    } catch (error) {
      console.error("Failed to fetch demands:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading demands...</div>;
  }

  if (demands.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0A2463] mb-3">
            Our Latest Available Demands
          </h2>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demands.map((demand) => (
            <Card key={demand._id} className="p-5 hover:shadow-lg transition-shadow border-t-4 border-t-[#D4AF37]">
              <h3 className="text-lg font-bold text-[#0A2463] mb-2">{demand.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <span>Quantity: {demand.quantity} {demand.gender !== 'Both' ? `(${demand.gender})` : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>{demand.location}</span>
                </div>
                {demand.salary && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                    <span>{demand.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span>Deadline: {new Date(demand.deadline).toLocaleDateString()}</span>
                </div>
                <div className="mt-3 pt-2 border-t">
                  <p className="text-xs text-gray-400">Age: {demand.ageRange.min} - {demand.ageRange.max} years</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}