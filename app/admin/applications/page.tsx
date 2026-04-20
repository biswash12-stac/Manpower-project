// "use client";

// import { useState } from "react";
// import { motion } from "motion/react";
// import {
//   Search,
//   Download,
//   Eye,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { toast } from "sonner";

// export default function AdminApplicationsPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const applications = [
//     {
//       id: 1,
//       name: "Rajesh Kumar",
//       email: "rajesh.k@email.com",
//       phone: "+91 98765 43210",
//       position: "Construction Supervisor",
//       experience: "5-10 years",
//       country: "India",
//       status: "pending",
//       appliedDate: "2024-04-06",
//     },
//     {
//       id: 2,
//       name: "Mohammed Ali",
//       email: "m.ali@email.com",
//       phone: "+20 12 3456 7890",
//       position: "Oil Rig Technician",
//       experience: "3-5 years",
//       country: "Egypt",
//       status: "reviewing",
//       appliedDate: "2024-04-05",
//     },
//     {
//       id: 3,
//       name: "Priya Sharma",
//       email: "priya.s@email.com",
//       phone: "+91 87654 32109",
//       position: "Hotel Manager",
//       experience: "10+ years",
//       country: "India",
//       status: "approved",
//       appliedDate: "2024-04-04",
//     },
//     {
//       id: 4,
//       name: "Ahmed Hassan",
//       email: "ahmed.h@email.com",
//       phone: "+92 300 1234567",
//       position: "Security Supervisor",
//       experience: "5-10 years",
//       country: "Pakistan",
//       status: "rejected",
//       appliedDate: "2024-04-04",
//     },
//     {
//       id: 5,
//       name: "Maria Santos",
//       email: "maria.s@email.com",
//       phone: "+63 917 123 4567",
//       position: "Chef de Cuisine",
//       experience: "10+ years",
//       country: "Philippines",
//       status: "approved",
//       appliedDate: "2024-04-03",
//     },
//     {
//       id: 6,
//       name: "David Wilson",
//       email: "d.wilson@email.com",
//       phone: "+44 20 1234 5678",
//       position: "Electrical Engineer",
//       experience: "5-10 years",
//       country: "UK",
//       status: "pending",
//       appliedDate: "2024-04-03",
//     },
//   ];

//   const filteredApplications = applications.filter((app) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.email.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" || app.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   const handleStatusChange = (id: number, newStatus: string) => {
//     toast.success(`Application status updated to ${newStatus}`);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "approved":
//         return "bg-green-100 text-green-700 hover:bg-green-100";
//       case "pending":
//         return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
//       case "reviewing":
//         return "bg-blue-100 text-blue-700 hover:bg-blue-100";
//       case "rejected":
//         return "bg-red-100 text-red-700 hover:bg-red-100";
//       default:
//         return "bg-gray-100 text-gray-700 hover:bg-gray-100";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-[#0A2463]">
//           Applications
//         </h1>
//         <p className="text-[#64748B]">
//           Review and manage job applications
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid md:grid-cols-4 gap-4">
//         <Card className="p-4 border-0 bg-white">
//           <p className="text-sm text-[#64748B] mb-1">
//             Total Applications
//           </p>
//           <p className="text-2xl font-bold text-black">
//             {applications.length}
//           </p>
//         </Card>

//         <Card className="p-4 border-0 bg-white">
//           <p className="text-sm text-[#64748B] mb-1">
//             Pending Review
//           </p>
//           <p className="text-2xl font-bold text-yellow-600">
//             {applications.filter((a) => a.status === "pending").length}
//           </p>
//         </Card>

//         <Card className="p-4 border-0 bg-white">
//           <p className="text-sm text-[#64748B] mb-1">
//             Approved
//           </p>
//           <p className="text-2xl font-bold text-green-600">
//             {applications.filter((a) => a.status === "approved").length}
//           </p>
//         </Card>

//         <Card className="p-4 border-0 bg-white">
//           <p className="text-sm text-[#64748B] mb-1">
//             Rejected
//           </p>
//           <p className="text-2xl font-bold text-red-600">
//             {applications.filter((a) => a.status === "rejected").length}
//           </p>
//         </Card>
//       </div>

//       {/* Filters */}
//       <Card className="p-4 border-0 bg-white">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
//             <Input
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search applications..."
//               className="pl-10 text-[#0A2463] bg-[#F1F5F9] border-0 focus:bg-white"
//             />
//           </div>

//           <Select
//             value={statusFilter}
//             onValueChange={setStatusFilter}
//           >
//             <SelectTrigger className="w-full md:w-[200px] text-[#0A2463] bg-[#F1F5F9] border-0 focus:bg-white">
//               <SelectValue placeholder="Filter by status" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               <SelectItem value="all" className="text-[#0A2463]">
//                 All Status
//               </SelectItem>
//               <SelectItem value="pending" className="text-[#0A2463]">
//                 Pending
//               </SelectItem>
//               <SelectItem value="reviewing" className="text-[#0A2463]">
//                 Reviewing
//               </SelectItem>
//               <SelectItem value="approved" className="text-[#0A2463]">
//                 Approved
//               </SelectItem>
//               <SelectItem value="rejected" className="text-[#0A2463]">
//                 Rejected
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </Card>

//       {/* Table */}
//       <Card className="border-0 bg-white overflow-hidden">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Candidate</TableHead>
//                 <TableHead>Position</TableHead>
//                 <TableHead>Experience</TableHead>
//                 <TableHead>Country</TableHead>
//                 <TableHead>Applied Date</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {filteredApplications.map((application, index) => (
//                 <motion.tr
//                   key={application.id}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: index * 0.05 }}
//                   className="hover:bg-[#F1F5F9]/50"
//                 >
//                   <TableCell>
//                     <div>
//                       <p className="font-medium text-[#0A2463]">
//                         {application.name}
//                       </p>
//                       <p className="text-sm text-[#64748B]">
//                         {application.email}
//                       </p>
//                       <p className="text-xs text-[#64748B]">
//                         {application.phone}
//                       </p>
//                     </div>
//                   </TableCell>

//                   <TableCell className="text-[#64748B]">{application.position}</TableCell>
//                   <TableCell className="text-[#64748B]">{application.experience}</TableCell>
//                   <TableCell className="text-[#64748B]">{application.country}</TableCell>
//                   <TableCell className="text-[#64748B]">{application.appliedDate}</TableCell>

//                   <TableCell>
//                     <Badge className={getStatusColor(application.status)}>
//                       {application.status}
//                     </Badge>
//                   </TableCell>

//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                       <Button variant="ghost" size="sm" className="text-[#64748B]">
//                         <Eye className="w-4 h-4" />
//                       </Button>

//                       <Button variant="ghost" size="sm" className="text-[#64748B]">
//                         <Download className="w-4 h-4" />
//                       </Button>

//                       {application.status === "pending" && (
//                         <>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() =>
//                               handleStatusChange(application.id, "approved")
//                             }
//                           >
//                             <CheckCircle2 className="w-4 h-4 text-green-600" />
//                           </Button>

//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() =>
//                               handleStatusChange(application.id, "rejected")
//                             }
//                           >
//                             <XCircle className="w-4 h-4 text-red-600" />
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </TableCell>
//                 </motion.tr>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </Card>
//     </div>
//   );
// }



"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

export default function AdminApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [applications, setApplications] = useState<any[]>([]);

  // ✅ Load data
  useEffect(() => {
    const stored = localStorage.getItem("applications");

    if (stored) {
      setApplications(JSON.parse(stored));
    } else {
      const dummy = [
        {
          id: 1,
          name: "Rajesh Kumar",
          email: "rajesh.k@email.com",
          phone: "+91 98765 43210",
          position: "Construction Supervisor",
          experience: "5-10 years",
          country: "India",
          status: "pending",
          appliedDate: "2024-04-06",
        },
        {
          id: 2,
          name: "Mohammed Ali",
          email: "m.ali@email.com",
          phone: "+20 12 3456 7890",
          position: "Oil Rig Technician",
          experience: "3-5 years",
          country: "Egypt",
          status: "reviewing",
          appliedDate: "2024-04-05",
        },
      ];

      setApplications(dummy);
      localStorage.setItem("applications", JSON.stringify(dummy));
    }
  }, []);

  // ✅ Filter
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchTerm === "" ||
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ✅ Accept / Reject
  const handleStatusChange = (id: number, newStatus: string) => {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app
    );

    setApplications(updated);
    localStorage.setItem("applications", JSON.stringify(updated));

    toast.success(`Application ${newStatus}`);
  };

  // ✅ Download
  const handleDownload = (name: string) => {
    const blob = new Blob([`CV of ${name}`], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}-CV.txt`;
    a.click();
  };

  // ✅ Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "reviewing":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "rejected":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2463]">
          Applications
        </h1>
        <p className="text-[#64748B]">
          Review and manage job applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 border-0 bg-white">
          <p className="text-sm text-[#64748B] mb-1">
            Total Applications
          </p>
          <p className="text-2xl font-bold text-black">
            {applications.length}
          </p>
        </Card>

        <Card className="p-4 border-0 bg-white">
          <p className="text-sm text-[#64748B] mb-1">
            Pending Review
          </p>
          <p className="text-2xl font-bold text-yellow-600">
            {applications.filter((a) => a.status === "pending").length}
          </p>
        </Card>

        <Card className="p-4 border-0 bg-white">
          <p className="text-sm text-[#64748B] mb-1">
            Approved
          </p>
          <p className="text-2xl font-bold text-green-600">
            {applications.filter((a) => a.status === "approved").length}
          </p>
        </Card>

        <Card className="p-4 border-0 bg-white">
          <p className="text-sm text-[#64748B] mb-1">
            Rejected
          </p>
          <p className="text-2xl font-bold text-red-600">
            {applications.filter((a) => a.status === "rejected").length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 bg-white">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applications..."
              className="pl-10 text-[#0A2463] bg-[#F1F5F9] border-0 focus:bg-white"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px] text-[#0A2463] bg-[#F1F5F9] border-0 focus:bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-0 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredApplications.map((application, index) => (
                <motion.tr
                  key={application.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#F1F5F9]/50"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-[#0A2463]">
                        {application.name}
                      </p>
                      <p className="text-sm text-[#64748B]">
                        {application.email}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {application.phone}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-[#64748B]">
                    {application.position}
                  </TableCell>

                  <TableCell className="text-[#64748B]">
                    {application.experience}
                  </TableCell>

                  <TableCell className="text-[#64748B]">
                    {application.country}
                  </TableCell>

                  <TableCell className="text-[#64748B]">
                    {application.appliedDate}
                  </TableCell>

                  <TableCell>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">

                      {/* VIEW */}
                      <Link href={`/admin/applications/${application.id}`}>
                        <Button variant="ghost" size="sm"
                         className="text-[#64748B]">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>

                      {/* DOWNLOAD */}
                      <Button
                        variant="ghost"
                        size="sm" className="text-[#64748B]"
                        onClick={() => handleDownload(application.name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>

                      {/* ACCEPT / REJECT */}
                      {application.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(application.id, "approved")
                            }
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(application.id, "rejected")
                            }
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      )}

                    </div>
                  </TableCell>

                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}