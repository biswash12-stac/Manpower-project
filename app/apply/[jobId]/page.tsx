"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Upload, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import QRCode from "qrcode";

interface EducationItem {
  qualification: string;
  institution: string;
  year: string;
}

interface EmploymentItem {
  company: string;
  position: string;
  years: string;
}

export default function ApplyPage() {
  const params = useParams();
  const jobId = params?.jobId;

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form Data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    position: "",
    experience: "",
    skills: "",
    coverLetter: "",
    isFresher: false,
  });

  // Dynamic Arrays
  const [education, setEducation] = useState<EducationItem[]>([
    { qualification: "", institution: "", year: "" },
  ]);

  const [employment, setEmployment] = useState<EmploymentItem[]>([
    { company: "", position: "", years: "" },
  ]);

  // File States
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [passportName, setPassportName] = useState("");
  const [certificateNames, setCertificateNames] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [passportUrl, setPassportUrl] = useState<string | null>(null);
  const [certificateUrls, setCertificateUrls] = useState<string[]>([]);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  // QR Code State
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // Error States
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (step === 6 && !qrCodeUrl && formData.firstName) {
      generateQRCode();
    }
  }, [step, formData]);

  const generateQRCode = async () => {
    try {
      const qrData = JSON.stringify({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        appliedFor: jobId,
        appliedAt: new Date().toISOString(),
      });
      const qr = await QRCode.toDataURL(qrData);
      setQrCodeUrl(qr);
    } catch (error) {
      console.error("QR Code generation failed:", error);
    }
  };

  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else {
          const emailRegex = /^\S+@\S+\.\S+$/;
          if (!emailRegex.test(formData.email))
            newErrors.email = "Please enter a valid email address";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.country.trim()) newErrors.country = "Country is required";
        break;

      case 2:
        if (!formData.position.trim()) newErrors.position = "Position is required";
        if (!formData.isFresher && !formData.experience.trim()) {
          newErrors.experience = "Years of experience is required";
        }
        if (!formData.coverLetter.trim())
          newErrors.coverLetter = "Cover letter is required";
        break;

      case 3:
        if (!photoName) newErrors.photo = "Passport size photo is required";
        if (!passportName) newErrors.passport = "Passport copy is required";
        if (certificateNames.length === 0)
          newErrors.certificates = "At least one certificate is required";
        break;

      case 4:
        // ✅ FIXED: Requires at least ONE COMPLETE education entry (all 3 fields filled)
        const hasAtLeastOneComplete = education.some(
          (edu) =>
            edu.qualification.trim() !== "" &&
            edu.institution.trim() !== "" &&
            edu.year.trim() !== ""
        );

        if (!hasAtLeastOneComplete) {
          newErrors.education = "Please fill at least one COMPLETE education entry (Qualification, Institution, and Year are all required)";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearFieldError(e.target.name);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoName(file.name);
    clearFieldError("photo");

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('type', 'photo');

    try {
      const response = await fetch('/api/v1/uploads', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();
      if (result.success) {
        console.log('Photo uploaded:', result.url);
        setPhotoUrl(result.url);
        toast.success("Photo uploaded successfully");
      }
    } catch (error) {
      console.error('Photo upload failed:', error);
      toast.error("Failed to upload photo");
      setPhotoName("");
    }
  };

  const handlePassportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPassportName(file.name);
    clearFieldError("passport");

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('type', 'passport');

    try {
      const response = await fetch('/api/v1/uploads', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log('Passport uploaded:', result.url);
        setPassportUrl(result.url);
        toast.success("Passport uploaded successfully");
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error('Passport upload failed:', error);
      toast.error("Failed to upload passport. Please try again.");
      setPassportName("");
    }
  };

  const handleCertificatesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setCertificateNames(files.map(f => f.name));
    clearFieldError("certificates");

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', 'certificates');

      try {
        const response = await fetch('/api/v1/uploads', {
          method: 'POST',
          body: uploadFormData,
        });
        const result = await response.json();
        if (result.success) {
          uploadedUrls.push(result.url);
        }
      } catch (error) {
        console.error('Upload failed for file:', file.name);
      }
    }

    setCertificateUrls(uploadedUrls);
    console.log('Certificates uploaded:', uploadedUrls);
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('type', 'cv');

    try {
      const response = await fetch('/api/v1/uploads', {
        method: 'POST',
        body: uploadFormData,
      });
      const result = await response.json();
      if (result.success) {
        setCvUrl(result.url);
        toast.success("CV uploaded successfully");
      } else {
        toast.error("Failed to upload CV");
      }
    } catch (error) {
      console.error('CV upload failed:', error);
      toast.error("Failed to upload CV");
    }
  };

  const handleSubmit = async () => {
    console.log("=== HANDLE SUBMIT CALLED ===");
    console.log("Raw education state:", education);

    if (!jobId) {
      toast.error("Invalid job. Please try again.");
      return;
    }

    // ✅ FIXED: Filter using OR - keep any education entry that has at least one field filled
    const filteredEducation = education.filter(
      (edu) =>
        edu.qualification.trim() !== "" ||
        edu.institution.trim() !== "" ||
        edu.year.trim() !== ""
    );

    // ✅ FIXED: Add proper type annotation for filteredEmployment
    let filteredEmployment: EmploymentItem[] = [];
    if (!formData.isFresher) {
      filteredEmployment = employment.filter(
        (job) => job.company.trim() !== "" || job.position.trim() !== "" || job.years.trim() !== ""
      );
    }

    console.log("Filtered education:", filteredEducation);
    console.log("Filtered employment:", filteredEmployment);

    // Validate at least one education entry exists
    if (filteredEducation.length === 0) {
      toast.error("Please add your education details", {
        description: "Fill in at least one education entry",
      });
      return;
    }

    const applicationData = {
      jobId: jobId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      city: formData.city || "",
      position: formData.position,
      experience: formData.isFresher ? 0 : (parseInt(formData.experience) || 0),
      skills: formData.skills ? formData.skills.split(",").map(s => s.trim()).filter(s => s !== "") : [],
      coverLetter: formData.coverLetter,
      isFresher: formData.isFresher,
      education: filteredEducation,
      employment: filteredEmployment,
      documents: {
        photoUrl: photoUrl,
        passportUrl: passportUrl,
        certificateUrls: certificateUrls,
        cvUrl: cvUrl,
      },
    };

    console.log("Submitting application data:", applicationData);

    try {
      const response = await fetch("/api/v1/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Application Submitted!", {
          description: "We'll review your application shortly.",
          duration: 4000,
        });
        setTimeout(() => {
          window.location.href = "/jobs";
        }, 2000);
      } else {
        console.error("Server error:", result);
        toast.error(result.message || "Failed to submit application", {
          description: result.error || "Please try again or contact support",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong", {
        description: "Network error. Please check your connection and try again.",
      });
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, totalSteps));
    } else {
      toast.error("Please fill all required fields", {
        description: "Check the highlighted fields and try again.",
        duration: 3000,
      });
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const addEducation = () => {
    setEducation([
      ...education,
      { qualification: "", institution: "", year: "" },
    ]);
  };

  const updateEducation = (
    index: number,
    field: keyof EducationItem,
    value: string
  ) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
    if (errors.education) clearFieldError("education");
  };

  const addEmployment = () => {
    setEmployment([
      ...employment,
      { company: "", position: "", years: "" },
    ]);
  };

  const updateEmployment = (
    index: number,
    field: keyof EmploymentItem,
    value: string
  ) => {
    const updated = [...employment];
    updated[index][field] = value;
    setEmployment(updated);
  };

  return (
    <div className="pt-20">
      <Toaster position="top-right" richColors />

      <section className="bg-gradient-to-br from-[#1C346F] to-[#1C346F]/90 text-white py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          Apply for Job
        </h1>
        <p className="text-white/80 mt-2">
          Fill out the form below to submit your application
        </p>
      </section>

      <section className="py-10 px-4 bg-[#F5F5F5] min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
              {/* STEP 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#19316C] mb-4">
                    Personal Info
                  </h2>
                  <div className="grid md:grid-cols-1 gap-4">
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`text-black placeholder:text-gray-400 ${errors.firstName ? "border-red-500" : ""
                        }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs">{errors.firstName}</p>
                    )}
                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`text-black placeholder:text-gray-400 ${errors.lastName ? "border-red-500" : ""
                        }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs">{errors.lastName}</p>
                    )}
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`text-black placeholder:text-gray-400 ${errors.email ? "border-red-500" : ""
                        }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                    <Input
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`text-black placeholder:text-gray-400 ${errors.phone ? "border-red-500" : ""
                        }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs">{errors.phone}</p>
                    )}
                    <Input
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`text-black placeholder:text-gray-400 ${errors.country ? "border-red-500" : ""
                        }`}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-xs">{errors.country}</p>
                    )}
                    <Input
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Professional Info */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#19316C] mb-4">
                    Professional Info
                  </h2>

                  <div className="flex gap-4 p-3 bg-blue-50 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.isFresher === true}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            isFresher: true,
                            experience: "",
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-black">🎓 Fresher</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.isFresher === false}
                        onChange={() =>
                          setFormData({ ...formData, isFresher: false })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-black">💼 Experienced</span>
                    </label>
                  </div>

                  <Input
                    name="position"
                    placeholder="Position"
                    value={formData.position}
                    onChange={handleChange}
                    className={`text-black placeholder:text-gray-400 ${errors.position ? "border-red-500" : ""
                      }`}
                  />
                  {errors.position && (
                    <p className="text-red-500 text-xs">{errors.position}</p>
                  )}

                  {formData.isFresher === false && (
                    <>
                      <Input
                        name="experience"
                        type="number"
                        placeholder="Experience (years)"
                        value={formData.experience}
                        onChange={handleChange}
                        className={`text-black placeholder:text-gray-400 ${errors.experience ? "border-red-500" : ""
                          }`}
                      />
                      {errors.experience && (
                        <p className="text-red-500 text-xs">{errors.experience}</p>
                      )}
                    </>
                  )}

                  {formData.isFresher === true && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-700 text-sm">
                        ✓ Fresher selected - Experience field not required
                      </p>
                    </div>
                  )}

                  <Textarea
                    name="skills"
                    placeholder="Skills (comma separated)"
                    value={formData.skills}
                    onChange={handleChange}
                    rows={3}
                    className="text-black placeholder:text-gray-400"
                  />
                  <Textarea
                    name="coverLetter"
                    placeholder="Cover Letter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    rows={5}
                    className={`text-black placeholder:text-gray-400 ${errors.coverLetter ? "border-red-500" : ""
                      }`}
                  />
                  {errors.coverLetter && (
                    <p className="text-red-500 text-xs">{errors.coverLetter}</p>
                  )}
                </div>
              )}

              {/* STEP 3: Documents */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#19316C] mb-4">
                    Upload Documents
                  </h2>
                  <p className="text-gray-500">
                    Please upload required documents
                  </p>

                  <div>
                    <Label className="text-gray-700 font-medium">
                      Passport Size Photo *
                    </Label>
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 mt-2 transition">
                      {photoName ? (
                        <div className="text-center">
                          {photoPreview && (
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded-full mx-auto mb-2"
                            />
                          )}
                          <p className="text-sm font-semibold text-gray-800">
                            {photoName}
                          </p>
                          <p className="text-xs text-gray-400">
                            Click to change
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Upload Photo</p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        required
                      />
                    </label>
                    {errors.photo && (
                      <p className="text-red-500 text-xs">{errors.photo}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium">
                      Passport *
                    </Label>
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 mt-2 transition">
                      {passportName ? (
                        <div className="text-center">
                          <FileText className="w-10 h-10 text-[#19316C] mx-auto mb-2" />
                          <p className="text-sm font-semibold text-gray-800">
                            {passportName}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Upload Passport</p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        onChange={handlePassportUpload}
                        required
                      />
                    </label>
                    {errors.passport && (
                      <p className="text-red-500 text-xs">{errors.passport}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium">
                      Certificates *
                    </Label>
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 mt-2 transition">
                      {certificateNames.length > 0 ? (
                        <div className="text-center">
                          <FileText className="w-10 h-10 text-[#19316C] mx-auto mb-2" />
                          <p className="text-sm font-semibold text-gray-800">
                            {certificateNames.length} file(s) selected
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            Upload Certificates
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleCertificatesUpload}
                        required
                      />
                    </label>
                    {errors.certificates && (
                      <p className="text-red-500 text-xs">{errors.certificates}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium">
                      CV (Optional)
                    </Label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 mt-2 transition">
                      {cvUrl ? (
                        <div className="text-center">
                          <FileText className="w-8 h-8 text-[#19316C] mx-auto mb-1" />
                          <p className="text-sm text-gray-700">CV uploaded ✓</p>
                          <p className="text-xs text-gray-400">Click to change</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <p className="text-sm text-gray-500">Upload CV (PDF/DOC)</p>
                          <p className="text-xs text-gray-400">Max 5MB</p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCvUpload}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 4: Education */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#19316C] mb-4">
                    Education Details
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    Please add your educational qualifications
                  </p>
                  {errors.education && (
                    <p className="text-red-500 text-sm">{errors.education}</p>
                  )}
                  {education.map((edu, index) => (
                    <div
                      key={index}
                      className="space-y-3 p-4 bg-gray-50 rounded-lg mb-4 border border-gray-200"
                    >
                      <Input
                        placeholder="Qualification * (e.g., Bachelor's in Computer Science)"
                        value={edu.qualification}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "qualification",
                            e.target.value
                          )
                        }
                        className="text-black placeholder:text-gray-400"
                      />
                      <Input
                        placeholder="Institution * (e.g., Kathmandu University)"
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "institution",
                            e.target.value
                          )
                        }
                        className="text-black placeholder:text-gray-400"
                      />
                      <Input
                        placeholder="Year * (e.g., 2020)"
                        value={edu.year}
                        onChange={(e) =>
                          updateEducation(index, "year", e.target.value)
                        }
                        className="text-black placeholder:text-gray-400"
                      />
                    </div>
                  ))}
                  <Button
                    onClick={addEducation}
                    className="w-full bg-[#193cb8] text-white font-bold"
                  >
                    + Add More Education
                  </Button>
                </div>
              )}

              {/* STEP 5: Employment */}
              {step === 5 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#19316C] mb-4">
                    Employment History
                  </h2>

                  {formData.isFresher === true ? (
                    <div className="text-center py-8 bg-green-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-green-700 font-medium">You selected "Fresher"</p>
                      <p className="text-sm text-green-600 mt-1">No employment history needed. Click Next to continue.</p>
                    </div>
                  ) : (
                    <>
                      {employment.map((job, index) => (
                        <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                          <Input
                            placeholder="Company Name"
                            value={job.company}
                            onChange={(e) => updateEmployment(index, "company", e.target.value)}
                            className="text-black placeholder:text-gray-400"
                          />
                          <Input
                            placeholder="Position / Role"
                            value={job.position}
                            onChange={(e) => updateEmployment(index, "position", e.target.value)}
                            className="text-black placeholder:text-gray-400"
                          />
                          <Input
                            placeholder="Years Worked (e.g., 2 years)"
                            value={job.years}
                            onChange={(e) => updateEmployment(index, "years", e.target.value)}
                            className="text-black placeholder:text-gray-400"
                          />
                        </div>
                      ))}
                      <Button onClick={addEmployment} className="w-full bg-[#193cb8] text-white font-bold rounded">
                        + Add More Employment
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* STEP 6: Preview */}
              {step === 6 && (
                <div id="pdf-content" className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-700">
                      📋 Please review your information before submitting
                    </p>
                  </div>

                  {/* QR at LEFT, Photo at RIGHT */}
                  <div className="flex justify-between items-start">
                    <div>
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="QR Code"
                          className="w-24 h-24 border rounded"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                          <QrCode className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      <p className="text-xs text-gray-400 text-center mt-1">
                        Scan QR
                      </p>
                    </div>

                    <div className="w-24 h-28 border flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Passport"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                          <p className="text-xs text-gray-400 mt-1">Photo</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#1E3A8A] text-white px-3 py-2 font-semibold rounded text-center">
                    Application For Employment
                  </div>

                  <div className="border p-3 text-center text-gray-600">
                    I Wish To Apply For The Post Of:{" "}
                    <span className="font-bold underline text-gray-900">
                      {formData.position || "________"}
                    </span>
                  </div>

                  <h3 className="font-semibold text-red-600">
                    Personal Details:
                  </h3>
                  <div className="border rounded overflow-hidden">
                    <div className="grid grid-cols-2 border-b">
                      <div className="p-2 border-r font-medium text-slate-600">Name:</div>
                      <div className="p-2 text-black">
                        {formData.firstName} {formData.lastName}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b">
                      <div className="p-2 border-r font-medium text-slate-600">Contact:</div>
                      <div className="p-2 text-black">{formData.phone}</div>
                    </div>
                    <div className="grid grid-cols-2 border-b">
                      <div className="p-2 border-r font-medium text-slate-600">Email:</div>
                      <div className="p-2 text-black">{formData.email}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="p-2 border-r font-medium text-slate-600">Location:</div>
                      <div className="p-2 text-black">
                        {formData.city}, {formData.country}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-red-600">Skills:</h3>
                  <div className="border p-3 rounded text-black">
                    {formData.skills || "Not specified"}
                  </div>

                  <h3 className="font-semibold text-red-600">
                    Education Details:
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border p-2 text-slate-600">Qualification</th>
                          <th className="border p-2 text-slate-600">Institution</th>
                          <th className="border p-2 text-slate-600">Year</th>
                        </tr>
                      </thead>
                      {/* ✅ FIXED: Preview table shows only non-empty education entries */}
                      <tbody>
                        {education
                          .filter(
                            (edu) =>
                              edu.qualification.trim() ||
                              edu.institution.trim() ||
                              edu.year.trim()
                          )
                          .map((edu, i) => (
                            <tr key={i}>
                              <td className="border p-2 text-black">
                                {edu.qualification || "-"}
                              </td>
                              <td className="border p-2 text-black">
                                {edu.institution || "-"}
                              </td>
                              <td className="border p-2 text-black">
                                {edu.year || "-"}
                              </td>
                            </tr>
                          ))}
                        {education.filter(edu => edu.qualification || edu.institution || edu.year).length === 0 && (
                          <tr>
                            <td colSpan={3} className="border p-4 text-center text-gray-500">
                              No education details provided
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {formData.isFresher === false && (
                    <>
                      <h3 className="font-semibold text-red-600">
                        Employment History:
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="border p-2">Company</th>
                              <th className="border p-2">Position</th>
                              <th className="border p-2">Years</th>
                            </tr>
                          </thead>
                          <tbody>
                            {employment
                              .filter(
                                (job) =>
                                  job.company.trim() ||
                                  job.position.trim() ||
                                  job.years.trim()
                              )
                              .map((job, i) => (
                                <tr key={i}>
                                  <td className="border p-2 text-black">
                                    {job.company || "-"}
                                  </td>
                                  <td className="border p-2 text-black">
                                    {job.position || "-"}
                                  </td>
                                  <td className="border p-2 text-black">
                                    {job.years || "-"}
                                  </td>
                                </tr>
                              ))}
                            {employment.filter(job => job.company || job.position || job.years).length === 0 && (
                              <tr>
                                <td colSpan={3} className="border p-4 text-center text-gray-500">
                                  No employment history provided
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  <h3 className="font-semibold text-red-600">Cover Letter:</h3>
                  <div className="border p-3 rounded min-h-[100px] text-black">
                    {formData.coverLetter || "Not provided"}
                  </div>

                  <div className="text-xs border p-2 text-gray-500 mt-4">
                    I certify that the information provided is true and correct.
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Signature: __________</span>
                    <span>
                      Date: {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-[#CAAD37] hover:bg-[#CAAD37]/90 text-white"
                  >
                    Submit Application
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  onClick={prevStep}
                  disabled={step === 1}
                  className="rounded bg-[#193cb8] text-white font-bold"
                >
                  Previous
                </Button>
                {step < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    className="rounded bg-red-600 text-white"
                  >
                    {step === 5 ? "Preview" : "Next"}
                  </Button>
                ) : null}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}