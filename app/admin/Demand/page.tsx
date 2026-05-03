// app/admin/Demand/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAdmin } from "@/contexts/AdminContext";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Calendar,
  MapPin,
  Users,
  DollarSign,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Newspaper
} from "lucide-react";

interface Demand {
  _id: string;
  title: string;
  quantity: number;
  gender: string;
  ageRange: { min: number; max: number };
  salary: string;
  location: string;
  country: string;
  requirements: string[];
  deadline: string;
  status: "active" | "closed" | "draft";
  publishedInNewspaper: boolean;
  newspaperName?: string;
  newspaperDate?: string;
  newspaperImage?: string;
  createdAt: string;
}

export default function AdminDemandsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdmin();
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/admin/login");
    } else {
      fetchDemands();
    }
  }, [isAuthenticated, router]);

  const fetchDemands = async () => {
    try {
      const response = await api.get("/Demand?admin=true&limit=100");
      const demandsData = response.data?.demands || response.data || [];
      setDemands(demandsData);
    } catch (error) {
      console.error("Failed to fetch demands:", error);
      toast.error("Failed to load demands");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDemand) return;
    
    setDeleting(true);
    try {
      await api.delete(`/Demand/${selectedDemand._id}`);
      toast.success("Demand deleted successfully");
      fetchDemands();
      setShowDeleteModal(false);
      setSelectedDemand(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete demand");
    } finally {
      setDeleting(false);
    }
  };


const handleStatusChange = async (demandId: string, newStatus: string) => {
  try {
    // Find the current demand from your local state
    const currentDemand = demands.find(d => d._id === demandId);
    if (!currentDemand) {
      toast.error("Demand not found");
      return;
    }
    
    // Create complete payload with all fields
    const updatePayload = {
      title: currentDemand.title,
      quantity: currentDemand.quantity,
      gender: currentDemand.gender,
      ageRange: currentDemand.ageRange,
      salary: currentDemand.salary,
      location: currentDemand.location,
      country: currentDemand.country,
      requirements: currentDemand.requirements || [],
      deadline: currentDemand.deadline,
      publishedInNewspaper: currentDemand.publishedInNewspaper || false,
      newspaperName: currentDemand.newspaperName || "",
      newspaperDate: currentDemand.newspaperDate || "",
      newspaperImage: currentDemand.newspaperImage || "",
      status: newStatus  // Only the status changes
    };
    
    // Use PUT instead of PATCH (your backend has PUT)
    await api.put(`/Demand/${demandId}`, updatePayload);
    toast.success(`Status updated to ${newStatus}`);
    fetchDemands(); // Refresh the list
    
  } catch (error) {
    console.error("Status update failed:", error);
    toast.error("Failed to update status");
  }
};
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3 text-green-600" /> Active</span>;
      case "closed":
        return <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs font-medium"><XCircle className="w-3 h-3 text-red-600" /> Closed</span>;
      default:
        return <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium"><Clock className="w-3 h-3 text-yellow-600" /> Draft</span>;
    }
  };

  const filteredDemands = demands.filter(demand => {
    const matchesSearch = demand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demand.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demand.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || demand.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A2463]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0A2463]">Manage Demands</h1>
          <p className="text-gray-600 text-sm mt-1">View, edit, and manage all job demands</p>
        </div>
        <Button 
          onClick={() => router.push("/admin/Demand/newDemand")}
          className="bg-[#0A2463] hover:bg-[#0A2463]/80 text-white font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Demand
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-5 bg-white shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search by title, location, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#0A2463] focus:ring-[#0A2463]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </Card>

      {/* Demands Grid */}
      <div className="grid gap-4">
        {filteredDemands.length === 0 ? (
          <Card className="p-12 text-center bg-white border border-gray-200">
            <p className="text-gray-600">No demands found</p>
          </Card>
        ) : (
          filteredDemands.map((demand) => (
            <Card key={demand._id} className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                {/* Demand Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-[#0A2463]">{demand.title}</h3>
                      <p className="text-sm text-gray-500 font-mono mt-1  ">ID: {demand._id.slice(-8)}</p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(demand.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 hover:border hover:border-gray-500 hover:shadow-md md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{demand.quantity} {demand.gender !== 'Both' ? `(${demand.gender})` : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{demand.location}, {demand.country}</span>
                    </div>
                    {demand.salary && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{demand.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Deadline: {new Date(demand.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {demand.publishedInNewspaper && (
                    <div className="mt-4">
                      <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-md inline-flex items-center gap-1 font-medium">
                        <Newspaper className="w-3 h-3" />
                        Newspaper Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 items-start">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/Demand/${demand._id}`)}
                    className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/Demand/${demand._id}`)}
                    className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <select
                    value={demand.status}
                    onChange={(e) => handleStatusChange(demand._id, e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDemand(demand);
                      setShowDeleteModal(true);
                    }}
                    className="border-red-300 text-red-600 bg-white hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDemand && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Confirm Delete</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete <strong className="text-[#0A2463]">{selectedDemand.title}</strong>?
            </p>
            <p className="text-sm text-red-600 mb-6 font-medium">
              ⚠️ This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}