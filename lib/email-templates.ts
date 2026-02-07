export const getRenewalEmailTemplate = (
  domain: string,
  daysLeft: number,
  renewalLink: string,
  subscription: {
    planName: string;
    price: number;
    startDate: Date;
    expiryDate: Date;
  },
  profile: { fullName: string; contactNumber: string; supportEmail: string; logo?: string | null; whatsappNumber?: string }
) => {
  // Format dates
  const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    .header { background: #000000; padding: 40px 20px; text-align: center; }
    .logo { height: 45px; object-fit: contain; }
    .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
    .h1 { font-size: 24px; font-weight: 800; color: #111827; margin: 0 0 10px 0; text-align: center; }
    .subtitle { text-align: center; color: #6b7280; margin-bottom: 30px; }
    
    .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 25px; }
    .card-title { font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
    .label { color: #6b7280; }
    .value { font-weight: 600; color: #111827; }
    
    .alert-box { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 15px; border-radius: 8px; text-align: center; font-weight: 600; margin-bottom: 25px; }
    
    .offer-box { background: #ecfdf5; border: 1px solid #6ee7b7; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 25px; }
    .offer-price { font-size: 28px; font-weight: 800; color: #059669; }
    .offer-text { color: #047857; font-size: 14px; margin-top: 5px; }

    .btn { display: block; width: 100%; background: #000000; color: #ffffff; padding: 16px 0; border-radius: 10px; text-decoration: none; font-weight: 700; text-align: center; font-size: 16px; transition: background 0.2s; }
    .btn:hover { background: #1f2937; }
    
    .footer { background: #f9fafb; padding: 30px 20px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    .footer strong { color: #374151; }
    .contact-links { margin: 15px 0; }
    .contact-links a { color: #3b82f6; text-decoration: none; margin: 0 10px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${profile.logo ? `<img src="${profile.logo}" alt="Licensr Logo" class="logo" />` : `<span style="color: #fff; font-weight: 900; font-size: 24px; letter-spacing: -1px;">LICENSR</span>`}
    </div>
    
    <div class="content">
      <h1 class="h1">Renewal Notice</h1>
      <p class="subtitle">Your Licensr protection for <strong>${domain}</strong> is expiring.</p>

      <div class="alert-box">
        ⚠️ Expiring in ${daysLeft} Days <br>
        <span style="font-size: 13px; font-weight: 400;">Expected Date: ${formatDate(subscription.expiryDate)}</span>
      </div>

      <div class="card">
        <div class="card-title">Current Licensed Plan</div>
        <div class="row">
          <span class="label">Plan Name</span>
          <span class="value">${subscription.planName}</span>
        </div>
        <div class="row">
          <span class="label">Start Date</span>
          <span class="value">${formatDate(subscription.startDate)}</span>
        </div>
        <div class="row">
          <span class="label">Current Price</span>
          <span class="value">₹${subscription.price}/mo</span>
        </div>
      </div>

      <div class="offer-box">
        <div style="font-size: 13px; font-weight: 600; color: #059669; margin-bottom: 5px; text-transform: uppercase;">Renewal Offer</div>
        <div class="offer-price">₹${subscription.price} <span style="font-size: 14px; font-weight: 500; color: #6b7280;">/ month</span></div>
        <div class="offer-text">Secure your access for the next cycle instantly.</div>
      </div>
      
      <a href="${renewalLink}" class="btn">Confirm Renewal</a>
      
      <p style="text-align: center; margin-top: 25px; font-size: 13px; color: #9ca3af;">
        Direct Link: <a href="${renewalLink}" style="color: #9ca3af;">${renewalLink}</a>
      </p>
    </div>

    <div class="footer">
      <div style="margin-bottom: 15px;">
        <strong>Need Priority Support?</strong><br>
        Contact ${profile.fullName}
      </div>
      
      <div class="contact-links">
        <a href="https://wa.me/${(profile.whatsappNumber || "").replace(/[^0-9]/g, '')}">WhatsApp Priority: ${profile.whatsappNumber || "+91 9264920211"}</a>
        •
        <a href="mailto:${profile.supportEmail}">Email Support</a>
      </div>

      <div style="margin-top: 20px; color: #9ca3af;">
        Team Licensr • Gorakhpur, UP<br>
        © ${new Date().getFullYear()} Licensr Security Solutions. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;
};
