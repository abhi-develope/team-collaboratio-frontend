import Card, { CardHeader, CardTitle, CardContent } from "@/components/Card";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import { useAuth } from "@/context/AuthContext";
import { Users } from "lucide-react";

export default function Team() {
  const { user } = useAuth();

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "ADMIN":
        return "danger";
      case "MANAGER":
        return "warning";
      default:
        return "primary";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Team
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View your team members and their roles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user ? (
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar name={user.name} size="lg" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No team members found
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
