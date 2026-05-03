// contexts/AdminContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api } from "@/lib/api";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin";
};

interface AdminContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await api.get("/auth/me");
      if (result && result.success) {
        const userData = result.data || result;
        setAdminUser(userData);
        setIsAuthenticated(true);
      } else {
        // Token might be invalid
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login...");
      const result = await api.post("/auth/login", { email, password });
      console.log("Login response:", result);
      
      // Handle response structure
      if (result && result.success === true) {
        const responseData = result.data;
        
        // Extract tokens and user
        const accessToken = responseData?.tokens?.accessToken;
        const refreshToken = responseData?.tokens?.refreshToken;
        const user = responseData?.user;
        
        if (accessToken && user) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          setAdminUser(user);
          setIsAuthenticated(true);
          return true;
        }
      }
      
      console.error("Invalid login response structure:", result);
      return false;
    } catch (error: any) {
      console.error("Login error details:", error);
      return false;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const result = await api.get("/auth/me");
      if (result && result.success) {
        const userData = result.data || result;
        setAdminUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AdminContext.Provider value={{ 
      isAuthenticated, 
      adminUser, 
      isLoading, 
      login, 
      logout,
      refreshUser
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}