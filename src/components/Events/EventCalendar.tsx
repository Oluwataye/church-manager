import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const EventCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Mock events data - in real app, this would come from your CSV service
  const events = [
    {
      id: 1,
      title: "Sunday Service",
      date: new Date(),
      type: "service",
      description: "Regular Sunday Service",
      time: "9:00 AM",
    },
    // Add more mock events as needed
  ];

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    const event = events.find(
      (e) => e.date.toDateString() === selectedDate?.toDateString()
    );
    if (event) {
      setSelectedEvent(event);
    }
  };

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
          <div className="space-y-2">
            {events
              .filter((e) => e.date.toDateString() === date?.toDateString())
              .map((event) => (
                <div
                  key={event.id}
                  className="p-2 border rounded-md cursor-pointer hover:bg-accent"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">{event.time}</div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p><strong>Date:</strong> {selectedEvent?.date.toDateString()}</p>
            <p><strong>Time:</strong> {selectedEvent?.time}</p>
            <p><strong>Type:</strong> {selectedEvent?.type}</p>
            <p><strong>Description:</strong> {selectedEvent?.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};