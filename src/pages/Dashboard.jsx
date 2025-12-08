import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { projectAPI, taskAPI } from "@/services/api";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/Card";
import { FolderKanban, CheckSquare, Clock, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        projectAPI.getAll(user?.teamId || undefined),
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

  const StatCard = ({ title, value, icon: Icon, color }) => (
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
          Welcome back, {user?.name}!
        </p>
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
