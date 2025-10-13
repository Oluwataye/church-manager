import jsPDF from "jspdf";
import type { Member } from "@/hooks/useMembers";

export async function generateMemberPDF(member: Member): Promise<boolean> {
  try {
    const doc = new jsPDF();
    
    // Set font
    doc.setFont("helvetica");
    
    // Add title
    doc.setFontSize(20);
    doc.text("Member Profile", 20, 20);
    
    // Add member details
    doc.setFontSize(12);
    let yPosition = 40;
    
    const details = [
      `Name: ${member.first_name} ${member.last_name}`,
      `Email: ${member.email || 'N/A'}`,
      `Phone: ${member.phone || 'N/A'}`,
      `Address: ${member.address || 'N/A'}`,
      `City: ${member.city || 'N/A'}`,
      `State: ${member.state || 'N/A'}`,
      `Marital Status: ${member.marital_status || 'N/A'}`,
      `Gender: ${member.gender || 'N/A'}`,
      `Date of Birth: ${member.date_of_birth || 'N/A'}`,
      `Member Type: ${member.member_type}`,
      `Baptism Date: ${member.baptism_date || 'N/A'}`,
      `Baptism Location: ${member.baptism_location || 'N/A'}`,
      `Join Date: ${member.join_date || 'N/A'}`,
      `WOFBI Graduate: ${member.wofbi_graduate ? 'Yes' : 'No'}`,
    ];
    
    if (member.wofbi_graduate && member.wofbi_graduation_year) {
      details.push(`WOFBI Graduation Year: ${member.wofbi_graduation_year}`);
    }
    
    details.forEach((detail) => {
      doc.text(detail, 20, yPosition);
      yPosition += 10;
    });
    
    // Save the PDF
    doc.save(`${member.first_name}_${member.last_name}_profile.pdf`);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}
