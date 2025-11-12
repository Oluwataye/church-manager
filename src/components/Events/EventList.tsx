
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { sanitizeUserInput } from "@/utils/sanitization";

// Interface for event data
interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
}

export const EventList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch events from Supabase
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching events:', error);
        toast.error("Failed to load events");
        throw error;
      }
      
      return data as Event[];
    }
  });

  // Filter events based on search term
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center p-4">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error loading events. Please try again.</div>;
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {filteredEvents.length === 0 ? (
        <div className="text-center p-6 border rounded-md">
          <p className="text-muted-foreground">No events found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="p-4">
              <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{sanitizeUserInput(event.title)}</h3>
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-1">{sanitizeUserInput(event.description)}</p>
                )}
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(event.start_date).toLocaleDateString()}
                    </div>
                    {event.end_date && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {new Date(event.end_date).toLocaleDateString()}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
