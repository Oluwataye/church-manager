import jsPDF from "jspdf";
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

export async function generateTitheReportPDF(records: TitheRecord[]): Promise<boolean> {
  try {
    const doc = new jsPDF();
    
    doc.setFont("helvetica");
    doc.setFontSize(18);
    doc.text("Tithe Records Report", 20, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), "PPP")}`, 20, 30);
    doc.text(`Total Records: ${records.length}`, 20, 36);
    
    const totalAmount = records.reduce((sum, record) => sum + Number(record.amount), 0);
    doc.text(`Total Amount: ₦${totalAmount.toLocaleString()}`, 20, 42);
    
    let yPosition = 55;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Member Name", 20, yPosition);
    doc.text("Date", 80, yPosition);
    doc.text("Month", 120, yPosition);
    doc.text("Amount", 160, yPosition);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    yPosition += 7;
    
    records.forEach((record) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Member Name", 20, yPosition);
        doc.text("Date", 80, yPosition);
        doc.text("Month", 120, yPosition);
        doc.text("Amount", 160, yPosition);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        yPosition += 7;
      }
      
      const memberName = `${record.members.first_name} ${record.members.last_name}`;
      const dateStr = format(new Date(record.date), "dd/MM/yyyy");
      const amount = `₦${Number(record.amount).toLocaleString()}`;
      
      doc.text(memberName, 20, yPosition);
      doc.text(dateStr, 80, yPosition);
      doc.text(record.month, 120, yPosition);
      doc.text(amount, 160, yPosition);
      
      yPosition += 7;
    });
    
    doc.save(`tithe_records_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    return true;
  } catch (error) {
    console.error("Error generating tithe report PDF:", error);
    return false;
  }
}

export async function generateMemberTithePDF(
  memberName: string,
  records: TitheRecord[]
): Promise<boolean> {
  try {
    const doc = new jsPDF();
    
    doc.setFont("helvetica");
    doc.setFontSize(18);
    doc.text(`Tithe Records - ${memberName}`, 20, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), "PPP")}`, 20, 30);
    doc.text(`Total Records: ${records.length}`, 20, 36);
    
    const totalAmount = records.reduce((sum, record) => sum + Number(record.amount), 0);
    doc.text(`Total Amount: ₦${totalAmount.toLocaleString()}`, 20, 42);
    
    let yPosition = 55;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Date", 20, yPosition);
    doc.text("Month", 70, yPosition);
    doc.text("Amount", 120, yPosition);
    doc.text("Notes", 160, yPosition);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    yPosition += 7;
    
    records.forEach((record) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Date", 20, yPosition);
        doc.text("Month", 70, yPosition);
        doc.text("Amount", 120, yPosition);
        doc.text("Notes", 160, yPosition);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        yPosition += 7;
      }
      
      const dateStr = format(new Date(record.date), "dd/MM/yyyy");
      const amount = `₦${Number(record.amount).toLocaleString()}`;
      const notes = record.notes ? record.notes.substring(0, 20) : "-";
      
      doc.text(dateStr, 20, yPosition);
      doc.text(record.month, 70, yPosition);
      doc.text(amount, 120, yPosition);
      doc.text(notes, 160, yPosition);
      
      yPosition += 7;
    });
    
    doc.save(`${memberName.replace(/\s+/g, '_')}_tithe_records_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    return true;
  } catch (error) {
    console.error("Error generating member tithe PDF:", error);
    return false;
  }
}