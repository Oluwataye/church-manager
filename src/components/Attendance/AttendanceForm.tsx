import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AttendanceForm() {
  const [attendance, setAttendance] = useState({
    adultMen: "",
    adultWomen: "",
    boys: "",
    girls: "",
    date: new Date().toISOString().split('T')[0],
    serviceType: "Sunday Service",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the attendance data
    toast.success("Attendance recorded successfully");
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
          </div>
          <Button type="submit" className="w-full">Record Attendance</Button>
        </form>
      </CardContent>
    </Card>
  );
}