
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function AttendanceForm() {
  const queryClient = useQueryClient();
  const [attendance, setAttendance] = useState({
    adultMen: "",
    adultWomen: "",
    boys: "",
    girls: "",
    date: new Date().toISOString().split('T')[0],
    serviceType: "Sunday Service",
  });

  const { mutate: saveAttendance, isPending } = useMutation({
    mutationFn: async (data: typeof attendance) => {
      const { error } = await supabase.from('attendance_records').insert([{
        date: data.date,
        service_type: data.serviceType,
        adult_men: parseInt(data.adultMen) || 0,
        adult_women: parseInt(data.adultWomen) || 0,
        boys: parseInt(data.boys) || 0,
        girls: parseInt(data.girls) || 0,
      }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Attendance recorded", {
        description: "Attendance record has been saved successfully."
      });
      setAttendance({
        adultMen: "",
        adultWomen: "",
        boys: "",
        girls: "",
        date: new Date().toISOString().split('T')[0],
        serviceType: "Sunday Service",
      });
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error) => {
      console.error('Error saving attendance:', error);
      toast.error("Failed to record attendance", {
        description: "An error occurred while saving the attendance record. Please try again."
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAttendance(attendance);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adultMen">Adult Men</Label>
              <Input
                id="adultMen"
                type="number"
                value={attendance.adultMen}
                onChange={(e) => setAttendance({ ...attendance, adultMen: e.target.value })}
                placeholder="Number of adult men"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adultWomen">Adult Women</Label>
              <Input
                id="adultWomen"
                type="number"
                value={attendance.adultWomen}
                onChange={(e) => setAttendance({ ...attendance, adultWomen: e.target.value })}
                placeholder="Number of adult women"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boys">Boys</Label>
              <Input
                id="boys"
                type="number"
                value={attendance.boys}
                onChange={(e) => setAttendance({ ...attendance, boys: e.target.value })}
                placeholder="Number of boys"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="girls">Girls</Label>
              <Input
                id="girls"
                type="number"
                value={attendance.girls}
                onChange={(e) => setAttendance({ ...attendance, girls: e.target.value })}
                placeholder="Number of girls"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={attendance.date}
                onChange={(e) => setAttendance({ ...attendance, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={attendance.serviceType}
                onValueChange={(value) => setAttendance({ ...attendance, serviceType: value })}
              >
                <SelectTrigger id="serviceType">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sunday Service">Sunday Service</SelectItem>
                  <SelectItem value="Midweek Service">Midweek Service</SelectItem>
                  <SelectItem value="Special Service">Special Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Recording..." : "Record Attendance"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
