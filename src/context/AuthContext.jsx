import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { authAPI } from "@/services/api";
import socketService from "@/services/socket";
import toast from "react-hot-toast";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const response = await authAPI.getMe();
            setUser(response.data.user);
            setToken(token);
            socketService.connect(token);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(null);
          localStorage.removeItem("token");
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
        socketService.disconnect();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const response = await authAPI.login(email, password);

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);

      socketService.connect(response.data.token);
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const register = async (email, password, name, role) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const response = await authAPI.register(email, password, name, role);

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);

      socketService.connect(response.data.token);
      toast.success("Registration successful!");
    } catch (error) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      socketService.disconnect();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message || "Logout failed");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, token, setUser }}
    >
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
