"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Users, DollarSign, Newspaper, X, Clock, Eye } from "lucide-react";

interface Demand {
  _id: string;
  title: string;
  quantity: number;
  gender: string;
  ageRange: { min: number; max: number };
  location: string;
  salary: string;
  deadline: string;
  publishedInNewspaper?: boolean;
  newspaperName?: string;
  newspaperDate?: string;
  newspaperImage?: string;
  requirements?: string[];
}

export default function DemandsSection() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNewspaper, setSelectedNewspaper] = useState<Demand | null>(null);

  useEffect(() => {
    fetchDemands();
  }, []);

  const fetchDemands = async () => {
    try {
      const response = await fetch("/api/v1/Demand?limit=50");
      const result = await response.json();
      if (result.success) {
        const demandsData = result.data.demands || result.data || [];
        setDemands(demandsData);
      }
    } catch (error) {
      console.error("Failed to fetch demands:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2463]"></div>
          <p className="mt-4 text-gray-500">Loading opportunities...</p>
        </div>
      </section>
    );
  }

  if (demands.length === 0) return null;

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Latest Demand</h2>
            <div className="w-16 h-0.5 bg-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Verified Newspaper Advertisement</p>
          </div>

          {/* Grid - Clean 3 column layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demands.map((demand, index) => (
              <motion.div
                key={demand._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg max-w-sm mx-auto transition-shadow duration-300">
                  
                  {/* Newspaper Image - Fixed height, clean */}
                  <div 
                    className="relative h-48 bg-gray-100 cursor-pointer overflow-hidden"
                    onClick={() => demand.publishedInNewspaper && demand.newspaperImage && setSelectedNewspaper(demand)}
                  >
                    {demand.publishedInNewspaper && demand.newspaperImage ? (
                      <>
                        <img
                          src={demand.newspaperImage}
                          alt={demand.title}
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                        {/* Verified Badge */}
                        <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Newspaper className="w-3 h-3" />
                          Verified
                        </div>
                        {/* Newspaper name overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-white text-xs truncate">{demand.newspaperName}</p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                        <Newspaper className="w-10 h-10 mb-2" />
                        <span className="text-sm">No image available</span>
                      </div>
                    )}
                  </div>

                  {/* Content - Clean and spacious */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                      {demand.title}
                    </h3>

                    {/* Details grid */}
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4 text-amber-500" />
                          <span>{demand.quantity} {demand.gender !== 'Both' ? `· ${demand.gender}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span>{demand.ageRange?.min || 18}-{demand.ageRange?.max || 60} yrs</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="truncate">{demand.location}</span>
                      </div>

                      {demand.salary && (
                        <div className="flex items-center gap-2 text-gray-900 font-semibold">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">{demand.salary}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-red-600 font-medium">
                          Deadline: {new Date(demand.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* View button */}
                    <button
                      onClick={() => setSelectedNewspaper(demand)}
                      className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedNewspaper && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 text-black"
          onClick={() => setSelectedNewspaper(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-900 ">{selectedNewspaper.title}</h3>
                <p className="text-sm text-gray-500 mt-1 font-bold">
                  {selectedNewspaper.newspaperName} · {selectedNewspaper.newspaperDate && new Date(selectedNewspaper.newspaperDate).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedNewspaper(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <div className="flex-1 overflow-auto p-6 bg-gray-100 flex justify-center">
              <img
                src={selectedNewspaper.newspaperImage}
                alt={selectedNewspaper.title}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Footer with all details */}
            <div className="p-5 border-t bg-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-black font-semibold text-xs">QUANTITY</p>
                  <p className="font-semibold">{selectedNewspaper.quantity} {selectedNewspaper.gender !== 'Both' ? `(${selectedNewspaper.gender})` : ''}</p>
                </div>
                <div>
                  <p className="text-black font-semibold text-xs">LOCATION</p>
                  <p className="font-semibold truncate">{selectedNewspaper.location}</p>
                </div>
                {selectedNewspaper.salary && (
                  <div>
                    <p className="text-black font-semibold text-xs">SALARY</p>
                    <p className="font-semibold text-green-600">{selectedNewspaper.salary}</p>
                  </div>
                )}
                <div>
                  <p className="text-black font-semibold text-xs">AGE RANGE</p>
                  <p className="font-semibold">{selectedNewspaper.ageRange?.min || 18}-{selectedNewspaper.ageRange?.max || 60} years</p>
                </div>
                <div className="col-span-2 md:col-span-4">
                  <p className="text-black font-semibold text-xs">DEADLINE</p>
                  <p className="font-semibold text-red-600">{new Date(selectedNewspaper.deadline).toLocaleDateString()}</p>
                </div>
                {selectedNewspaper.requirements && selectedNewspaper.requirements.length > 0 && (
                  <div className="col-span-2 md:col-span-4">
                    <p className="text-black font-semibold text-xs ">REQUIREMENTS</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedNewspaper.requirements.map((req, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-blue-600 font-semibold px-2 py-1 rounded">{req}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}