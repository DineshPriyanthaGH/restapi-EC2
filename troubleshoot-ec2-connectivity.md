# Fix EC2 Connectivity Issues for GitHub Actions Runner

## Problem
```
curl: (28) Failed to connect to github.com port 443 after 132678 ms: Couldn't connect to server
```

## Solution Steps

### 1. Check Security Group Settings (Most Common Issue)

**In AWS Console:**
1. Go to EC2 Dashboard → Instances
2. Select your EC2 instance
3. Click on "Security" tab
4. Check the **Outbound rules** of your Security Group
5. Ensure you have these outbound rules:

```
Type: HTTPS
Protocol: TCP
Port Range: 443
Destination: 0.0.0.0/0 (or Anywhere-IPv4)

Type: HTTP
Protocol: TCP
Port Range: 80
Destination: 0.0.0.0/0 (or Anywhere-IPv4)

Type: DNS (UDP)
Protocol: UDP
Port Range: 53
Destination: 0.0.0.0/0
```

### 2. Test Basic Connectivity

Run these commands on your EC2 instance:

```bash
# Test DNS resolution
nslookup github.com

# Test ping (may not work if ICMP is blocked)
ping -c 4 github.com

# Test specific port connectivity
telnet github.com 443

# Alternative port test
nc -zv github.com 443

# Test with curl verbose mode
curl -v https://github.com

# Check if you can reach any HTTPS site
curl -v https://www.google.com
```

### 3. Check Network ACLs

1. In AWS Console → VPC → Network ACLs
2. Find the Network ACL associated with your subnet
3. Check **Outbound Rules**:
   - Rule for HTTP (port 80) - Allow
   - Rule for HTTPS (port 443) - Allow
   - Rule for DNS (port 53) - Allow

### 4. Verify Subnet and Route Table

```bash
# Check your instance's network configuration
ip route show
cat /etc/resolv.conf
```

Ensure your subnet has:
- Route to Internet Gateway (0.0.0.0/0 → igw-xxxxxx)
- Proper DNS servers (usually 169.254.169.253 for AWS)

### 5. Check Local Firewall (Ubuntu)

```bash
# Check if UFW is active
sudo ufw status

# Check iptables rules
sudo iptables -L -n

# If firewall is blocking, temporarily disable for testing
sudo ufw disable
# Or allow specific outbound connections
sudo ufw allow out 443
sudo ufw allow out 80
sudo ufw allow out 53
```

### 6. Test with Different Methods

Try downloading the runner package using different approaches:

```bash
# Method 1: Direct wget
wget https://github.com/actions/runner/releases/download/v2.326.0/actions-runner-linux-x64-2.326.0.tar.gz

# Method 2: curl with different options
curl -L -v --connect-timeout 30 --max-time 300 https://github.com/actions/runner/releases/download/v2.326.0/actions-runner-linux-x64-2.326.0.tar.gz -o actions-runner-linux-x64-2.326.0.tar.gz

# Method 3: Try with IPv4 only
curl -4 -L https://github.com/actions/runner/releases/download/v2.326.0/actions-runner-linux-x64-2.326.0.tar.gz -o actions-runner-linux-x64-2.326.0.tar.gz
```

### 7. Alternative Download Method

If direct download fails, you can:

1. Download the file on your local machine
2. Upload to EC2 using SCP:

```bash
# From your local machine
scp -i your-key.pem actions-runner-linux-x64-2.326.0.tar.gz ubuntu@your-ec2-ip:~/actions-runner6/
```

### 8. Check Proxy Settings

```bash
# Check if proxy is configured
echo $http_proxy
echo $https_proxy
echo $HTTP_PROXY
echo $HTTPS_PROXY

# If proxy is set but incorrect, unset it
unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
```

## Quick Fix Commands

Run these commands in sequence on your EC2:

```bash
# 1. Update system
sudo apt update

# 2. Install network tools if not present
sudo apt install -y curl wget telnet netcat-openbsd

# 3. Test GitHub connectivity
curl -I https://github.com

# 4. If that works, try downloading again
cd ~/actions-runner6
curl -o actions-runner-linux-x64-2.326.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.326.0/actions-runner-linux-x64-2.326.0.tar.gz
```

## Most Likely Solution

**99% of the time, this is a Security Group issue.** Ensure your EC2 instance's Security Group allows outbound HTTPS traffic:

1. AWS Console → EC2 → Security Groups
2. Select your instance's security group
3. Outbound rules → Add rule:
   - Type: HTTPS
   - Port: 443
   - Destination: 0.0.0.0/0

## Stack Overflow Response Format

**Problem:** Unable to download GitHub Actions runner on AWS EC2 Ubuntu instance due to "Failed to connect to github.com port 443" error.

**What I tried:** Attempted to download the actions runner using curl but consistently get connection timeouts to github.com on port 443.

**Expected:** Successfully download the GitHub Actions runner package to set up self-hosted runner.

**Solution:** This is typically a Security Group configuration issue. Check that your EC2 instance's Security Group allows outbound HTTPS traffic on port 443.

**Tags:** aws-ec2, github-actions, ubuntu, networking, security-groups
