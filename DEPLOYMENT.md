# 🚀 Deployment Guide - Render.com

Complete step-by-step guide to deploy Construction Workers & Payroll Management System on Render.com.

## 📋 Prerequisites

- GitHub account
- Render.com account (free)
- MongoDB Atlas account (free)

## ⏱️ Estimated Time: 15-20 minutes

---

## STEP 1: Setup MongoDB Atlas (5 minutes)

### 1.1 Create Account & Cluster
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for FREE account
3. Create new cluster (M0 Free tier)
4. Choose cloud provider and region (any)
5. Name your cluster: `construction-workers`
6. Click "Create Cluster"

### 1.2 Database Access
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Create user:
   - Username: `admin`
   - Password: Generate strong password (SAVE IT!)
4. User Privileges: Read and write to any database
5. Click "Add User"

### 1.3 Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. IP: `0.0.0.0/0` (Required for Render.com)
5. Click "Confirm"

### 1.4 Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy connection string:
    mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
5. Replace `<password>` with your actual password
6. Add database name: `construction_workers`
    mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/construction_workers?retryWrites=true&w=majority


---

## STEP 2: Prepare Code Repository (3 minutes)

### 2.1 Push to GitHub
Initialize git (if not already)
git init

Add all files
git add .

Commit
git commit -m "Initial commit - Construction Workers Management System"

Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/construction-workers.git
git push -u origin main


### 2.2 Generate Secrets
Run these commands to generate required secrets:
JWT Secret (save output)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Aadhar Encryption Key (save output)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"


---

## STEP 3: Deploy Backend (5 minutes)

### 3.1 Create Web Service
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository

### 3.2 Configure Backend Service
Name: construction-workers-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free

### 3.3 Add Environment Variables
Click "Add Environment Variable" for each:

| Key | Value |
|-----|-------|
| `PORT` | `10000` |
| `HOST` | `0.0.0.0` |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your generated JWT secret |
| `JWT_EXPIRE` | `30d` |
| `AADHAR_ENCRYPTION_KEY` | Your generated encryption key |
| `CLIENT_URL` | `*` (update after frontend deploy) |

### 3.4 Deploy
1. Click "Create Web Service"
2. Wait 3-5 minutes for build
3. Copy your backend URL: `https://construction-workers-backend.onrender.com`

---

## STEP 4: Deploy Frontend (5 minutes)

### 4.1 Create Static Site
1. Click "New +" → "Static Site"
2. Connect same GitHub repository
3. Select your repository

### 4.2 Configure Frontend Service
Name: construction-workers-frontend
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build

### 4.3 Add Environment Variable
| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://construction-workers-backend.onrender.com/api` |

(Use your actual backend URL)

### 4.4 Deploy
1. Click "Create Static Site"
2. Wait 3-5 minutes for build
3. Copy your frontend URL: `https://construction-workers-frontend.onrender.com`

---

## STEP 5: Update CORS (2 minutes)

### 5.1 Update Backend Environment
1. Go to backend service on Render
2. Click "Environment" tab
3. Update `CLIENT_URL` variable:
    CLIENT_URL=https://construction-workers-frontend.onrender.com
(Use your actual frontend URL)

4. Click "Save Changes"
5. Service will auto-deploy (1-2 minutes)

---

## STEP 6: Test Deployment (2 minutes)

### 6.1 Test Backend Health
Open in browser:
https://YOUR-BACKEND-URL.onrender.com/api/health

**Expected Response:**
{
"status": "OK",
"uptime": 123.45,
"database": "Connected"
}

### 6.2 Create First Admin User

**Using Terminal:**
curl -X POST https://YOUR-BACKEND-URL.onrender.com/api/auth/register
-H "Content-Type: application/json"
-d '{
"username": "admin",
"email": "admin@company.com",
"password": "Admin@123456",
"role": "admin"
}'


**Expected Response:**
{
"success": true,
"message": "User registered successfully",
"data": {
"user": {...},
"token": "..."
}
}
### 6.3 Login to Frontend
1. Open your frontend URL
2. Login with:
   - Email: `admin@company.com`
   - Password: `Admin@123456`
3. You should see the dashboard! 🎉

---

## 🎯 Your Live URLs

🌐 Frontend: https://construction-workers-frontend.onrender.com
🔌 Backend: https://construction-workers-backend.onrender.com
❤️ Health: https://construction-workers-backend.onrender.com/api/health👤 Admin Login:
Email: admin@company.com
Password: Admin@123456
---

## ⚠️ Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month combined for both services

### Keep Services Alive (Optional)
Use [UptimeRobot](https://uptimerobot.com) to ping every 14 minutes:
https://YOUR-BACKEND-URL.onrender.com/api/health
https://your-backend-url.onrender.com/api/health

### Auto-Deploy
- Push to GitHub → Auto-deploys on Render
- No manual rebuild needed

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB URI is correct
- Verify PORT=10000 and HOST=0.0.0.0
- Check all environment variables are set
- View logs: Dashboard → Service → Logs

### Frontend can't connect to backend
- Verify REACT_APP_API_URL is correct
- Check backend CLIENT_URL matches frontend URL
- Test backend health endpoint first

### Database connection failed
- Verify MongoDB Atlas IP whitelist: 0.0.0.0/0
- Check username/password in connection string
- Ensure database name is included in URI

---

## 💰 Cost Breakdown

| Service | Cost |
|---------|------|
| Backend (Render) | **$0/month** |
| Frontend (Render) | **$0/month** |
| MongoDB Atlas | **$0/month** |
| **Total** | **$0/month** |

Perfect for testing and small-scale production! 🎉

---

## 🚀 Production Recommendations

For production use:
1. Upgrade to Render Starter ($7/month) - No cold starts
2. Add custom domain
3. Enable automatic backups for MongoDB
4. Setup monitoring and alerts
5. Implement email notifications

---

## ✅ Deployment Complete!

Your Construction Workers & Payroll Management System is now live! 🎊

**Next Steps:**
1. Add employees via Employee page
2. Add contractors and work sites
3. Mark attendance
4. Generate reports

For support, refer to README.md or contact support.
