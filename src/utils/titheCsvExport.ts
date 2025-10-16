import { format } from "date-fns";

interface TitheRecord {
  id: string;
  date: string;
  amount: number;
  month: string;
  notes?: string;
  members: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export function exportTithesToCSV(records: TitheRecord[], filename: string = "tithe_records") {
  const headers = ["Member Name", "Date", "Month", "Amount", "Notes"];
  
  const csvData = records.map(record => [
    `${record.members.first_name} ${record.members.last_name}`,
    format(new Date(record.date), "yyyy-MM-dd"),
    record.month,
    record.amount.toString(),
    record.notes || ""
  ]);
  
  const csvContent = [
    headers.join(","),
    ...csvData.map(row => 
      row.map(cell => `"${cell}"`).join(",")
    )
  ].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportMemberTithesToCSV(
  memberName: string,
  records: TitheRecord[]
) {
  const sanitizedName = memberName.replace(/\s+/g, "_");
  exportTithesToCSV(records, `${sanitizedName}_tithes`);
}