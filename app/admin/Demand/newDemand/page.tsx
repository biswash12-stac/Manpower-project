"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAdmin } from "@/contexts/AdminContext";
import { Upload, X } from "lucide-react";

export default function NewDemandPage() {
    const router = useRouter();
    const { isAuthenticated } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        quantity: 1,
        gender: "Both",
        ageMin: 18,
        ageMax: 50,
        salary: "",
        location: "",
        country: "Nepal",
        requirements: "",
        deadline: "",
        publishedInNewspaper: false,
        newspaperName: "",
        newspaperDate: "",
        newspaperImage: "",
        newspaperImageFile: null as File | null,
        newspaperImagePreview: "",
        status: "active",
    });

    if (!isAuthenticated) {
        router.push("/auth/admin/login");
        return null;
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setUploadingImage(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, newspaperImagePreview: reader.result as string }));
        };
        reader.readAsDataURL(file);

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('type', 'newspaper');

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('/api/v1/uploads', {
                method: 'POST',
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: uploadFormData,
            });
            const result = await response.json();

            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    newspaperImage: result.url,
                    newspaperImageFile: file
                }));
                toast.success("Newspaper image uploaded");
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            newspaperImage: "",
            newspaperImageFile: null,
            newspaperImagePreview: "",
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.title.trim()) {
            toast.error("Please enter a job title");
            return;
        }

        if (!formData.deadline) {
            toast.error("Please select a deadline");
            return;
        }

        if (formData.publishedInNewspaper) {
            if (!formData.newspaperName.trim()) {
                toast.error("Please enter the newspaper name");
                return;
            }
            if (!formData.newspaperDate) {
                toast.error("Please select the publication date");
                return;
            }
            if (!formData.newspaperImage) {
                toast.error("Please upload a clear photo of the newspaper ad for legal records");
                return;
            }
        }

        setLoading(true);

        try {
            let requirementsArray: string[] = [];
            if (formData.requirements.trim()) {
                requirementsArray = formData.requirements
                    .split(",")
                    .map(s => s.trim())
                    .filter(s => s !== "");
            }

            const payload = {
                title: formData.title,
                quantity: Number(formData.quantity),
                category: "general",
                gender: formData.gender,
                ageRange: {
                    min: Number(formData.ageMin),
                    max: Number(formData.ageMax)
                },
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

            console.log("Sending payload:", JSON.stringify(payload, null, 2));

            const response = await api.post("/Demand", payload);

            toast.success("Demand added successfully!");
            router.push("/admin/Demand");
        } catch (error: any) {
            console.error("Demand Creation Error:", error);

            if (error?.message === 'Session expired') {
                toast.error("Your session has expired. Please login again.");
                router.push("/auth/admin/login");
            } else {
                const errorMessage = error?.message || "Failed to add demand";
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0A2463]">Add New Job Demand</h1>
                <p className="text-[#64748B] text-sm">For foreign employment opportunities</p>
            </div>

            <Card className="p-4 sm:p-6 bg-white">
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="font-semibold text-[#0A2463] text-base sm:text-lg mb-4">Job Details</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-[#1A326D] text-sm sm:text-base">Job Title *</Label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Worker, Waiter, Driver, Cleaner, Security Guard, Electrician"
                                    className="text-slate-800 placeholder:text-gray-400 mt-1.5 h-10 sm:h-11"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Enter any job title (e.g., Worker, Waiter, Driver, Helper, Cleaner)
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div>
                                    <Label className="text-[#1A326D] text-sm sm:text-base">Quantity</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                        className="text-slate-800 mt-1.5 h-10 sm:h-11"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[#1A326D] text-sm sm:text-base">Salary</Label>
                                    <Input
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                        placeholder="e.g., AED 1500 - 2000"
                                        className="text-slate-800 placeholder:text-gray-400 mt-1.5 h-10 sm:h-11"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div>
                                    <Label className="text-[#1A326D] text-sm sm:text-base">Gender</Label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1.5 h-10 sm:h-11 text-slate-800"
                                    >
                                        <option>Both</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-[#1A326D] text-sm sm:text-base">Country</Label>
                                    <Input
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        placeholder="e.g., UAE, Qatar, Saudi Arabia, Kuwait"
                                        className="text-slate-800 placeholder:text-gray-400 mt-1.5 h-10 sm:h-11"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div>
                                    <Label className="text-[#1A326D] text-sm sm:text-base">Age Range (Min)</Label>
                                    <Input
                                        type="number"
                                        min="18"
                                        max="65"
                                        value={formData.ageMin}
                                        onChange={(e) => setFormData({ ...formData, ageMin: parseInt(e.target.value) })}
                                        className="text-slate-800 mt-1.5 h-10 sm:h-11"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[#1A326D] text-sm sm:text-base">Age Range (Max)</Label>
                                    <Input
                                        type="number"
                                        min="18"
                                        max="65"
                                        value={formData.ageMax}
                                        onChange={(e) => setFormData({ ...formData, ageMax: parseInt(e.target.value) })}
                                        className="text-slate-800 mt-1.5 h-10 sm:h-11"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-[#1A326D] text-sm sm:text-base">Location (City)</Label>
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., Dubai, Abu Dhabi, Doha"
                                    className="text-slate-800 placeholder:text-gray-400 mt-1.5 h-10 sm:h-11"
                                />
                            </div>

                            <div>
                                <Label className="text-[#1A326D] text-sm sm:text-base">Requirements (comma-separated)</Label>
                                <Textarea
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    placeholder="e.g., Experience preferred, Basic English, Physically fit"
                                    className="text-slate-800 placeholder:text-gray-400 mt-1.5 min-h-[100px]"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Separate multiple requirements with commas
                                </p>
                            </div>

                            <div>
                                <Label className="text-[#1A326D] text-sm sm:text-base">Application Deadline *</Label>
                                <Input
                                    required
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="text-slate-800 mt-1.5 h-10 sm:h-11"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Newspaper Publication Details */}
                    <div className="border-t border-gray-200 pt-5 sm:pt-6">
                        <h3 className="font-semibold text-[#0A2463] text-base sm:text-lg mb-4">Newspaper Publication Details</h3>

                        <div className="flex items-center gap-3 mb-5">
                            <input
                                type="checkbox"
                                id="publishedInNewspaper"
                                checked={formData.publishedInNewspaper}
                                onChange={(e) => setFormData({ ...formData, publishedInNewspaper: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-[#0A2463] focus:ring-[#0A2463]"
                            />
                            <label htmlFor="publishedInNewspaper" className="text-[#1A326D] text-sm sm:text-base cursor-pointer">
                                This demand has been published in newspaper
                            </label>
                        </div>

                        {formData.publishedInNewspaper && (
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <Label className="text-[#1A326D] text-sm sm:text-base">Newspaper Name *</Label>
                                        <Input
                                            required
                                            value={formData.newspaperName}
                                            onChange={(e) => setFormData({ ...formData, newspaperName: e.target.value })}
                                            placeholder="e.g., The Himalayan Times, Gorkhapatra"
                                            className="text-slate-800 placeholder:text-gray-400 mt-1.5 h-10 sm:h-11"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-[#1A326D] text-sm sm:text-base">Publication Date *</Label>
                                        <Input
                                            required
                                            type="date"
                                            value={formData.newspaperDate}
                                            onChange={(e) => setFormData({ ...formData, newspaperDate: e.target.value })}
                                            className="text-slate-800 mt-1.5 h-10 sm:h-11"
                                        />
                                    </div>
                                </div>

                                {/* Newspaper Image Upload */}
                                <div>
                                    <Label className="text-[#1A326D] text-sm sm:text-base">Newspaper Image *</Label>
                                    <div className="mt-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />

                                        {formData.newspaperImagePreview ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={formData.newspaperImagePreview}
                                                    alt="Newspaper"
                                                    className="w-48 h-48 object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploadingImage}
                                                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-[#0A2463] transition-colors"
                                            >
                                                {uploadingImage ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0A2463]"></div>
                                                        <span className="text-sm text-gray-500">Uploading...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-8 h-8 text-gray-400" />
                                                        <span className="text-sm text-gray-500">Click to upload newspaper image</span>
                                                        <span className="text-xs text-gray-400">JPG, PNG (max 5MB)</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Upload a clear photo of the newspaper ad for legal records
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-5">
                        <Button
                            type="submit"
                            disabled={loading || uploadingImage}
                            className="bg-[#0A2463] hover:bg-[#0A2463]/90 w-full sm:w-auto"
                        >
                            {loading ? "Creating..." : "Create Demand"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/Demand")}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}