import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { messageAPI } from "@/services/api";
import socketService from "@/services/socket";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Avatar from "@/components/Avatar";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { formatTime } from "@/utils/helpers";

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.teamId) {
      fetchMessages();
      socketService.joinTeam(user.teamId);
      socketService.onMessage(handleNewMessage);
    }

    return () => {
      socketService.offMessage();
    };
  }, [user?.teamId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!user?.teamId) return;

    try {
      const response = await messageAPI.getAll(user.teamId);
      setMessages(response.data?.messages || []);
    } catch (error) {
      toast.error("Failed to fetch messages");
    }
  };

  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.teamId) return;

    try {
      await messageAPI.send(newMessage, user.teamId);
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Team Chat
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Communicate with your team in real-time
        </p>
      </div>

      <Card className="h-[calc(100vh-16rem)]">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-5rem)]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar pr-2">
            {messages.map((message) => {
              const sender =
                typeof message.senderId === "object" ? message.senderId : null;
              const isOwn = user?.id === (sender?.id || message.senderId);

              return (
                <div
                  key={message._id}
                  className={`flex gap-3 ${
                    isOwn ? "flex-row-reverse" : ""
                  } animate-fade-in`}
                >
                  <Avatar name={sender?.name || "User"} size="md" />
                  <div
                    className={`flex flex-col max-w-md ${
                      isOwn ? "items-end" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {sender?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" className="flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
