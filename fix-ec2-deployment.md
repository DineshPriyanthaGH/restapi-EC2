# Fix EC2 MongoDB Connection Issue

## Problem
- VS Code (local): MongoDB connection works ✅
- EC2 Terminal: MongoDB connection fails ❌

## Root Cause
The EC2 deployment is using an outdated .env file or code that still has the old connection string.

## Solution Steps

### Step 1: Check EC2 Environment File
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Navigate to your project directory
cd /home/ubuntu/restapi-node/_work/restapi-EC2/restapi-EC2

# Check current .env file
cat .env
```

### Step 2: Update EC2 .env File
Your EC2 .env should match your working local version:
```bash
# Edit the .env file on EC2
nano .env

# Make sure it contains:
MONGO_DB_URL="mongodb+srv://dineshpriyantha200248:0Wg8tyHS97RCek1U@restapi-ec2.um9fdjs.mongodb.net/?retryWrites=true&w=majority"
```

### Step 3: Update EC2 Database Connection Code
Check if the db.js file on EC2 has the improved error handling:
```bash
# Check current db.js
cat db/db.js

# If it's outdated, update it with the improved version
```

### Step 4: Deploy Updated Code to EC2
Option A - Manual update:
```bash
# On EC2, edit the db.js file
nano db/db.js

# Add the improved connection code with better error handling
```

Option B - Redeploy from GitHub:
```bash
# If you pushed changes to GitHub, pull them on EC2
git pull origin main

# Install any new dependencies
npm install
```

### Step 5: Restart Application on EC2
```bash
# Restart PM2 application
pm2 restart server

# Check logs
pm2 logs server --lines 20
```

## Quick Commands for EC2

1. **SSH into EC2:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. **Navigate to project:**
```bash
cd /home/ubuntu/restapi-node/_work/restapi-EC2/restapi-EC2
```

3. **Check current .env:**
```bash
cat .env
```

4. **Update .env (if needed):**
```bash
echo 'MONGO_DB_URL="mongodb+srv://dineshpriyantha200248:0Wg8tyHS97RCek1U@restapi-ec2.um9fdjs.mongodb.net/?retryWrites=true&w=majority"' > .env
```

5. **Restart and check:**
```bash
pm2 restart server
pm2 logs server
```

## Expected Result
After fixing, you should see on EC2:
```
Server is running on port: 8000
Attempting to connect to MongoDB...
MongoDB connection established successfully
```
