import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import https from 'https';

// OpenAI Client initialized inside handler to catch errors

// Helper: Check SSL Certificate
async function checkSSL(url: string): Promise<string> {
    return new Promise((resolve) => {
        try {
            const hostname = new URL(url).hostname;
            const options = {
                hostname: hostname,
                port: 443,
                method: 'GET',
                rejectUnauthorized: false, // Allow checking self-signed to detect them
                agent: new https.Agent({ maxCachedSessions: 0 })
            };

            const req = https.request(options, (res) => {
                const cert = (res.socket as any).getPeerCertificate();
                if (!cert || Object.keys(cert).length === 0) {
                    resolve("NO_SSL");
                    return;
                }

                const validTo = new Date(cert.valid_to);
                const daysRemaining = Math.floor((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

                if (daysRemaining < 0) resolve("EXPIRED");
                else if (daysRemaining < 30) resolve("EXPIRING_SOON");
                else resolve("VALID");
            });

            req.on('error', () => resolve("ERROR"));
            req.end();
        } catch (e) {
            resolve("INVALID_URL");
        }
    });
}

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            throw new Error("Missing OPENAI_API_KEY");
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // 1. Physical SSL Check
        const sslStatus = await checkSSL(url);

        // 2. GPT-4 Cyber-Intelligence Analysis
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Act as a ruthless Cyber Security Auditor. Analyze the domain provided. 
                    Identify 3 potential critical vulnerabilities based on common web stack weaknesses associated with this type of domain or industry.
                    Estimate a "Survival Days" count (integer 1-30) before a likely automated breach.
                    Estimate potential "Financial Loss" (integer) in USD.
                    Determine the "Threat Level" (CRITICAL, HIGH, MODERATE, LOW).
                    
                    Return ONLY valid JSON:
                    {
                        "threat_level": "CRITICAL" | "HIGH" | "MODERATE" | "LOW",
                        "survival_days": number,
                        "vulnerabilities": ["vuln1", "vuln2", "vuln3"],
                        "hacker_entry_point": "string",
                        "financial_loss": number,
                        "location": "string (e.g. Server Location or 'Unknown')"
                    }`
                },
                {
                    role: "user",
                    content: `Analyze this target: ${url}. SSL Status: ${sslStatus}.`
                }
            ],
            response_format: { type: "json_object" }
        });

        const aiData = JSON.parse(completion.choices[0].message.content || '{}');

        // Merge Physical & AI Data
        const finalResult = {
            ...aiData,
            ssl_status: sslStatus
        };

        return NextResponse.json(finalResult);

    } catch (error) {
        console.error("Autopsy Failed:", error);
        return NextResponse.json(
            { error: 'Autopsy analysis failed' },
            { status: 500 }
        );
    }
}
