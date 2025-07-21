# Fix MongoDB Atlas Connection Issue

## Problem
Your Node.js application running on EC2 cannot connect to MongoDB Atlas because the EC2 IP is not whitelisted.

## Error
```
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

## Solution

### Step 1: Find Your EC2 Instance's Public IP

Run this command on your EC2 instance:
```bash
# Get public IP
curl -s http://checkip.amazonaws.com

# Or alternative method
curl -s http://169.254.169.254/latest/meta-data/public-ipv4
```

### Step 2: Whitelist IP in MongoDB Atlas

1. **Login to MongoDB Atlas**: Go to https://cloud.mongodb.com
2. **Select Your Project**: Choose the project containing your cluster
3. **Go to Network Access**: 
   - Click "Network Access" in the left sidebar
   - OR go to "Security" → "Network Access"
4. **Add IP Address**:
   - Click "ADD IP ADDRESS" button
   - Enter your EC2 public IP address
   - Add description like "EC2 Production Server"
   - Click "Confirm"

### Step 3: Alternative - Allow All IPs (Less Secure)

If you want to allow access from anywhere (not recommended for production):
1. In Network Access, click "ADD IP ADDRESS"
2. Click "ALLOW ACCESS FROM ANYWHERE"
3. This adds `0.0.0.0/0` which allows all IPs

### Step 4: Wait for Changes to Propagate

MongoDB Atlas changes can take 1-2 minutes to take effect.

### Step 5: Test Connection

After adding the IP, test your connection:
```bash
# Restart your application
pm2 restart server

# Check logs
pm2 logs server
```

## Important Notes

### For Production Environments:
- **Use specific IP**: Always whitelist specific IP addresses rather than allowing all IPs
- **Use VPC Peering**: For better security, consider VPC peering between AWS and MongoDB Atlas
- **Use Private Endpoints**: MongoDB Atlas supports private endpoints for enhanced security

### For Development:
- You can temporarily use "Allow access from anywhere" but remember to restrict it later

### If EC2 IP Changes:
- **Elastic IP**: Consider using an Elastic IP for your EC2 instance to prevent IP changes
- **Security Groups**: Your EC2 security group should allow outbound connections on port 27017

## Quick Fix Commands

1. **Get your EC2 IP:**
```bash
curl -s http://checkip.amazonaws.com
```

2. **Add this IP to MongoDB Atlas Network Access**

3. **Restart your application:**
```bash
pm2 restart server
pm2 logs server --lines 20
```

## Alternative Connection String Format

Make sure your connection string in `.env` is correct:
```
MONGO_DB_URL="mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority"
```

## Troubleshooting

If the issue persists after whitelisting:

1. **Check connection string format**
2. **Verify username/password**
3. **Ensure database name is correct**
4. **Check if cluster is running**
5. **Try connecting from a different location to test credentials**
