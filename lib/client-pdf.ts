import jsPDF from 'jspdf';
import { toast } from 'sonner';

export const generateCertificatePDF = (data: any) => {
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let y = 20;

        // --- HEADER SECTION ---

        // 1. Logo (Top Right)
        if (data.logo) {
            try {
                if (data.logo.startsWith('data:image')) {
                    const imgProps = doc.getImageProperties(data.logo);
                    const imgWidth = 25;
                    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                    doc.addImage(data.logo, 'PNG', pageWidth - 20 - imgWidth, 15, imgWidth, imgHeight);
                }
            } catch (e) { console.error('Logo Error', e) }
        }

        // 2. Sender Details (Top Left)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text(data.senderName || 'License Admin', 20, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80);
        doc.text(data.senderAddress || 'Address Not Provided', 20, y);
        y += 5;
        doc.text(`Email: ${data.senderEmail || 'support@example.com'}`, 20, y);
        y += 5;
        doc.text(`WhatsApp: ${data.senderWhatsapp || 'N/A'}`, 20, y);
        y += 15;

        // 3. Document Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text("OFFICIAL LICENSE CERTIFICATE & INVOICE", 20, y);
        y += 2;

        // Divider
        y += 5;
        doc.setLineWidth(0.5);
        doc.setDrawColor(200);
        doc.line(20, y, pageWidth - 20, y);
        y += 10;

        // --- DETAILS TABLE ---
        // Client Section
        if (data.clientName || data.clientAddress) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0);
            doc.text("Billed To:", 20, y);
            y += 5;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60);
            if (data.clientName) { doc.text(data.clientName, 20, y); y += 5; }
            if (data.clientAddress) { doc.text(data.clientAddress, 20, y); y += 5; }
            y += 5;
        }

        const rowHeight = 8;

        // Format Helper
        const drawRow = (label: string, value: string, isMono = false, isBold = false) => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100);
            doc.text(label, 25, y);

            doc.setTextColor(0);
            if (isMono) doc.setFont('courier', 'bold');
            else if (isBold) doc.setFont('helvetica', 'bold');
            else doc.setFont('helvetica', 'normal');

            doc.text(value, 85, y);
            y += rowHeight;
        };

        // Draw background rect
        const tableHeight = 70;
        doc.setFillColor(249, 250, 251);
        doc.rect(15, y - 5, pageWidth - 30, tableHeight, 'F');
        doc.setDrawColor(229, 231, 235);
        doc.rect(15, y - 5, pageWidth - 30, tableHeight, 'S');

        drawRow("Generation Date:", new Date().toLocaleString());
        drawRow("License Key:", data.licenseKey || 'N/A', true);
        drawRow("Authorized Domain:", data.domain || 'N/A');
        drawRow("Plan Name:", data.planName || "Standard Plan");
        drawRow("Subscription Price:", `INR ${data.price || 500} / month`);
        drawRow("Valid Until:", data.expiryDate ? new Date(data.expiryDate).toDateString() : 'N/A', false, true);

        y += 20;

        // --- FOOTER & INTEGRATION CODE ---
        const footerY = pageHeight - 110;

        // Integration Code Snippet Box
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text("Quick Integration Code", 20, footerY);

        doc.setFontSize(8);
        doc.setFont('courier', 'normal');
        doc.setTextColor(50);
        const codeSnippet = `
// config.js
export const LICENSE_KEY = '${data.licenseKey}';
// Ensure this key is only used on: ${data.domain}
        `;
        doc.setFillColor(30, 41, 59); // Dark
        doc.rect(20, footerY + 5, pageWidth - 40, 25, 'F');
        doc.setTextColor(255);
        doc.text(codeSnippet.trim(), 25, footerY + 15);


        // Signature / Stamp
        doc.setTextColor(156, 163, 175);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.text("Digitally Signed & Verified", pageWidth - 70, pageHeight - 30);

        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(1);
        doc.rect(pageWidth - 75, pageHeight - 45, 55, 25);
        doc.addImage(data.logo || "", 'PNG', pageWidth - 70, pageHeight - 42, 10, 10); // Helper stamp logic
        doc.setTextColor(37, 99, 235);
        doc.setFont('helvetica', 'bold');
        doc.text("PAID", pageWidth - 55, pageHeight - 35);


        // Save
        doc.save(`License_${data.domain}_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success("Certificate Downloaded!");

    } catch (error) {
        console.error("PDF Generation Error", error);
        toast.error("Failed to generate PDF");
    }
};
