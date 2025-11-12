
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { sanitizeUserInput } from "@/utils/sanitization";

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
}

export const EventCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch events from Supabase
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        toast.error("Failed to load events");
        throw error;
      }
      
      return data as Event[];
    }
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (!selectedDate) return;
    
    // Find events on the selected date
    const eventsOnDate = events.filter((event) => {
      const eventDate = new Date(event.start_date);
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    
    // If there's exactly one event, select it automatically
    if (eventsOnDate.length === 1) {
      setSelectedEvent(eventsOnDate[0]);
    }
  };

  // Get events for the currently selected date
  const eventsForSelectedDate = date 
    ? events.filter((event) => {
        const eventDate = new Date(event.start_date);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      })
    : [];

  // Format time from ISO string
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading events...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Events for {date?.toDateString()}</h3>
          {eventsForSelectedDate.length === 0 ? (
            <p className="text-muted-foreground">No events scheduled for this date</p>
          ) : (
            <div className="space-y-2">
              {eventsForSelectedDate.map((event) => (
                <div
                  key={event.id}
                  className="p-2 border rounded-md cursor-pointer hover:bg-accent"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="font-medium">{sanitizeUserInput(event.title)}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(event.start_date)}
                    {event.end_date && ` - ${formatTime(event.end_date)}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title && sanitizeUserInput(selectedEvent.title)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p><strong>Date:</strong> {selectedEvent?.start_date && new Date(selectedEvent.start_date).toLocaleDateString()}</p>
            <p>
              <strong>Time:</strong> {selectedEvent?.start_date && formatTime(selectedEvent.start_date)}
              {selectedEvent?.end_date && ` - ${formatTime(selectedEvent.end_date)}`}
            </p>
            {selectedEvent?.location && (
              <p><strong>Location:</strong> {sanitizeUserInput(selectedEvent.location)}</p>
            )}
            {selectedEvent?.description && (
              <p><strong>Description:</strong> {sanitizeUserInput(selectedEvent.description)}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
