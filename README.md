# LICENSR - Sovereign Digital Asset Protection

## 🚀 Production Deployment Guide

**Master Control:** Mohd Ahmad  
**Status:** LIVE / ARMED

### 1. Prerequisites
- **Node.js** v18+
- **PostgreSQL** (NeonDB) or **SQLite** (LibSQL)
- **Environment Variables:**
  - `DATABASE_URL`: Connection string
  - `adminauth`: Master Key for Kill-Switch
  - `SECURITY_SECRET`: HMAC Signing Key

### 2. Physical Deployment
To update the live site:

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm install

# 3. Sydnc Database
npx prisma db push --accept-data-loss

# 4. Build for Production
npm run build

# 5. Start Server
npm start
```

### 3. Emergency Protocols (God-Mode)
- **Kill Switch:** Go to `/admin/clients/[id]` -> Click "Authorize Permanent Release".
- **Recovery:** Go to same panel -> Click "REPAIR & RESTORE SITE".
- **DMCA:** Use `/admin/tracking` to generating Legal PDFs.

---

### 🛡️ Powered by Licensr Integrity Engine
*Unauthorized access triggers Code Corruption Protocol.*
