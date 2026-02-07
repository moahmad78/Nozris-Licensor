import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

export async function POST(req: NextRequest) {
    try {
        const { hackerDomain, hackerIp, licenseKey, violationDate } = await req.json();

        // Initialize PDF
        const doc = new jsPDF();

        // Header
        doc.setFont("times", "bold");
        doc.setFontSize(22);
        doc.text("OFFICIAL DMCA TAKEDOWN NOTICE", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.setFont("times", "normal");
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);

        // Recipient (Hacker/Host)
        doc.setFont("times", "bold");
        doc.text(`To the Administrator/Hosting Provider of: ${hackerDomain} (${hackerIp})`, 20, 50);

        // Body
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        const bodyText = `
I am writing to you on behalf of Licensr Security Systems. We have detected unauthorized use and distribution of our proprietary software source code on the domain listed above.

The content in question is the intellectual property of Licensr and its licensed partners. The access to this code is protected by an active license agreement (Key: ${licenseKey}), which has been violated by the entity operating ${hackerDomain}.

Violation: Verification failures logged on ${violationDate}.

Re: Copyright Violation & Indian IT Act, 2000 Section 66.

I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law. The information in this notification is accurate, and under penalty of perjury, I am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.

We demand the immediate removal or disabling of access to the infringing material. Failure to comply will result in further legal action.
        `;

        const splitBody = doc.splitTextToSize(bodyText, 170);
        doc.text(splitBody, 20, 70);

        // Signature
        doc.text("Sincerely,", 20, 180);
        doc.setFont("times", "bold");
        doc.text("Mohd Ahmad", 20, 190);
        doc.setFont("times", "italic");
        doc.text("Founder, Licensr", 20, 195);

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text("Generated Automatically by Licensr Legal Defense Engine", 105, 280, { align: "center" });

        // Output
        const pdfBuffer = doc.output('arraybuffer');

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="DMCA_${hackerDomain}.pdf"`,
            },
        });

    } catch (error) {
        console.error("DMCA Gen Error:", error);
        return NextResponse.json({ error: 'Failed to generate DMCA Notice' }, { status: 500 });
    }
}
