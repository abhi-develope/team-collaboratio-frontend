import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
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
import { Role, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const existingToken = localStorage.getItem("token");
          if (existingToken) {
            const response = await authAPI.getMe();
            setUser(response.data.user);
            setToken(existingToken);
            socketService.connect(existingToken);
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

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const response = await authAPI.login(email, password);

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);

      socketService.connect(response.data.token);
      toast.success("Login successful!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: Role) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const response = await authAPI.register(email, password, name, role);

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);

      socketService.connect(response.data.token);
      toast.success("Registration successful!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Logout failed";
      toast.error(message);
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

