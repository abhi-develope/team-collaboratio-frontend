import { useState, useRef, useEffect, FormEvent } from "react";
import { taskAPI } from "@/services/api";
import { Task } from "@/types";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Bot, Send, Loader2, X, Minimize2, Maximize2 } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  data?: {
    task?: Task;
    tasks?: Task[];
  };
}

interface TaskAssistantProps {
  projectId?: string;
  onTaskUpdate?: () => void;
}

export default function TaskAssistant({ projectId, onTaskUpdate }: TaskAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const getWelcomeMessage = () => {
    return projectId
      ? "Hello! I'm your task assistant. I can help you create, update, assign, and manage tasks using natural language. Try saying 'help' to see what I can do!"
      : "Hello! I'm your task assistant. Please select a project first to start managing tasks. Once a project is selected, I can help you create, update, assign, and manage tasks using natural language. Try saying 'help' to see what I can do!";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: getWelcomeMessage(),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!projectId) {
      const errorMsg: Message = {
        role: "assistant",
        content: "Please select a project first before using the assistant.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      toast.error("Please select a project first");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await taskAPI.assistant(input.trim(), projectId);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.message || "Task operation completed successfully.",
        timestamp: new Date(),
        data: response.data.task
          ? { task: response.data.task }
          : response.data.tasks
          ? { tasks: response.data.tasks }
          : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Show toast notification
      toast.success(response.data.message || "Task operation completed successfully.");
      
      // Refresh tasks if callback provided
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process command";
      
      const errorMsg: Message = {
        role: "assistant",
        content: `Error: ${errorMessage}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content: getWelcomeMessage(),
        timestamp: new Date(),
      },
    ]);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-lg h-14 w-14 p-0 bg-blue-600 hover:bg-blue-700 text-white"
          size="icon"
          title="Task Assistant - Click to open"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isMinimized ? "w-80" : "w-96"
      }`}
    >
      <Card className="shadow-2xl border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-lg">Task Assistant</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.data?.task && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-semibold mb-1">Task Details:</p>
                          <p className="text-xs">
                            <strong>Title:</strong> {message.data.task.title}
                          </p>
                          {message.data.task.description && (
                            <p className="text-xs">
                              <strong>Description:</strong> {message.data.task.description}
                            </p>
                          )}
                          <p className="text-xs">
                            <strong>Status:</strong> {message.data.task.status}
                          </p>
                          {typeof message.data.task.assignedTo === "object" &&
                            message.data.task.assignedTo && (
                              <p className="text-xs">
                                <strong>Assigned to:</strong>{" "}
                                {message.data.task.assignedTo.name}
                              </p>
                            )}
                        </div>
                      )}
                      {message.data?.tasks && message.data.tasks.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-semibold mb-1">
                            Tasks ({message.data.tasks.length}):
                          </p>
                          <ul className="text-xs space-y-1">
                            {message.data.tasks.slice(0, 5).map((task, idx) => (
                              <li key={idx}>
                                • {task.title} ({task.status})
                              </li>
                            ))}
                            {message.data.tasks.length > 5 && (
                              <li className="text-gray-500">
                                ... and {message.data.tasks.length - 5} more
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                {!projectId && (
                  <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      ⚠️ Please select a project first to use the assistant.
                    </p>
                  </div>
                )}
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      projectId
                        ? "Type your command... (e.g., 'Create a task to fix the login bug')"
                        : "Select a project first..."
                    }
                    className="flex-1"
                    disabled={isLoading || !projectId}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim() || !projectId}
                    size="icon"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="mt-2 text-xs"
                >
                  Clear Chat
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

