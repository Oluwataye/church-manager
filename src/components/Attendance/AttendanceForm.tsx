import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AttendanceForm() {
  const [attendance, setAttendance] = useState({
    men: "",
    women: "",
    children: "",
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
              <Label htmlFor="men">Men</Label>
              <Input
                id="men"
                type="number"
                value={attendance.men}
                onChange={(e) => setAttendance({ ...attendance, men: e.target.value })}
                placeholder="Number of men"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="women">Women</Label>
              <Input
                id="women"
                type="number"
                value={attendance.women}
                onChange={(e) => setAttendance({ ...attendance, women: e.target.value })}
                placeholder="Number of women"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="children">Children</Label>
              <Input
                id="children"
                type="number"
                value={attendance.children}
                onChange={(e) => setAttendance({ ...attendance, children: e.target.value })}
                placeholder="Number of children"
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