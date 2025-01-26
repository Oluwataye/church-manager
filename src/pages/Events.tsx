import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  type: "Sunday" | "Midweek" | "Special";
}

export default function Events() {
  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Sunday Service",
      date: "2024-03-24",
      time: "09:00",
      description: "Weekly Sunday Service",
      type: "Sunday",
    },
    {
      id: "2",
      title: "Midweek Service",
      date: "2024-03-27",
      time: "18:00",
      description: "Weekly Bible Study",
      type: "Midweek",
    },
  ]);

  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-church-600">Church Events</h1>
        <Button onClick={() => toast({ title: "Coming soon!", description: "Event creation will be available soon." })}>
          Add New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="p-6">
            <h3 className="font-semibold text-xl mb-4">{event.title}</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <p className="mt-4">{event.description}</p>
              <div className="mt-4">
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-church-100 text-church-600">
                  {event.type}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}