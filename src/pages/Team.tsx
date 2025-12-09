import { FormEvent, useEffect, useState } from "react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/Card";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { teamAPI } from "@/services/api";
import socketService from "@/services/socket";
import { Users, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Team as TeamType, User } from "@/types";

const resolveId = (value: string | { _id?: string; id?: string } | undefined | null) =>
  typeof value === "object" ? value?._id || value?.id || "" : value || "";

export default function Team() {
  const { user, setUser } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [team, setTeam] = useState<TeamType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeam, setNewTeam] = useState<Pick<TeamType, "name" | "description">>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (user?.teamId) {
      void fetchTeamData();
    } else {
      setLoading(false);
    }
  }, [user?.teamId]);

  const fetchTeamData = async () => {
    try {
      const response = await teamAPI.getMyTeam();
      setTeam(response.data.team);
      setMembers(response.data.members || []);
    } catch (error) {
      toast.error("Failed to fetch team data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await teamAPI.create(newTeam);
      setTeam(response.data.team);
      setMembers(user ? [user] : []);

      try {
        const { authAPI } = await import("@/services/api");
        const userResponse = await authAPI.getMe();
        setUser(userResponse.data.user);
        if (userResponse.data.user.teamId) {
          socketService.joinTeam(resolveId(userResponse.data.user.teamId));
        }
      } catch (err) {
        console.error("Failed to refresh user data:", err);
      }
      setIsModalOpen(false);
      setNewTeam({ name: "", description: "" });
      toast.success("Team created successfully!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create team";
      toast.error(message);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "danger" as const;
      case "MANAGER":
        return "warning" as const;
      default:
        return "primary" as const;
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
            Team
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View your team members and their roles
          </p>
        </div>
        {!user?.teamId && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        )}
      </div>

      {team ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
              {team.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {team.description}
                </p>
              )}
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Members ({members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={resolveId(member._id || member.id || "")}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar name={member.name} size="lg" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You are not part of a team yet. Create one to get started!
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Team"
      >
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <Input
            label="Team Name"
            value={newTeam.name}
            onChange={(e) =>
              setNewTeam({ ...newTeam, name: e.target.value })
            }
            placeholder="Enter team name"
            required
          />
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={newTeam.description}
              onChange={(e) =>
                setNewTeam({ ...newTeam, description: e.target.value })
              }
              placeholder="Enter team description"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Team
          </Button>
        </form>
      </Modal>
    </div>
  );
}

