"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";

//creating types for adminuser

type AdminUser = {
  email: string;
  name: string;
  role: "superadmin" | "admin";
};

interface AdminContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// creating context here

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// creating provider here
export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Check existing session on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check for stored token
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("adminUser");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAdminUser(user);
        setIsAuthenticated(true);
        
        // Verify token is still valid (optional)
        verifyToken(token);
      } catch (error) {
        console.error("Invalid stored auth data");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("adminUser");
      }
    }
  }, []);

  // Verify token with backend
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/v1/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        // Token invalid
        logout();
      }
    } catch (error) {
      console.error("Token verification failed");
    }
  };

  // login 

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Login failed:", error.message);
        return false;
      }

      const result = await response.json();
      
      // Extract data from response
      const { user, tokens } = result.data;
      
      if (!user || !tokens) {
        return false;
      }

      // Store in localStorage
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem("adminUser", JSON.stringify(user));
      
      // Update state
      setAdminUser(user);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error("Admin login request failed", error);
      return false;
    }
  };

  // logout

  const logout = async () => {
    const token = localStorage.getItem("accessToken");
    
    // Call logout API
    if (token) {
      try {
        await fetch("/api/v1/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Logout API error:", error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminUser");
    
    // Update state
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider
      value={{ isAuthenticated, adminUser, login, logout }}
    >
      {children}
    </AdminContext.Provider>
  );
}
// hook

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }

  return context;
}