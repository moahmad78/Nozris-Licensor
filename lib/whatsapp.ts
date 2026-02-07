export async function sendWhatsAppMessage(to: string, message: string) {
    try {
        console.log(`[WHATSAPP] To: ${to} | Message: ${message}`);

        // Integration with external WhatsApp Provider (e.g., Twilio / Interakt / WATI)
        // For now, valid simulation logging and placeholder fetch.

        // Example:
        // await fetch('https://api.whatsapp-service.com/send', { 
        //    method: 'POST', 
        //    body: JSON.stringify({ to, message }) 
        // });

        return true;
    } catch (error) {
        console.error("Failed to send WhatsApp message:", error);
        // Return false so the app doesn't crash
        return false;
    }
}
