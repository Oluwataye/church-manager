
import jsPDF from "jspdf";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

type Member = {
  id: string;
  family_name: string;
  individual_names: string;
  contact_number?: string;
  contact_address?: string;
};

type Tithe = {
  id: string;
  member_id: string;
  date: string;
  amount: number;
  service_type: string;
};

export async function generateTitheReport(member: Member, tithes: Tithe[]): Promise<boolean> {
  try {
    const doc = new jsPDF();
    
    // Try to get the church logo from localStorage for watermark
    const logoUrl = localStorage.getItem('offlineLogo');
    
    // Add watermark if logo exists
    if (logoUrl) {
      try {
        // Create a new image element
        const img = new Image();
        img.src = logoUrl;
        
        // Wait for image to load before adding it to the PDF
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => {
            console.error('Failed to load logo image');
            resolve(); // Continue without watermark if image fails to load
          };
          // Set a timeout in case the image doesn't load
          setTimeout(() => resolve(), 2000);
        });
        
        // Only proceed if the image loaded successfully
        if (img.complete && img.naturalWidth > 0) {
          // Add the watermark (centered, semi-transparent)
          const imgWidth = 100;
          const imgHeight = (img.height / img.width) * imgWidth;
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          
          // Position in center of page
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2;
          
          // Add image with transparency
          doc.saveGraphicsState();
          doc.setGState({ opacity: 0.3 });
          doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);
          doc.restoreGraphicsState();
        }
      } catch (err) {
        console.error('Error adding watermark:', err);
        // Continue without watermark if there's an error
      }
    }
    
    // Add header
    doc.setFontSize(20);
    doc.text("LIVING FAITH CHURCH", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.text("Member Tithe Report", 105, 30, { align: "center" });
    
    // Add member details
    doc.setFontSize(12);
    const startY = 50;
    const lineHeight = 7;
    
    const details = [
      `Name: ${member.family_name} ${member.individual_names}`,
      `Contact Number: ${member.contact_number || 'N/A'}`,
      `Address: ${member.contact_address || 'N/A'}`,
      `Report Date: ${format(new Date(), "PPP")}`,
      `Total Tithes: ₦${tithes.reduce((sum, tithe) => sum + Number(tithe.amount), 0).toLocaleString()}`
    ];
    
    details.forEach((detail, index) => {
      doc.text(detail, 20, startY + (index * lineHeight));
    });
    
    // Add tithe records table
    const tableStartY = startY + (details.length * lineHeight) + 10;
    doc.setFontSize(11);
    doc.text("Tithe History", 20, tableStartY);
    
    // Table headers
    const headers = ["Date", "Service Type", "Amount (₦)"];
    const colWidths = [70, 70, 40];
    const tableTop = tableStartY + 5;
    
    // Draw header row
    doc.setFillColor(240, 240, 240);
    doc.rect(20, tableTop, 180, 8, "F");
    doc.setFont("helvetica", "bold");
    
    headers.forEach((header, i) => {
      let x = 20;
      for (let j = 0; j < i; j++) {
        x += colWidths[j];
      }
      doc.text(header, x + 5, tableTop + 6);
    });
    
    // Draw data rows
    doc.setFont("helvetica", "normal");
    let y = tableTop + 8;
    
    tithes.forEach((tithe, index) => {
      const isEven = index % 2 === 0;
      if (isEven) {
        doc.setFillColor(250, 250, 250);
        doc.rect(20, y, 180, 8, "F");
      }
      
      const formattedDate = format(new Date(tithe.date), "yyyy-MM-dd");
      const formattedAmount = tithe.amount.toLocaleString();
      
      doc.text(formattedDate, 25, y + 6);
      doc.text(tithe.service_type, 95, y + 6);
      doc.text(formattedAmount, 170, y + 6, { align: "right" });
      
      y += 8;
      
      // Add a new page if we're running out of space
      if (y > 270) {
        doc.addPage();
        y = 20;
        
        // Add page header on new page
        doc.setFont("helvetica", "bold");
        doc.text("Tithe History (continued)", 20, y);
        y += 10;
      }
    });
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
      doc.text("© 2024 LIVING FAITH CHURCH", 105, 295, { align: "center" });
    }
    
    // Save the PDF
    doc.save(`${member.family_name}_tithe_report.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating tithe report:', error);
    
    toast({
      variant: "destructive",
      title: "Report Generation Failed",
      description: "Failed to generate tithe report. Please try again."
    });
    
    return false;
  }
}
