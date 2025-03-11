
import jsPDF from "jspdf";

interface Member {
  family_name: string;
  individual_names: string;
  marital_status: string;
  number_of_children: number;
  contact_number: string;
  contact_address: string;
  foundation_class_date: string;
  baptism_water: boolean;
  baptism_holy_ghost: boolean;
  baptism_year: string;
  wofbi_class_type: string;
  wofbi_year: string;
  joining_location: string;
  group_name?: string;
}

export async function generateMemberProfile(member: Member): Promise<boolean> {
  try {
    const doc = new jsPDF();
    
    // Try to get the church logo from localStorage for watermark
    const logoUrl = localStorage.getItem('offlineLogo');
    
    // Add watermark if logo exists
    if (logoUrl) {
      try {
        // Convert data URL to image for jsPDF
        const img = new Image();
        img.src = logoUrl;
        
        // Wait for image to load
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          // Set a timeout in case the image doesn't load
          setTimeout(resolve, 2000);
        });
        
        // Add the watermark (centered, faded)
        const imgWidth = 70; // Adjust size as needed
        const imgHeight = (img.height / img.width) * imgWidth;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Position in center of page
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        
        // Add image with transparency
        doc.saveGraphicsState();
        // Fix the GState creation by using the appropriate API
        doc.setGState(doc.internal.getGState({ opacity: 0.2 }));
        doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);
        doc.restoreGraphicsState();
      } catch (err) {
        console.error('Error adding watermark:', err);
        // Continue without watermark if there's an error
      }
    }
    
    // Add header
    doc.setFontSize(20);
    doc.text("LIVING FAITH CHURCH", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.text("Member Profile", 105, 30, { align: "center" });
    
    // Add member details
    doc.setFontSize(12);
    const startY = 50;
    const lineHeight = 10;
    
    const details = [
      `Name: ${member.family_name} ${member.individual_names}`,
      `Marital Status: ${member.marital_status || 'N/A'}`,
      `Number of Children: ${member.number_of_children}`,
      `Contact Number: ${member.contact_number}`,
      `Address: ${member.contact_address}`,
      `Join Date: ${member.foundation_class_date || 'N/A'}`,
      `Baptism Status: ${[
        member.baptism_water ? 'Water' : '',
        member.baptism_holy_ghost ? 'Holy Ghost' : ''
      ].filter(Boolean).join(', ') || 'N/A'}`,
      `Baptism Year: ${member.baptism_year || 'N/A'}`,
      `WOFBI Class: ${member.wofbi_class_type || 'N/A'}`,
      `WOFBI Year: ${member.wofbi_year || 'N/A'}`,
      `Joining Location: ${member.joining_location}`,
      `Church Group: ${member.group_name || 'No Group'}`
    ];
    
    details.forEach((detail, index) => {
      doc.text(detail, 20, startY + (index * lineHeight));
    });
    
    // Add footer
    doc.setFontSize(10);
    doc.text("© 2024 T-TECH GENERAL SERVICES", 105, 280, { align: "center" });
    
    // Save the PDF
    doc.save(`${member.family_name}_profile.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}
