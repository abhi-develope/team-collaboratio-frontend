import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { taskAPI, projectAPI } from "@/services/api";
import { TASK_STATUS, STATUS_LABELS, STATUS_COLORS } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/Card";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    projectId: "",
    status: TASK_STATUS.TODO,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll(user?.teamId || undefined);
      setProjects(response.data?.projects || []);
      if (response.data?.projects?.length > 0) {
        setSelectedProject(response.data.projects[0]._id);
      }
    } catch (error) {
      toast.error("Failed to fetch projects");
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskAPI.getAll(selectedProject);
      setTasks(response.data?.tasks || []);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    try {
      await taskAPI.update(draggableId, { status: newStatus });
      setTasks(
        tasks.map((task) =>
          task._id === draggableId ? { ...task, status: newStatus } : task
        )
      );
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await taskAPI.create({
        ...newTask,
        projectId: selectedProject,
      });
      setTasks([...tasks, response.data.task]);
      setIsModalOpen(false);
      setNewTask({
        title: "",
        description: "",
        projectId: "",
        status: TASK_STATUS.TODO,
      });
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskAPI.delete(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const projectOptions = projects.map((p) => ({ value: p._id, label: p.name }));
  const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your tasks with Kanban board
          </p>
        </div>
        <div className="flex gap-4">
          {projects.length > 0 && (
            <Select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              options={projectOptions}
              className="w-48"
            />
          )}
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${STATUS_COLORS[status]}`}
                />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {label}
                </h3>
                <Badge variant="default">
                  {getTasksByStatus(status).length}
                </Badge>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[500px] p-4 rounded-lg transition-colors ${
                      snapshot.isDraggingOver
                        ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700"
                        : "bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {getTasksByStatus(status).map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card
                              className={`cursor-move ${
                                snapshot.isDragging
                                  ? "shadow-2xl rotate-2"
                                  : "hover:shadow-md"
                              } transition-all`}
                            >
                              <CardHeader>
                                <div className="flex items-start justify-between gap-2">
                                  <CardTitle className="text-base">
                                    {task.title}
                                  </CardTitle>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                                    onClick={() => handleDeleteTask(task._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              {task.description && (
                                <CardContent className="pt-0">
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {task.description}
                                  </p>
                                </CardContent>
                              )}
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Enter task title"
            required
          />
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              placeholder="Enter task description"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <Select
            label="Status"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            options={statusOptions}
          />
          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </Modal>
    </div>
  );
}
