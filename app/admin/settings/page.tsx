"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAdmin } from "@/contexts/AdminContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { adminUser, logout } = useAdmin();
  
  const [siteName, setSiteName] = useState("Gulf Empire Company");
  const [email, setEmail] = useState(adminUser?.email || "admin@gulfempire.com");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotify, setEmailNotify] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Change Password Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((res) => setTimeout(res, 1000));
    toast.success("Settings saved successfully");
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password too short", {
        description: "New password must be at least 6 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure both passwords are the same.",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (response.success) {
        toast.success("Password changed!", {
          description: "Your password has been updated successfully. Please login again.",
        });
        
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Logout user to require login with new password
        setTimeout(() => {
          logout();
          router.push("/auth/admin/login");
        }, 1500);
      }
    } catch (error: any) {
      toast.error("Failed", {
        description: error.message || "Current password is incorrect.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    toast.info("Logging out...", {
      description: "You will be logged out from all devices.",
    });
    
    setTimeout(() => {
      logout();
      router.push("/auth/admin/login");
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2463]">Settings</h1>
        <p className="text-[#64748B]">Manage your admin preferences and system configuration</p>
      </div>

      {/* GENERAL */}
      <Card className="p-6 space-y-6 border border-[#64748B]/20 shadow-sm rounded-xl bg-white">
        <h2 className="text-lg font-semibold text-[#0A2463]">General Settings</h2>

        <div className="space-y-5">
          <div>
            <Label className="text-[#64748B]">Website Name</Label>
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="mt-2 text-[#64748B] focus:border-[#0A2463] focus:ring-[#0A2463]"
            />
          </div>

          <div>
            <Label className="text-[#64748B]">Admin Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 text-[#64748B] focus:border-[#0A2463] focus:ring-[#0A2463]"
            />
          </div>
        </div>
      </Card>

      {/* PREFERENCES */}
      <Card className="p-6 space-y-6 border border-[#64748B]/20 shadow-sm rounded-xl bg-white">
        <h2 className="text-lg font-semibold text-[#0A2463]">Preferences</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[#0A2463]">Dark Mode</p>
            <p className="text-sm text-[#64748B]">Enable dark theme for admin panel</p>
          </div>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[#0A2463]">Email Notifications</p>
            <p className="text-sm text-[#64748B]">Receive updates via email</p>
          </div>
          <Switch checked={emailNotify} onCheckedChange={setEmailNotify} />
        </div>
      </Card>

      {/* SECURITY */}
      <Card className="p-6 space-y-4 border border-[#64748B]/20 shadow-sm rounded-xl bg-white">
        <h2 className="text-lg font-semibold text-[#0A2463]">Security</h2>

        <Button
          // variant="outline"
          onClick={() => setShowPasswordModal(true)}
          className="w-full border-[#64748B] text-[#0A2463]  bg-[#0a2463]/10"
        >
          <Lock className="w-4 h-4 mr-2" />
          Change Password
        </Button>

        <Button
          onClick={handleLogoutAllDevices}
          className="w-full text-white border-red-200  bg-[#0a2463]"
        >
          Logout All Devices
        </Button>
      </Card>

      {/* SAVE */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0A2463] hover:bg-[#081d4d] text-white px-6"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#0A2463]">Change Password</DialogTitle>
            <DialogDescription className="text-[#64748B]">
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Current Password */}
            <div>
              <Label className="text-[#1A326D] text-sm">Current Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E86B5]" />
                <Input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="pl-9 pr-9 h-11 text-sm text-[#7E86B5]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E86B5] hover:text-[#1A326D]"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <Label className="text-[#1A326D] text-sm">New Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E86B5]" />
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="pl-9 pr-9 h-11 text-sm text-[#7E86B5]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E86B5] hover:text-[#1A326D]"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-[#7E86B5] mt-1">Password must be at least 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <Label className="text-[#1A326D] text-sm">Confirm New Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E86B5]" />
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="pl-9 pr-9 h-11 text-sm text-[#7E86B5]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E86B5] hover:text-[#1A326D]"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => {
                setShowPasswordModal(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="flex-1 bg-[#1A326D] hover:bg-[#0F2557] text-white"
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}