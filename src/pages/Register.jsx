import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/utils/constants";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/Card";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.MEMBER,
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: ROLES.MEMBER, label: "Member" },
    { value: ROLES.MANAGER, label: "Manager" },
    { value: ROLES.ADMIN, label: "Admin" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.role
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">TC</span>
            </div>
          </div>
          <CardTitle>Create an Account</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Enter your information to get started
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <Select
              label="Role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              options={roleOptions}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
