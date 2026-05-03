// app/admin/Demand/[id]/page.tsx - COMPLETE FIXED VERSION

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAdmin } from "@/contexts/AdminContext";
import { Loader2, Edit2, Save, X, ArrowLeft, Calendar, MapPin, Users, DollarSign, Newspaper, Eye } from "lucide-react";

export default function DemandDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated } = useAdmin();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showNewspaper, setShowNewspaper] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/admin/login");
        } else {
            fetchDemand();
        }
    }, [isAuthenticated, router]);

    const fetchDemand = async () => {
        try {
            const response = await api.get(`/Demand/${params.id}`);
            const demand = response.data || response;
            setFormData({
                title: demand.title || "",
                quantity: demand.quantity || 1,
                gender: demand.gender || "Both",
                ageMin: demand.ageRange?.min || 18,
                ageMax: demand.ageRange?.max || 50,
                salary: demand.salary || "",
                location: demand.location || "",
                country: demand.country || "Nepal",
                requirements: demand.requirements?.join(", ") || "",
                deadline: demand.deadline?.split("T")[0] || "",
                publishedInNewspaper: demand.publishedInNewspaper || false,
                newspaperName: demand.newspaperName || "",
                newspaperDate: demand.newspaperDate?.split("T")[0] || "",
                newspaperImage: demand.newspaperImage || "",
                status: demand.status || "active",
                _id: demand._id,
                createdAt: demand.createdAt,
                updatedAt: demand.updatedAt,
            });
        } catch (error) {
            console.error("Failed to fetch demand:", error);
            toast.error("Failed to load demand");
            router.push("/admin/Demand");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const requirementsArray = formData.requirements
                .split(",")
                .map((s: string) => s.trim())
                .filter((s: string) => s !== "");

            const payload = {
                title: formData.title,
                quantity: Number(formData.quantity),
                category: "general",
                gender: formData.gender,
                ageRange: { min: Number(formData.ageMin), max: Number(formData.ageMax) },
                salary: formData.salary,
                location: formData.location,
                country: formData.country,
                requirements: requirementsArray,
                deadline: formData.deadline,
                publishedInNewspaper: formData.publishedInNewspaper,
                newspaperName: formData.publishedInNewspaper ? formData.newspaperName : "",
                newspaperDate: formData.publishedInNewspaper ? formData.newspaperDate : "",
                newspaperImage: formData.publishedInNewspaper ? formData.newspaperImage : "",
                status: formData.status,
            };

            await api.put(`/Demand/${params.id}`, payload);
            toast.success("Demand updated successfully!");
            setIsEditing(false);
            fetchDemand();
        } catch (error: any) {
            console.error("Update failed:", error);
            toast.error(error?.message || "Failed to update demand");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#0A2463]" />
            </div>
        );
    }

    if (!formData) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6 ">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button className="bg-[#0A2463] hover:bg-[#0A2463]/80 text-white rounded" onClick={() => router.push("/admin/Demand")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        {isEditing ? (
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="text-2xl font-bold text-gray-900 border-gray-300"
                            />
                        ) : (
                            <h1 className="text-2xl font-bold text-gray-900">{formData.title}</h1>
                        )}
                        {!isEditing && <p className="text-sm text-gray-500 mt-1">ID: {formData._id}</p>}
                    </div>
                </div>

                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="bg-[#0A2463] hover:bg-[#0A2463]/80 text-white rounded">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-[#0A2463] text-white">
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
                {!isEditing ? (
                    <>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${formData.status === "active" ? "bg-green-100 text-green-800" :
                                formData.status === "closed" ? "bg-red-100 text-red-800" :
                                    "bg-yellow-100 text-yellow-800"
                            }`}>
                            {formData.status.toUpperCase()}
                        </span>
                        {formData.publishedInNewspaper && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                📰 Newspaper Verified
                            </span>
                        )}
                    </>
                ) : (
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-900 bg-white"
                    >
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="draft">Draft</option>
                    </select>
                )}
            </div>

            {/* Job Details Card */}
            <Card className="p-6 bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>

                {!isEditing ? (
                    // VIEW MODE - Dark text for contrast
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        <div className="space-y-1 ">
                            <p className="text-sm text-gray-500">Quantity</p>
                            <p className="text-base font-medium text-gray-900">{formData.quantity} {formData.gender !== 'Both' ? `(${formData.gender})` : ''}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Salary</p>
                            <p className="text-base font-medium text-gray-900">{formData.salary || "Negotiable"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="text-base font-medium text-gray-900">{formData.location}, {formData.country}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Age Range</p>
                            <p className="text-base font-medium text-gray-900">{formData.ageMin} - {formData.ageMax} years</p>
                        </div>
                    </div>
                ) : (
                    // EDIT MODE
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-700 font-medium">Quantity</Label>
                                <Input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    className="bg-white border-gray-300 text-gray-900 mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-700 font-medium">Salary</Label>
                                <Input
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900 mt-1"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-700 font-medium">Gender</Label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 mt-1"
                                >
                                    <option>Both</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <div>
                                <Label className="text-gray-700 font-medium">Country</Label>
                                <Input
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900 mt-1"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-700 font-medium">Age Min</Label>
                                <Input
                                    type="number"
                                    value={formData.ageMin}
                                    onChange={(e) => setFormData({ ...formData, ageMin: parseInt(e.target.value) })}
                                    className="bg-white border-gray-300 text-gray-900 mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-700 font-medium">Age Max</Label>
                                <Input
                                    type="number"
                                    value={formData.ageMax}
                                    onChange={(e) => setFormData({ ...formData, ageMax: parseInt(e.target.value) })}
                                    className="bg-white border-gray-300 text-gray-900 mt-1"
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-gray-700 font-medium">Location</Label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="bg-white border-gray-300 text-gray-900 mt-1"
                            />
                        </div>
                    </div>
                )}
            </Card>

            {/* Requirements Card */}
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
                {!isEditing ? (
                    <ul className="list-disc list-inside space-y-1">
                        {formData.requirements?.split(",").map((req: string, idx: number) => (
                            <li key={idx} className="text-gray-800">{req.trim()}</li>
                        ))}
                    </ul>
                ) : (
                    <Textarea
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        placeholder="Separate requirements with commas"
                        className="min-h-[100px] bg-white border-gray-300 text-gray-900"
                    />
                )}
            </Card>

            {/* Deadline Card */}
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Deadline</h2>
                {!isEditing ? (
                    <p className="text-base font-medium text-gray-900">{new Date(formData.deadline).toLocaleDateString()}</p>
                ) : (
                    <Input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="bg-white border-gray-300 text-gray-900"
                    />
                )}
            </Card>

            {/* Newspaper Section */}
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-gray-700" />
                    Newspaper Publication
                </h2>

                {!isEditing ? (
                    <>
                        {formData.publishedInNewspaper ? (
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Newspaper Name</p>
                                    <p className="text-base font-medium text-gray-900">{formData.newspaperName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Publication Date</p>
                                    <p className="text-base font-medium text-gray-900">{new Date(formData.newspaperDate).toLocaleDateString()}</p>
                                </div>
                                {formData.newspaperImage && (
                                    <Button onClick={() => setShowNewspaper(true)}  className="mt-2 cursor-pointer text-white bg-blue-600 rounded shadow-blue-600 hover:shadow-lg">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Newspaper Image
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">Not published in newspaper</p>
                        )}
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.publishedInNewspaper}
                                onChange={(e) => setFormData({ ...formData, publishedInNewspaper: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label className="text-gray-700">This demand has been published in newspaper</label>
                        </div>

                        {formData.publishedInNewspaper && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-700 font-medium">Newspaper Name</Label>
                                    <Input
                                        value={formData.newspaperName}
                                        onChange={(e) => setFormData({ ...formData, newspaperName: e.target.value })}
                                        className="bg-white border-gray-300 text-gray-900 mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-gray-700 font-medium">Publication Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.newspaperDate}
                                        onChange={(e) => setFormData({ ...formData, newspaperDate: e.target.value })}
                                        className="bg-white border-gray-300 text-gray-900 mt-1"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* System Info Card */}
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
                <div className="space-y-2">
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="text-base text-gray-900">{new Date(formData.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="text-base text-gray-900">{new Date(formData.updatedAt).toLocaleString()}</p>
                    </div>
                </div>
            </Card>

            {/* Newspaper Modal */}
            {showNewspaper && formData.newspaperImage && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Newspaper Advertisement</h3>
                            <button onClick={() => setShowNewspaper(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-4">
                            <img src={formData.newspaperImage} alt="Newspaper ad" className="w-full h-auto" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}