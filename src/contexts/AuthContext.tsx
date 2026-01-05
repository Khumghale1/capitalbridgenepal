import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type UserType = "business" | "admin" | "investor" | null;

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  businessId?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType;
  user: User | null;
  isLoading: boolean;
  login: (type: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUserType = localStorage.getItem("userType") as UserType;
    const storedUser = localStorage.getItem("user");

    if (storedAuth === "true" && storedUserType) {
      setIsAuthenticated(true);
      setUserType(storedUserType);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse user data from localStorage", error);
        }
      }
    }

    // Mark loading as complete
    setIsLoading(false);
  }, []);

  const login = (type: UserType) => {
    setIsAuthenticated(true);
    setUserType(type);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userType", type || "");

    // Load user data from localStorage if it exists
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}