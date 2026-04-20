"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("Gulf Empire Company");
  const [email, setEmail] = useState("admin@gulfempire.com");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotify, setEmailNotify] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((res) => setTimeout(res, 1000));
    toast.success("Settings saved successfully");
    setSaving(false);
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2463]">
          Settings
        </h1>
        <p className="text-[#64748B]">
          Manage your admin preferences and system configuration
        </p>
      </div>

      {/* GENERAL */}
      <Card className="p-6 space-y-6 border border-[#64748B]/20 shadow-sm rounded-xl bg-white">
        <h2 className="text-lg font-semibold text-[#0A2463]">
          General Settings
        </h2>

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
        <h2 className="text-lg font-semibold text-[#0A2463]">
          Preferences
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[#0A2463]">Dark Mode</p>
            <p className="text-sm text-[#64748B]">
              Enable dark theme for admin panel
            </p>
          </div>

          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[#0A2463]">
              Email Notifications
            </p>
            <p className="text-sm text-[#64748B]">
              Receive updates via email
            </p>
          </div>

          <Switch
            checked={emailNotify}
            onCheckedChange={setEmailNotify}
          />
        </div>
      </Card>

      {/* SECURITY */}
      <Card className="p-6 space-y-4 border border-[#64748B]/20 shadow-sm rounded-xl bg-white">
        <h2 className="text-lg font-semibold text-[#0A2463]">
          Security
        </h2>

        <Button
          variant="outline"
          className="w-full border-[#64748B] text-[#0A2463] hover:bg-[#64748B]/10 bg-white"
        >
          Change Password
        </Button>

        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-amber-50"
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
    </div>
  );
}