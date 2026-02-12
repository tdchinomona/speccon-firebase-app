# SpecCon Firebase App - Deployment Script
# Run this script to deploy your app to Firebase Hosting

Write-Host "🚀 Starting deployment process..." -ForegroundColor Cyan

# Step 1: Check if Firebase is logged in
Write-Host "`n📋 Step 1: Checking Firebase authentication..." -ForegroundColor Yellow
firebase projects:list 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Firebase. Please run: firebase login" -ForegroundColor Red
    Write-Host "   This will open a browser for you to sign in." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Firebase authentication verified" -ForegroundColor Green

# Step 2: Build the app
Write-Host "`n📦 Step 2: Building React app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful" -ForegroundColor Green

# Step 3: Deploy Firestore rules
Write-Host "`n🔒 Step 3: Deploying Firestore security rules..." -ForegroundColor Yellow
firebase deploy --only firestore:rules
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Firestore rules deployment failed (this is okay if rules are already deployed)" -ForegroundColor Yellow
}

# Step 4: Deploy to Firebase Hosting
Write-Host "`n🌐 Step 4: Deploying to Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
Write-Host "🌍 Your app should be live at: https://YOUR-PROJECT-ID.web.app" -ForegroundColor Cyan
Write-Host "`n💡 Don't forget to set environment variables in Firebase Hosting if needed!" -ForegroundColor Yellow
