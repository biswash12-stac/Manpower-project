"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import { api } from "@/lib/api";
import { CheckCircle } from "lucide-react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Clock, 
  Download, 
  Eye,
  FileText,
  GraduationCap,
  Building2,
  QrCode
} from "lucide-react";

interface Application {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  position: string;
  experience: number;
  isFresher: boolean;
  skills: string[];
  coverLetter: string;
  status: string;
  appliedAt: string;
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
  };
  education: Array<{
    qualification: string;
    institution: string;
    year: string;
  }>;
  employment: Array<{
    company: string;
    position: string;
    years: string;
  }>;
  documents?: {
    photoUrl?: string;
    passportUrl?: string;
    certificateUrls?: string[];
    cvUrl?: string;
  };
  qrCodeUrl?: string;
  reviewedBy?: {
    name: string;
    email: string;
  };
  reviewNotes?: string;
  reviewedAt?: string;
}

export default function ViewApplication() {
  const params = useParams();
  const { isAuthenticated } = useAdmin();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplication();
    }
  }, [isAuthenticated, params.id]);

  const fetchApplication = async () => {
    try {
      const result = await api.get(`/applications/${params.id}`);
      if (result.success) {
        setApplication(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch application:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      await api.patch(`/applications/${params.id}/status`, { status: newStatus });
      await fetchApplication();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">⏳ Pending</Badge>;
      case "reviewing":
        return <Badge className="bg-blue-100 text-blue-700">🔍 Reviewing</Badge>;
      case "shortlisted":
        return <Badge className="bg-green-100 text-green-700">⭐ Shortlisted</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">❌ Rejected</Badge>;
      case "hired":
        return <Badge className="bg-purple-100 text-purple-700">🎉 Hired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A2463]"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-[#64748B]">Application not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2463]">Application Details</h1>
          <p className="text-[#64748B] text-sm mt-1">Submitted on {new Date(application.appliedAt).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <select
            value={application.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updating}
            className="border rounded-lg px-3 py-2 text-sm bg-emerald-500"
          >
            <option value="pending" className="bg-yellow-400 text-yellow-700">⏳ Pending</option>
            <option value="reviewing" className="bg-blue-100 text-blue-700">🔍 Reviewing</option>
            <option value="shortlisted" className="bg-green-100 text-green-700">⭐ Shortlisted</option>
            <option value="rejected" className="bg-red-100 text-red-700">❌ Rejected</option>
            <option value="hired" className="bg-purple-100 text-purple-700">🎉 Hired</option>
          </select>
        </div>
      </div>

      {/* QR Code Section */}
      {application.qrCodeUrl && (
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center gap-4">
            <img src={application.qrCodeUrl} alt="QR Code" className="w-20 h-20" />
            <div>
              <h3 className="font-semibold text-[#0A2463] flex items-center gap-2">
                <QrCode className="w-4 h-4" /> Application QR Code
              </h3>
              <p className="text-sm text-[#64748B]">Scan to view application summary</p>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content - 2 Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Information */}
         <Card className="p-5 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
    <User className="w-5 h-5 text-[#D4AF37]" />
    <h2 className="text-lg font-semibold text-[#0A2463]">Personal Information</h2>
  </div>
  <div className="space-y-4">
    <div>
      <p className="text-xs font-medium text-[#64748B] mb-1">FULL NAME</p>
      <p className="text-sm text-gray-800 font-medium">{application.firstName} {application.lastName}</p>
    </div>
    <div>
      <p className="text-xs font-medium text-[#64748B] mb-1">EMAIL</p>
      <p className="text-sm text-gray-800 flex items-center gap-2">
        <Mail className="w-4 h-4 text-[#64748B]" /> 
        {application.email}
      </p>
    </div>
    <div>
      <p className="text-xs font-medium text-[#64748B] mb-1">PHONE</p>
      <p className="text-sm text-gray-800 flex items-center gap-2">
        <Phone className="w-4 h-4 text-[#64748B]" /> 
        {application.phone}
      </p>
    </div>
    <div>
      <p className="text-xs font-medium text-[#64748B] mb-1">LOCATION</p>
      <p className="text-sm text-gray-800 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#64748B]" /> 
        {application.city}, {application.country}
      </p>
    </div>
  </div>
</Card>

          {/* Professional Information */}
      <Card className="p-5 bg-gray-50 border border-gray-200 shadow-sm">
  <h2 className="text-lg font-bold text-[#0A2463] mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
    <Briefcase className="w-5 h-5 text-[#D4AF37]" /> 
    Professional Information
  </h2>
  <div className="space-y-4">
    <div className="bg-white p-3 rounded-lg border border-gray-100">
      <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1">Applying For</p>
      <p className="font-medium text-gray-800">
        {application.position} 
        <span className="text-gray-500"> at </span>
        <span className="text-[#0A2463]">{application.jobId?.company || "Unknown"}</span>
      </p>
    </div>
    
    <div className="bg-white p-3 rounded-lg border border-gray-100 ">
      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2 ">Candidate Type</p>
      <p className="font-medium">
        {application.isFresher ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-100 rounded-full text-green-700 text-sm font-medium">
            🎓 Fresher
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-100 rounded-full text-blue-700 text-sm font-medium">
            💼 Experienced ({application.experience} years)
          </span>
        )}
      </p>
    </div>
    
    <div className="bg-white p-3 rounded-lg border border-gray-100">
      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">Skills</p>
      {application.skills && application.skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {application.skills.map((skill: string, i: number) => (
            <span 
              key={i} 
              className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">No skills specified</p>
      )}
    </div>
  </div>
</Card>

          {/* Cover Letter */}
          <Card className="p-5 bg-gray-50 border border-gray-200 shadow-sm">
  <h2 className="text-lg font-bold text-[#0A2463] mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
    <FileText className="w-5 h-5 text-[#D4AF37]" /> 
    Cover Letter
  </h2>
  <div className="bg-white p-4 rounded-lg border border-gray-100">
    <div className="flex items-start gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0"></div>
      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
        {application.coverLetter || (
          <span className="text-gray-400 italic">No cover letter provided</span>
        )}
      </p>
    </div>
  </div>
</Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Education */}
          <Card className="p-5 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
      <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
      <h2 className="text-lg font-semibold text-[#0A2463]">Education</h2>
    </div>
    {application.education && application.education.length > 0 ? (
      <div className="space-y-3">
        {application.education.map((edu: { qualification: string; institution: string; year: string }, i: number) => (
          <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800">{edu.qualification}</p>
                <p className="text-sm text-gray-500">{edu.institution}</p>
                <p className="text-xs text-gray-400">Year: {edu.year}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <p className="text-sm text-gray-400 italic">No education details provided</p>
      </div>
    )}
  </Card>

          {/* Employment History */}
        
 <Card className="p-5 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
      <Building2 className="w-5 h-5 text-[#D4AF37]" />
      <h2 className="text-lg font-semibold text-[#0A2463]">Employment History</h2>
    </div>
    {application.isFresher ? (
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-green-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Fresher - No employment history
        </p>
      </div>
    ) : application.employment && application.employment.length > 0 ? (
      <div className="space-y-3">
        {application.employment.map((job: { company: string; position: string; years: string }, i: number) => (
          <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800">{job.position}</p>
                <p className="text-sm text-gray-500">{job.company}</p>
                <p className="text-xs text-gray-400">Duration: {job.years} years</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <p className="text-sm text-gray-400 italic">No employment history provided</p>
      </div>
    )}
  </Card>
          {/* Uploaded Documents */}
    
           <Card className="p-5 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
      <Download className="w-5 h-5 text-[#D4AF37]" />
      <h2 className="text-lg font-semibold text-[#0A2463]">Uploaded Documents</h2>
    </div>
    <div className="space-y-4">
      {application.documents?.photoUrl && (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p className="text-xs font-medium text-[#64748B] mb-2">PASSPORT PHOTO</p>
          <img 
            src={application.documents.photoUrl} 
            alt="Passport" 
            className="w-24 h-24 object-cover rounded-lg border border-gray-200" 
          />
        </div>
      )}
      {application.documents?.passportUrl && (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p className="text-xs font-medium text-[#64748B] mb-2">PASSPORT COPY</p>
          <a 
            href={application.documents.passportUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#0A2463] text-sm hover:text-[#D4AF37] hover:underline transition-colors inline-flex items-center gap-1"
          >
            View Passport → 
          </a>
        </div>
      )}
      {application.documents?.certificateUrls && application.documents.certificateUrls.length > 0 && (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p className="text-xs font-medium text-[#64748B] mb-2">CERTIFICATES ({application.documents.certificateUrls.length})</p>
          <div className="space-y-1">
            {application.documents.certificateUrls.map((url: string, i: number) => (
              <a 
                key={i} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-[#0A2463] text-sm hover:text-[#D4AF37] hover:underline transition-colors"
              >
                Certificate {i + 1} →
              </a>
            ))}
          </div>
        </div>
      )}
      {application.documents?.cvUrl && (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p className="text-xs font-medium text-[#64748B] mb-2">CV / RESUME</p>
          <a 
            href={application.documents.cvUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#0A2463] text-sm hover:text-[#D4AF37] hover:underline transition-colors inline-flex items-center gap-1"
          >
            Download CV →
          </a>
        </div>
      )}
      {!application.documents?.photoUrl && 
       !application.documents?.passportUrl && 
       (!application.documents?.certificateUrls || application.documents.certificateUrls.length === 0) && 
       !application.documents?.cvUrl && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-400 italic text-center">No documents uploaded</p>
        </div>
      )}
    </div>
  </Card>
        </div>
      </div>

      {/* Status History (if reviewed) */}
      {application.reviewedBy && (
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-[#64748B]" />
            <span className="text-[#64748B]">
              Reviewed by {application.reviewedBy.name} on {new Date(application.reviewedAt!).toLocaleString()}
            </span>
            {application.reviewNotes && (
              <span className="text-[#64748B]">• Note: {application.reviewNotes}</span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}