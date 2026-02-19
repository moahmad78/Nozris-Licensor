
Write-Host "🛑 Killing Node.js processes..."
taskkill /F /IM node.exe
if ($?) { Write-Host "✅ Node processes killed." } else { Write-Host "⚠️ No Node processes found or failed to kill." }

Write-Host "🧹 Cleaning Prism Client..."
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Recurse -Force "node_modules\.prisma"
    Write-Host "✅ Deleted node_modules\.prisma"
}

Write-Host "♻️ Regenerating Prisma Client..."
npx prisma generate
if ($?) { Write-Host "✅ Prisma Client Generated Successfully!" } else { Write-Host "❌ Prisma Generation Failed." }

Write-Host "🚀 Please start your server manually: npm run dev"
