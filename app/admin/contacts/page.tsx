// app/admin/contacts/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useAdmin } from "@/contexts/AdminContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, Eye, X, ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAdmin();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [openingContact, setOpeningContact] = useState<string | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated]);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showReplyModal) {
          setShowReplyModal(false);
          setReplyMessage("");
        } else if (selectedContact) {
          handleCloseDetails();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [selectedContact, showReplyModal]);

  // Click outside DETAILS panel closes it (but NOT the modal)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if clicking on modal
      if (modalRef.current && modalRef.current.contains(e.target as Node)) {
        return;
      }
      
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node) && selectedContact) {
        const target = e.target as HTMLElement;
        if (!target.closest(".contact-card") && !target.closest(".eye-button")) {
          handleCloseDetails();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedContact]);

  const fetchContacts = async () => {
    try {
      const result = await api.get("/contacts?limit=100");
      if (result.success) {
        setContacts(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, currentStatus: string) => {
    if (currentStatus !== "new") return;
    
    try {
      await api.patch(`/contacts/${id}/status`, { status: "read" });
      await fetchContacts();
      if (selectedContact?._id === id) {
        setSelectedContact({ ...selectedContact, status: "read" });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleOpenDetails = async (contact: Contact) => {
    setOpeningContact(contact._id);
    setSelectedContact(contact);
    if (contact.status === "new") {
      await markAsRead(contact._id, contact.status);
    }
    setOpeningContact(null);
  };

  const handleCloseDetails = () => {
    setSelectedContact(null);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      setNotification({ type: 'error', message: 'Please enter a reply message' });
      return;
    }

    setIsSending(true);
    
    try {
      const response = await fetch("/api/send-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedContact!.email,
          name: selectedContact!.name,
          replyMessage: replyMessage,
        }),
      });

      if (response.ok) {
        // Update contact status to "replied"
        await api.patch(`/contacts/${selectedContact!._id}/status`, { status: "replied" });
        
        setNotification({ type: 'success', message: `✅ Reply sent successfully to ${selectedContact!.email}` });
        setShowReplyModal(false);
        setReplyMessage("");
        fetchContacts();
        
        // Close details panel after 1 second (so admin sees the success notification)
        setTimeout(() => {
          handleCloseDetails();
        }, 1000);
      } else {
        const error = await response.json();
        setNotification({ type: 'error', message: error.error || 'Failed to send reply' });
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
      setNotification({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-red-100 text-red-700 animate-pulse">🔴 New</Badge>;
      case "read":
        return <Badge className="bg-green-100 text-green-700">✅ Read</Badge>;
      case "replied":
        return <Badge className="bg-blue-100 text-blue-700">📧 Replied</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="text-center py-10 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#0A2463]" />
        <span>Loading messages...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-[#F1F5F9] min-h-screen relative">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 animate-slide-in-right ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[300px]`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <h1 className="text-2xl font-bold text-[#0A2463] mb-6">Contact Messages</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className={`space-y-4 ${selectedContact ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {contacts.length === 0 ? (
            <Card className="p-12 text-center bg-white">
              <p className="text-[#64748B]">No contact messages received yet</p>
            </Card>
          ) : (
            contacts.map((contact) => (
              <Card 
                key={contact._id} 
                className={`contact-card p-4 bg-white hover:shadow-md transition-all cursor-pointer ${
                  selectedContact?._id === contact._id ? 'ring-2 ring-[#0A2463]' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-[#0A2463]">{contact.name}</h3>
                      {getStatusBadge(contact.status)}
                    </div>
                    <p className="text-sm text-[#64748B] mb-1">
                      <Mail className="w-4 h-4 inline mr-1" /> {contact.email}
                    </p>
                    <p className="text-sm text-[#64748B] mb-2">
                      <Phone className="w-4 h-4 inline mr-1" /> {contact.phone || "Not provided"}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(contact.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleOpenDetails(contact)}
                    disabled={openingContact === contact._id}
                    className="eye-button rounded"
                  >
                    {openingContact === contact._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Contact Detail View */}
        {selectedContact && (
          <div className="lg:col-span-1">
            <Card 
              ref={detailsRef} 
              className="p-5 bg-white sticky top-20 rounded-2xl shadow-sm border animate-slide-in-right"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleCloseDetails}
                    className="lg:hidden p-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-lg font-semibold text-black">Message Details</h2>
                </div>
                <div className="flex gap-2 items-center">
                  {getStatusBadge(selectedContact.status)}
                  <div 
                    onClick={handleCloseDetails}
                    className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-black mb-1">Subject</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{selectedContact.subject}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-black mb-1">Message</p>
                  <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-black mb-2">Contact Info</p>
                  <div className="space-y-1 text-sm text-slate-500">
                    <p className="break-all">📧 {selectedContact.email}</p>
                    {selectedContact.phone && <p>📞 {selectedContact.phone}</p>}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-slate-400">
                    Received: {new Date(selectedContact.createdAt).toLocaleString()}
                  </p>
                </div>

                <Button
                  className="w-full bg-[#0A2463] hover:bg-[#0A2463]/90 text-white"
                  onClick={() => setShowReplyModal(true)}
                  disabled={selectedContact.status === 'replied'}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {selectedContact.status === 'replied' ? 'Already Replied' : 'Reply via Email'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Mobile Back Button */}
      {selectedContact && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <Button 
            onClick={handleCloseDetails}
            className="w-full bg-[#0A2463] text-white shadow-lg"
          >
            ← Back to Messages
          </Button>
        </div>
      )}

      {/* Reply Modal - Click outside DOES NOT close */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="max-w-md w-full"
          >
            <Card className="p-6 bg-white rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-[#0A2463]">
                Reply to {selectedContact?.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4 break-all">
                Sending to: {selectedContact?.email}
              </p>
              
              <textarea
                className="w-full border rounded-lg p-3 text-slate-600 mb-4 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-[#0A2463] resize-none"
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                autoFocus
              />
              
              <div className="flex gap-3">
                <button
                  onClick={handleSendReply}
                  disabled={isSending}
                  className="flex-1 bg-[#0A2463] text-white py-2 rounded-lg hover:bg-[#0A2463]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Send Reply'
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyMessage("");
                  }}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-red-500 bg-emerald-500 transition"
                >
                  Cancel
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}