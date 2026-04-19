# 🚂 Railway Backend Deployment - Step by Step

Deploy your Swift Clinic Pro backend to Railway.app

---

## ⏱️ Time Required: 10 minutes

---

## 📋 What You'll Need

Before starting, have these ready:
```
✅ GitHub repository: https://github.com/Aslamak05/swift-clinic-pro
✅ MongoDB Connection String: mongodb+srv://medibook:medibook123@medibook.fe0zugu.mongodb.net/medibook?retryWrites=true&w=majority
✅ GitHub account (already have it)
```

---

## ✅ STEP 1: Create Railway Account

### 1a. Go to Railway
```
Open browser:
https://railway.app
```

### 1b. Click "Login" or "Start Project"
Look for login/signup button at top right

### 1c. Sign Up with GitHub
```
Click: "Login with GitHub"
(Easiest option)
```

### 1d. Authorize Railway
```
GitHub will ask permission
Click: "Authorize railway-app"
```

### 1e. Railway is Ready!
You're now logged into Railway ✓

---

## ✅ STEP 2: Create New Project

### 2a. Click "Create New Project"
On Railway dashboard, click:
```
Green button: "Create New Project"
or "+ New Project"
```

### 2b. Choose "Deploy from GitHub repo"
```
Options appear:
- Deploy from GitHub repo    ← CLICK THIS
- Template Gallery
- Docker Image
- Empty Project
```

Click: **"Deploy from GitHub repo"**

### 2c. Select Repository
```
GitHub repos appear
Find: swift-clinic-pro
Click it to select
```

### 2d. Authorize Railway to Access GitHub
If it asks:
```
"Authorize Railway to access your GitHub repositories?"
Click: "Authorize"
```

### 2e. Confirm Deploy
```
A dialog appears asking to confirm
Click: "Deploy"
```

Wait 1-2 minutes for deployment to start...

---

## ✅ STEP 3: Add Environment Variables

### 3a. After Deployment Starts
You'll see your project dashboard with:
```
- Service name: swift-clinic-pro
- Status: Deploying (or Building)
- Variables section
```

### 3b. Click on Project Settings or Service
Look for your service card/item and click on it

### 3c. Go to "Variables" Tab
```
On left side, find:
Variables  ← CLICK THIS
```

Or look for settings icon ⚙️

### 3d. Add Environment Variables

You need to add these variables. Click "New Variable" or similar:

**Variable 1: PORT**
```
KEY:   PORT
VALUE: 4000
Click: Add ✓
```

**Variable 2: NODE_ENV**
```
KEY:   NODE_ENV
VALUE: production
Click: Add ✓
```

**Variable 3: MONGO_URL**
```
KEY:   MONGO_URL
VALUE: mongodb+srv://medibook:medibook123@medibook.fe0zugu.mongodb.net/medibook?retryWrites=true&w=majority
Click: Add ✓
```

**Variable 4: JWT_SECRET**
```
KEY:   JWT_SECRET
VALUE: generate-a-random-32-character-string-here-abc123xyz789
       (Example: xP9kL2mQ5vR8tY1wU4aS7dF0gH3jK6lM)
Click: Add ✓

Note: Use a random 32+ character string for security
```

**Variable 5: JWT_EXPIRES**
```
KEY:   JWT_EXPIRES
VALUE: 7d
Click: Add ✓
```

**Variable 6: CORS_ORIGIN**
```
KEY:   CORS_ORIGIN
VALUE: http://localhost:8080
       (We'll update this later to Vercel URL)
Click: Add ✓
```

**Variable 7: UPLOAD_DIR**
```
KEY:   UPLOAD_DIR
VALUE: ./uploads
Click: Add ✓
```

**Variable 8: TWILIO_ACCOUNT_SID** (Optional)
```
KEY:   TWILIO_ACCOUNT_SID
VALUE: (leave blank if you don't have Twilio)
Click: Add ✓
```

**Variable 9: TWILIO_AUTH_TOKEN** (Optional)
```
KEY:   TWILIO_AUTH_TOKEN
VALUE: (leave blank if you don't have Twilio)
Click: Add ✓
```

**Variable 10: TWILIO_FROM** (Optional)
```
KEY:   TWILIO_FROM
VALUE: +15555555555
Click: Add ✓
```

### 3e. Your Variables Should Look Like:
```
PORT                = 4000
NODE_ENV            = production
MONGO_URL           = mongodb+srv://medibook:medibook123@...
JWT_SECRET          = xP9kL2mQ5vR8tY1wU4aS7dF0gH3jK6lM
JWT_EXPIRES         = 7d
CORS_ORIGIN         = http://localhost:8080
UPLOAD_DIR          = ./uploads
TWILIO_ACCOUNT_SID  = (blank)
TWILIO_AUTH_TOKEN   = (blank)
TWILIO_FROM         = (blank)
```

---

## ✅ STEP 4: Trigger Deployment

### 4a. After Adding Variables
Railway will automatically redeploy with new variables

You'll see:
```
Status: Redeploying...
Logs: Building and deploying...
```

Wait 2-3 minutes...

### 4b. Check Deployment Status
```
When complete, you'll see:
Status: ✅ Live or ✅ Running

This means your backend is deployed!
```

---

## ✅ STEP 5: Get Your Railway URL

### 5a. Find Your Service Domain
On the service page, look for:
```
"Domain" or "URL" section

You'll see something like:
https://swift-clinic-pro-production.up.railway.app
or
https://swift-clinic-pro-abc123.railway.app
```

### 5b. Copy Your Backend URL
```
Copy this URL:
https://your-project-name-production.up.railway.app
```

**Save this! You'll need it for the frontend.** ✓

### 5c. Test Your Backend is Working
```
Open browser to your Railway URL
You should see a response (possibly an error page, but that's OK)

Good signs:
- Page loads (not "Connection refused")
- You see some response (even if it's 404 or an error)

Bad signs:
- "Cannot connect" 
- "Connection refused"
- "Timeout"
```

---

## 📝 Your Railway Information

Save this:

```
=== Railway Deployment Info ===

Project Name: swift-clinic-pro
Service: swift-clinic-pro
Backend URL: https://swift-clinic-pro-production.up.railway.app

Environment Variables Added:
✅ PORT = 4000
✅ NODE_ENV = production
✅ MONGO_URL = mongodb+srv://medibook:medibook123@...
✅ JWT_SECRET = [your random string]
✅ JWT_EXPIRES = 7d
✅ CORS_ORIGIN = http://localhost:8080
✅ UPLOAD_DIR = ./uploads

Status: ✅ Deployed and Running
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Created Railway account
- [ ] Connected GitHub repository
- [ ] Deployment started
- [ ] Added all 10 environment variables
- [ ] Deployment completed (Status: Live/Running)
- [ ] Got Railway backend URL
- [ ] Tested backend URL in browser
- [ ] Saved backend URL for frontend

---

## ❌ Common Issues & Fixes

### Issue: Build failed or deployment stuck
**Fix**:
1. Check the logs (click on service)
2. Look for errors in build logs
3. Common cause: Missing dependencies
4. Solution: Ensure all files were committed to GitHub

### Issue: Can't see environment variables
**Fix**:
1. Click on your service/project
2. Click the service name (left sidebar)
3. Scroll down to "Variables" section
4. Or look for ⚙️ Settings icon

### Issue: Backend URL shows error
**Fix**:
1. Wait 30 seconds more (Railway may still be starting)
2. Refresh the page
3. Check logs for startup errors
4. Verify MONGO_URL is correct

### Issue: "Connection refused" 
**Fix**:
1. Deployment may still be running
2. Check status is "Live" not "Building"
3. Wait a few more minutes
4. Try redeploying: Click redeploy button

---

## 🎯 What's Next

After Railway backend is running:

1. ✅ Update CORS_ORIGIN to Vercel URL (later)
2. ✅ Build frontend locally
3. ✅ Deploy frontend to Vercel
4. ✅ Update backend CORS_ORIGIN
5. ✅ Test full application

---

## 📋 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| PORT | Server port | 4000 |
| NODE_ENV | Environment mode | production |
| MONGO_URL | Database connection | mongodb+srv://... |
| JWT_SECRET | JWT signing key | 32+ random chars |
| JWT_EXPIRES | Token expiry | 7d |
| CORS_ORIGIN | Frontend URL | http://localhost:8080 |
| UPLOAD_DIR | File upload path | ./uploads |
| TWILIO_ACCOUNT_SID | SMS service (optional) | AC... |
| TWILIO_AUTH_TOKEN | SMS token (optional) | auth... |
| TWILIO_FROM | SMS number (optional) | +1... |

---

## 💾 Important Credentials

```
MongoDB:
- URL: mongodb+srv://medibook:medibook123@medibook.fe0zugu.mongodb.net/medibook
- User: medibook
- Pass: medibook123

Railway:
- Backend URL: https://your-url.railway.app
- Dashboard: https://railway.app/dashboard

GitHub:
- Repo: https://github.com/Aslamak05/swift-clinic-pro
```

**Keep these safe!** 📌

---

## 🚀 Success!

Your backend is now deployed to Railway!

**Next**: Deploy frontend to Vercel

---

*Total Time: ~10 minutes*  
*Difficulty: ⭐ Easy*  
*Cost: ~$5/month (pay-as-you-go)*
