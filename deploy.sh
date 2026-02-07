#!/bin/bash
echo "🚀 INITIATING TERMINAL DEPLOYMENT FOR LICENSR..."
git add .
git commit -m "Terminal Deploy: Fixes and Autopsy Update"
git push origin main
vercel --prod --confirm
echo "✅ DEPLOYMENT COMPLETE: LICENSR IS NOW LIVE!"
