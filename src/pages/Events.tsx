import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCalendar } from "@/components/Events/EventCalendar";
import { EventList } from "@/components/Events/EventList";
import { EventForm } from "@/components/Events/EventForm";

const Events = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Church Events</h1>
        <p className="text-muted-foreground">Manage and track church events</p>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">Event List</TabsTrigger>
          <TabsTrigger value="create">Create Event</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <EventCalendar />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <EventList />
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <EventForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;