import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { projectAPI, taskAPI } from "@/services/api";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/Card";
import { FolderKanban, CheckSquare, Clock, CheckCircle, LucideIcon } from "lucide-react";

interface Stats {
  totalProjects: number;
  totalTasks: number;
  inProgress: number;
  completed: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalTasks: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    void fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        projectAPI.getAll(user?.teamId as string | undefined),
        taskAPI.getAll(),
      ]);

      const tasks = tasksRes.data?.tasks || [];
      setStats({
        totalProjects: projectsRes.data?.projects?.length || 0,
        totalTasks: tasks.length,
        inProgress: tasks.filter((t) => t.status === "in-progress").length,
        completed: tasks.filter((t) => t.status === "done").length,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number;
    icon: LucideIcon;
    color: string;
  }) => (
    <Card>
      <CardContent className="flex items-center justify-between py-6">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, {user?.name}! ({user?.role})
        </p>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Your Role Permissions:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            {user?.role === "ADMIN" && (
              <>
                <li>✓ Can create, edit, and delete projects</li>
                <li>✓ Can create, edit, and delete tasks</li>
                <li>✓ Can see all messages and chat with everyone</li>
                <li>✓ Can see all tasks (assigned and unassigned)</li>
                <li>✓ Can manage teams</li>
                <li>✗ Cannot assign tasks (only Managers can assign)</li>
              </>
            )}
            {user?.role === "MANAGER" && (
              <>
                <li>✓ Can create and edit projects</li>
                <li>✓ Can create, edit, and assign tasks to team members</li>
                <li>✓ Can see all messages and chat with everyone</li>
                <li>✓ Can see all tasks (assigned and unassigned)</li>
                <li>✓ Can manage team tasks</li>
                <li>✗ Cannot delete projects or tasks</li>
              </>
            )}
            {user?.role === "MEMBER" && (
              <>
                <li>✓ Can view projects</li>
                <li>✓ Can only see tasks assigned to you</li>
                <li>✓ Can update task status (drag & drop)</li>
                <li>✓ Can see all messages and chat with everyone</li>
                <li>✗ Cannot create projects or assign tasks</li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={CheckSquare}
          color="bg-purple-500"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="bg-green-500"
        />
      </div>
    </div>
  );
}

