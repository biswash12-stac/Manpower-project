"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, Eye, Trash2 } from "lucide-react";

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
import { toast } from "sonner";

export default function AdminContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const contacts = [
    {
      id: 1,
      name: "Al-Khaleej Construction",
      email: "hr@alkhaleej.com",
      phone: "+965 1234 5678",
      subject: "Hiring Request",
      message: "We need 50 construction workers for a new project...",
      status: "new",
      date: "2024-04-06",
    },
    {
      id: 2,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 555 123 4567",
      subject: "Job Inquiry",
      message: "I am interested in working as a hotel manager...",
      status: "replied",
      date: "2024-04-05",
    },
    {
      id: 3,
      name: "Arabian Oil Services",
      email: "contact@arabianoil.com",
      phone: "+966 11 234 5678",
      subject: "Partnership Opportunity",
      message: "We would like to discuss a strategic partnership...",
      status: "new",
      date: "2024-04-05",
    },
    {
      id: 4,
      name: "Sarah Ahmed",
      email: "sarah@email.com",
      phone: "+971 50 123 4567",
      subject: "Services Inquiry",
      message: "Need visa processing support...",
      status: "replied",
      date: "2024-04-04",
    },
  ];

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (name: string) => {
    toast.success(`Deleted contact from ${name}`);
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "new":
        return "bg-[#0A2463] text-white";
      case "replied":
        return "bg-[#64748B] text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2463]">
          Contact Messages
        </h1>
        <p className="text-[#64748B]">
          Manage inquiries and customer messages
        </p>
      </div>

      {/* SEARCH */}
      <Card className="p-4 border-0 bg-white shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
            className="pl-10 text-[#0A2463] bg-[#F1F5F9] border-0 focus:bg-white"
          />
        </div>
      </Card>

      {/* TABLE */}
      <Card className="border-0 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="bg-[#64748B]/10">
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-[#64748B]/10"
                >
                  <TableCell className="font-medium text-[#0A2463]">
                    {c.name}
                  </TableCell>

                  <TableCell>
                    <div className="text-sm text-[#64748B]">
                      <p>{c.email}</p>
                      <p>{c.phone}</p>
                    </div>
                  </TableCell>

                  <TableCell className="text-[#64748B]">{c.subject}</TableCell>

                  <TableCell>
                    <p className="text-sm text-[#64748B] truncate max-w-[200px]">
                      {c.message}
                    </p>
                  </TableCell>

                  <TableCell className="text-[#64748B]">{c.date}</TableCell>

                  <TableCell>
                    <Badge className={getStatus(c.status)}>
                      {c.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 text-[#0A2463]" />
                      </Button>

                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4 text-[#64748B]" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(c.name)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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