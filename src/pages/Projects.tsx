import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { projectAPI } from "@/services/api";
import { ROLES } from "@/utils/constants";
import Button from "@/components/Button";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/Card";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import { FolderKanban, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/helpers";
import { Project } from "@/types";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState<Pick<Project, "name" | "description">>({
    name: "",
    description: "",
  });

  const canManageProjects =
    user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER;

  const resolvedTeamId =
    typeof user?.teamId === "object"
      ? user?.teamId?._id || (user?.teamId as { id?: string })?.id
      : user?.teamId;

  useEffect(() => {
    void fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectAPI.getAll(resolvedTeamId);
      setProjects(response.data?.projects || []);
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resolvedTeamId) {
      toast.error(
        "You must be part of a team to create projects. Please create a team first."
      );
      setIsModalOpen(false);
      return;
    }

    try {
      const response = await projectAPI.create({
        ...newProject,
        teamId: resolvedTeamId,
      });
      setProjects([...projects, response.data.project]);
      setIsModalOpen(false);
      setNewProject({ name: "", description: "" });
      toast.success("Project created successfully");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create project";
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await projectAPI.delete(id);
      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your team projects
          </p>
        </div>
        {canManageProjects && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {project.createdAt ? `Created ${formatDate(project.createdAt)}` : ""}
                  </p>
                </div>
                {user?.role === ROLES.ADMIN && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => project._id && handleDelete(project._id)}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            {project.description && (
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <FolderKanban className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No projects yet. Create your first project!
          </p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            placeholder="Enter project name"
            required
          />
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              placeholder="Enter project description"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Project
          </Button>
        </form>
      </Modal>
    </div>
  );
}

