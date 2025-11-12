
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnnouncementDialog } from "@/components/Announcements/AnnouncementDialog";
import { DeleteAnnouncementDialog } from "@/components/Announcements/DeleteAnnouncementDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeUserInput } from "@/utils/sanitization";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
}

export default function Announcements() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | undefined>();
  const [announcementToDelete, setAnnouncementToDelete] = useState<string>("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch announcements from Supabase
  const { data: announcements = [], isLoading, error } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('publish_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching announcements:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load announcements."
        });
        throw error;
      }
      
      // Transform data to match our Announcement interface
      return data.map((announcement: any) => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        date: announcement.publish_date,
        priority: announcement.priority || "medium"
      })) as Announcement[];
    }
  });

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

  const handleAddAnnouncement = () => {
    setSelectedAnnouncement(undefined);
    setDialogOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setDialogOpen(true);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncementToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleViewAnnouncement = (id: string) => {
    try {
      const announcement = announcements.find((a) => a.id === id);
      if (!announcement) {
        throw new Error("Announcement not found");
      }
      toast({
        title: sanitizeUserInput(announcement.title),
        description: sanitizeUserInput(announcement.content),
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    }
  };

  const refreshAnnouncements = () => {
    queryClient.invalidateQueries({ queryKey: ['announcements'] });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading announcements...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-red-500">Error loading announcements. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-church-600">Announcements</h1>
        <Button onClick={handleAddAnnouncement}>Add Announcement</Button>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center p-8 border rounded-md">
          <p className="text-gray-500">No announcements available. Create your first announcement!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((announcement) => (
            <Card 
              key={announcement.id} 
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-church-100 p-2 rounded-lg">
                  <Bell className="w-6 h-6 text-church-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-xl">{sanitizeUserInput(announcement.title)}</h3>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{sanitizeUserInput(announcement.content)}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {new Date(announcement.date).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewAnnouncement(announcement.id)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditAnnouncement(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AnnouncementDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        announcement={selectedAnnouncement}
        onSuccess={refreshAnnouncements}
      />

      <DeleteAnnouncementDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        announcementId={announcementToDelete}
        onSuccess={refreshAnnouncements}
      />
    </div>
  );
}
