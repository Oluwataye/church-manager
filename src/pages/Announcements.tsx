import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
}

export default function Announcements() {
  const [announcements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Special Prayer Meeting",
      content: "Join us for a special prayer meeting this Friday at 6 PM.",
      date: "2024-03-22",
      priority: "high",
    },
    {
      id: "2",
      title: "Church Cleaning",
      content: "Volunteers needed for church cleaning this Saturday morning.",
      date: "2024-03-23",
      priority: "medium",
    },
  ]);

  const { toast } = useToast();

  const getPriorityColor = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-green-100 text-green-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-church-600">Announcements</h1>
        <Button onClick={() => toast({ title: "Coming soon!", description: "Announcement creation will be available soon." })}>
          Add Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-church-100 p-2 rounded-lg">
                <Bell className="w-6 h-6 text-church-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-xl">{announcement.title}</h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                      announcement.priority
                    )}`}
                  >
                    {announcement.priority}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{announcement.content}</p>
                <p className="mt-4 text-sm text-gray-500">
                  {new Date(announcement.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}