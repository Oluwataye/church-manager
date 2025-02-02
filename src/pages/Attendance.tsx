import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AttendanceForm } from "@/components/Attendance/AttendanceForm";
import { AttendanceList } from "@/components/Attendance/AttendanceList";
import { AttendanceStats } from "@/components/Attendance/AttendanceStats";

export default function Attendance() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Attendance Management</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "View Attendance List" : "Take Attendance"}
        </Button>
      </div>

      <AttendanceStats />

      {showForm ? <AttendanceForm /> : <AttendanceList />}
    </div>
  );
}