export const saveToCsv = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] || "")).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const loadFromCsv = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const [headers, ...rows] = text.split("\n");
      const data = rows.map((row) => {
        const values = row.split(",");
        return headers.split(",").reduce((obj: any, header, index) => {
          obj[header] = JSON.parse(values[index] || "null");
          return obj;
        }, {});
      });
      resolve(data);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};