import { useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const EventList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock events data - in real app, this would come from your CSV service
  const events = [
    {
      id: 1,
      title: "Sunday Service",
      date: new Date(),
      time: "9:00 AM",
      location: "Main Auditorium",
      type: "service",
    },
    {
      id: 2,
      title: "Bible Study",
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: "6:00 PM",
      location: "Fellowship Hall",
      type: "study",
    },
    // Add more mock events as needed
  ];

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <div className="grid gap-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {event.date.toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {event.type}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};