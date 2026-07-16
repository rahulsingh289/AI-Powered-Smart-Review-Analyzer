import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      const errMsg = data.error || "Login failed";
      const details = data.details || null;
      const err = new Error(errMsg);
      err.status = response.status;
      err.details = details;
      throw err;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    // Synced Settings Name for Dashboard layout consistency
    localStorage.setItem("settings_name", data.user.name);
    
    setToken(data.token);
    setUser(data.user);
    
    // Dispatch event to update profile sidebar in same tab
    window.dispatchEvent(new Event("profileUpdated"));
    
    return data;
  };

  const register = async (name, email, password) => {
    const response = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      const errMsg = data.error || "Registration failed";
      const details = data.details || null;
      const err = new Error(errMsg);
      err.status = response.status;
      err.details = details;
      throw err;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("settings_name", data.user.name);

    setToken(data.token);
    setUser(data.user);
    
    window.dispatchEvent(new Event("profileUpdated"));

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  const loginWithOAuthToken = (oauthToken, oauthUser) => {
    localStorage.setItem("token", oauthToken);
    localStorage.setItem("user", JSON.stringify(oauthUser));
    localStorage.setItem("settings_name", oauthUser.name);
    
    setToken(oauthToken);
    setUser(oauthUser);
    
    window.dispatchEvent(new Event("profileUpdated"));
    navigate("/dashboard");
  };

  // Authenticated fetch wrapper
  const apiFetch = async (endpoint, options = {}) => {
    const activeToken = token || localStorage.getItem("token");
    
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (activeToken) {
      headers["Authorization"] = `Bearer ${activeToken}`;
    }

    const response = await fetch(`http://localhost:5001${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      logout();
      throw new Error("Session expired. Please log in again.");
    }

    return response;
  };

  const updateUserProfile = (updatedUser, newToken = null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("settings_name", updatedUser.name);
    setUser(updatedUser);
    window.dispatchEvent(new Event("profileUpdated"));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    loginWithOAuthToken,
    apiFetch,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
