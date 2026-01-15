# GitHub Actions Deployment Setup - MicroArray

This document explains how to set up and use the GitHub Actions deployment workflow for the MicroArray application.

## Overview

The deployment workflow (`deploy.yml`) replicates your current Jenkins/Ansible deployment using GitHub Actions with simple SSH-based deployment. **No AWS dependencies required** - just SSH access to your servers.

## Prerequisites

### 1. Server Infrastructure

Your servers must have (matching your Ansible setup):

#### System Dependencies
- Node.js 14.x
- R 4.x with required packages (from microArray-setup.yml)
- System packages: xvfb, wkhtmltopdf, pandoc, etc.
- Apache group for file permissions

#### Directory Structure
```bash
/opt/microarray/              # or your chosen path
├── app/                      # Application files
├── config/                   # Configuration files
│   └── microarray_setting.json
├── backups/                  # Deployment backups
├── data/                     # Application data
├── logs/                     # Application logs
└── temp/                     # Temporary files
```

#### Systemd Services

**Web Service** (`/etc/systemd/system/microarray-web.service`):
```ini
[Unit]
Description=MicroArray Web Service
After=network.target

[Service]
Type=simple
User=ncianalysis
WorkingDirectory=/opt/microarray/app
ExecStart=/usr/bin/node index.js -p 9220 -o microarray.log
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

**Processor Service** (`/etc/systemd/system/microarray-processor.service`):
```ini
[Unit]
Description=MicroArray Processor Service
After=network.target

[Service]
Type=simple
User=ncianalysis
WorkingDirectory=/opt/microarray/app/service
ExecStart=/usr/bin/node microarray_processor.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable services:
```bash
sudo systemctl daemon-reload
sudo systemctl enable microarray-web microarray-processor
```

#### SSH Access & Sudo Permissions

1. Create deploy user (if not exists):
   ```bash
   sudo useradd -m -s /bin/bash ncianalysis
   ```

2. Generate SSH key pair:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f github-actions-key
   ```

3. Add public key to server:
   ```bash
   ssh-copy-id -i github-actions-key.pub ncianalysis@your-server
   ```

4. Configure sudo permissions for service management:
   ```bash
   sudo tee /etc/sudoers.d/microarray << 'EOF'
   ncianalysis ALL=(ALL) NOPASSWD: /bin/systemctl start microarray-*
   ncianalysis ALL=(ALL) NOPASSWD: /bin/systemctl stop microarray-*
   ncianalysis ALL=(ALL) NOPASSWD: /bin/systemctl status microarray-*
   ncianalysis ALL=(ALL) NOPASSWD: /bin/systemctl is-active microarray-*
   ncianalysis ALL=(ALL) NOPASSWD: /usr/bin/journalctl
   ncianalysis ALL=(ALL) NOPASSWD: /bin/chown -R * /opt/microarray/*
   ncianalysis ALL=(ALL) NOPASSWD: /bin/chmod -R * /opt/microarray/*
   EOF
   
   sudo chmod 0440 /etc/sudoers.d/microarray
   ```

5. Set up group permissions:
   ```bash
   sudo usermod -aG apache ncianalysis
   sudo chown -R ncianalysis:apache /opt/microarray
   ```

### 2. GitHub Configuration

#### Repository Secrets

Go to Settings → Secrets and variables → Actions → New repository secret

Store the **private key** you generated:
```
Name: SSH_PRIVATE_KEY
Value: (paste contents of github-actions-key)
```

#### Environments

Create environments in Settings → Environments:

##### **dev** environment
Required secrets:
- `DEPLOY_HOST`: dev-server.yourdomain.com (or IP address)
- `DEPLOY_USER`: ncianalysis
- `DEPLOY_PATH`: /opt/microarray
- `CONFIG_PATH`: /opt/microarray/config

Optional secrets (will use defaults if not set):
- `WEB_SERVICE`: microarray-web
- `PROCESSOR_SERVICE`: microarray-processor

##### **qa** environment
Same secrets as dev, but with qa server values

##### **stage** environment
Same secrets as dev, but with stage server values

##### **prod** environment
Same secrets as dev, but with production server values

**Add protection rules for production:**
- Required reviewers: 1-2 people
- Wait timer: 5 minutes (optional)
- Deployment branches: Only `main` or `master`

### Example: Setting up dev environment

1. Go to Settings → Environments → New environment
2. Name: `dev`
3. Add environment secrets:
   ```
   DEPLOY_HOST = dev-microarray.yourlab.gov
   DEPLOY_USER = ncianalysis
   DEPLOY_PATH = /opt/microarray
   CONFIG_PATH = /opt/microarray/config
   ```

## Usage

### Manual Deployment

1. Go to **Actions** tab in GitHub
2. Select **Deploy** workflow
3. Click **Run workflow**
4. Choose environment (dev/qa/stage/prod)
5. Click **Run workflow** button

### Automatic Deployment

Push to `main` or `master` branch automatically deploys to **dev** environment.

### Workflow Steps

The deployment performs these steps (matching your Ansible flow):

1. **Checkout code** - Gets latest code from repository
2. **Setup SSH** - Configures SSH key for server access
3. **Build backend** - Installs npm dependencies
4. **Build frontend** - Builds React app with `npm run build`
5. **Create package** - Creates deployment tarball
6. **Backup** - Backs up current deployment (kept for 7 days)
7. **Stop services** - Stops microarray-web and microarray-processor
8. **Upload** - Transfers package via SCP
9. **Deploy** - Extracts files, copies config, sets permissions
10. **Start services** - Starts both services
11. **Health check** - Verifies `/ping` endpoint and service status
12. **Verify** - Confirms deployment success

### Monitoring Deployment

Watch progress in the Actions tab:
- ✅ Green checkmark = success
- ❌ Red X = failure
- 🟡 Yellow dot = in progress

Click any step to see detailed logs.

### Rollback

**Automatic**: If deployment fails, workflow automatically restores from latest backup.

**Manual rollback**:
```bash
ssh ncianalysis@your-server

# Find backups
ls -lt /opt/microarray/backups/

# Restore from backup (replace YYYYMMDDHHMMSS with actual timestamp)
sudo systemctl stop microarray-web microarray-processor
cd /opt/microarray
sudo rm -rf app
sudo cp -r backups/YYYYMMDDHHMMSS/app ./
sudo chown -R ncianalysis:apache app
sudo systemctl start microarray-web microarray-processor

# Verify
sudo systemctl status microarray-web microarray-processor
curl http://localhost:9220/ping
```

## Configuration

### Server Configuration File

The workflow expects `microarray_setting.json` at `${CONFIG_PATH}/microarray_setting.json`.

This file is copied during deployment from the config directory to the app directory, matching your Ansible deployment process.

### Service Names

Default service names:
- Web: `microarray-web`
- Processor: `microarray-processor`

To customize, add environment secrets:
- `WEB_SERVICE` = your-web-service-name
- `PROCESSOR_SERVICE` = your-processor-service-name

### Deployment Path

Default: Uses `DEPLOY_PATH` environment secret

Structure created:
```
${DEPLOY_PATH}/
├── app/              # Current deployment
└── backups/          # Timestamped backups
    ├── 20260115120000/
    ├── 20260114150000/
    └── ...
```

## Troubleshooting

### SSH Connection Failed
```
Permission denied (publickey)
```
**Solution**: 
1. Verify SSH_PRIVATE_KEY secret matches public key on server
2. Test manually: `ssh -i github-actions-key ncianalysis@your-server`
3. Check `~/.ssh/authorized_keys` on server

### Build Failed
```
npm ci failed
```
**Solution**:
1. Check `package.json` and `package-lock.json` are committed
2. Verify Node.js version compatibility
3. Check for missing dependencies

### Service Start Failed
```
sudo systemctl start microarray-web failed
```
**Solution**:
1. Check service logs: `sudo journalctl -u microarray-web -n 50`
2. Verify systemd service file exists
3. Check Node.js is installed: `node --version`
4. Verify working directory exists

### Permission Denied
```
chown: Operation not permitted
```
**Solution**:
1. Verify sudo permissions in `/etc/sudoers.d/microarray`
2. Test manually: `sudo systemctl status microarray-web`
3. Check user is in apache group: `groups ncianalysis`

### Health Check Failed
```
❌ Web service health check failed
```
**Solution**:
1. Check port 9220 is accessible: `curl http://localhost:9220/ping`
2. Review application logs in workflow output
3. Verify configuration file was copied
4. Check R packages are installed

### Configuration File Missing
```
Warning: Configuration file not found
```
**Solution**:
1. Verify `microarray_setting.json` exists at `${CONFIG_PATH}/`
2. Check CONFIG_PATH environment secret is correct
3. Ensure file has correct permissions

## Comparison with Jenkins/Ansible Deployment

| Aspect | Jenkins/Ansible | GitHub Actions |
|--------|-----------------|----------------|
| **Trigger** | Manual/Webhook | Push to main or manual |
| **Build Location** | Jenkins server | GitHub-hosted runner |
| **Deployment Method** | Ansible playbook | SSH + shell commands |
| **Configuration** | Ansible vars files | GitHub Environment Secrets |
| **Secrets** | Jenkins credentials | GitHub Secrets (per environment) |
| **Rollback** | Manual | Automatic on failure |
| **Logs** | Jenkins console | GitHub Actions UI |
| **R Package Updates** | Ansible role | Manual (run once on server) |
| **Build Output** | client/www | client/build → www |

## Migration from Jenkins

To migrate from Jenkins to GitHub Actions:

### One-Time Server Setup

1. ✅ Run Ansible setup playbook to install R packages:
   ```bash
   ansible-playbook -i inventory.ini .github/aws/microArray-setup.yml
   ```

2. ✅ Create systemd service files (shown above)

3. ✅ Configure sudo permissions

4. ✅ Set up SSH key for GitHub Actions

### GitHub Setup

5. ✅ Add SSH_PRIVATE_KEY to GitHub repository secrets

6. ✅ Create environment secrets for each tier (dev/qa/stage/prod)

7. ✅ Configure protection rules for production environment

### Testing

8. ✅ Test deployment to dev environment:
   - Go to Actions → Deploy → Run workflow
   - Select "dev"
   - Monitor execution

9. ✅ Verify application is accessible:
   ```bash
   curl http://dev-server:9220/ping
   ```

10. ✅ Check services are running:
    ```bash
    ssh ncianalysis@dev-server
    sudo systemctl status microarray-web microarray-processor
    ```

### Cutover

11. ✅ Deploy to remaining environments (qa, stage, prod)

12. ✅ Update team documentation

13. ✅ Disable Jenkins jobs (keep for rollback initially)

14. ✅ After successful production deployments, archive Jenkins

## Security Considerations

1. **SSH Keys**: 
   - Stored encrypted in GitHub Secrets
   - Unique key per environment recommended
   - Rotate keys periodically

2. **Secrets Management**:
   - Environment-specific secrets isolated
   - Never logged in workflow output
   - Protected in GitHub UI

3. **Backups**:
   - Automatic before each deployment
   - Retained for 7 days
   - Can be restored automatically on failure

4. **Sudo Access**:
   - Limited to specific systemctl commands
   - NOPASSWD only for microarray services
   - Scoped to /opt/microarray path

5. **File Permissions**:
   - Owner: ncianalysis
   - Group: apache
   - Mode: 755 for directories, standard for files

## Support & Maintenance

### Checking Deployment Status
```bash
# View recent deployments
# Go to GitHub → Actions tab

# Check current version on server
ssh ncianalysis@your-server
ls -la /opt/microarray/backups/ | head -5
```

### Updating R Packages
R packages are NOT updated by the workflow. Update them manually on servers:
```bash
# Follow steps from microArray-setup.yml
# Or run the Ansible playbook:
ansible-playbook -i inventory.ini .github/aws/microArray-setup.yml \
  -e "update_microArray_R_package=true" \
  -e "update_l2p_r_package=true"
```

### Viewing Logs
```bash
# Real-time logs
ssh ncianalysis@your-server
sudo journalctl -u microarray-web -f
sudo journalctl -u microarray-processor -f

# Application logs
tail -f /opt/microarray/app/microarray.log
```

### Common Tasks

**Restart services**:
```bash
sudo systemctl restart microarray-web microarray-processor
```

**Check service status**:
```bash
sudo systemctl status microarray-web microarray-processor
```

**View deployment history**:
```bash
ls -lt /opt/microarray/backups/
```

**Test application endpoint**:
```bash
curl http://localhost:9220/ping
```

## Additional Resources

- GitHub Actions Documentation: https://docs.github.com/en/actions
- GitHub Environments: https://docs.github.com/en/actions/deployment/targeting-different-environments
- Systemd Service Management: `man systemd.service`

---

## Quick Reference

### Required GitHub Secrets (per environment)

```
SSH_PRIVATE_KEY (repository secret - shared across all environments)
```

### Required Environment Secrets (per environment: dev/qa/stage/prod)

```
DEPLOY_HOST = your-server-hostname
DEPLOY_USER = ncianalysis
DEPLOY_PATH = /opt/microarray
CONFIG_PATH = /opt/microarray/config
```

### Manual Deployment

GitHub → Actions → Deploy → Run workflow → Select tier → Run

### Check Status

```bash
ssh ncianalysis@your-server "sudo systemctl status microarray-web microarray-processor"
```

## Overview

The deployment workflow (`deploy.yml`) is based on the ECS Fargate template structure but adapted for SSH-based deployment to EC2 instances, matching your current Jenkins/Ansible deployment approach.

## Prerequisites

### 1. AWS Infrastructure

#### IAM Role
- **Role Name**: `github-actions-cicd`
- **Permissions Required**:
  - `ssm:GetParameter` (to retrieve configuration from Parameter Store)
  - Trust relationship with GitHub OIDC provider

#### SSM Parameters
Store configuration in AWS Systems Manager Parameter Store at:
`/analysistools/{tier}/microarray/*`

Required parameters:
- `deploy_host` - EC2 instance hostname or IP
- `deploy_user` - SSH username (e.g., `ncianalysis`)
- `deploy_path` - Application deployment path (e.g., `/opt/microarray`)
- `config_path` - Configuration files path (e.g., `/opt/microarray/config`)
- `ssh_private_key` - SSH private key (SecureString type)
- `web_service_name` - Systemd service name (default: `microarray-web`)
- `processor_service_name` - Systemd service name (default: `microarray-processor`)
- `backup_retention_days` - Backup retention in days (default: 7)

Example using AWS CLI:
```bash
# Set tier (dev, qa, stage, prod)
TIER=dev

# Store parameters
aws ssm put-parameter \
  --name "/analysistools/${TIER}/microarray/deploy_host" \
  --value "microarray-${TIER}.example.com" \
  --type String

aws ssm put-parameter \
  --name "/analysistools/${TIER}/microarray/deploy_user" \
  --value "ncianalysis" \
  --type String

aws ssm put-parameter \
  --name "/analysistools/${TIER}/microarray/deploy_path" \
  --value "/opt/microarray" \
  --type String

aws ssm put-parameter \
  --name "/analysistools/${TIER}/microarray/config_path" \
  --value "/opt/microarray/config" \
  --type String

aws ssm put-parameter \
  --name "/analysistools/${TIER}/microarray/ssh_private_key" \
  --value "file://path/to/private-key.pem" \
  --type SecureString
```

### 2. EC2 Instance Setup

Your EC2 instances must have:

#### System Dependencies
- Node.js 14.x
- R and R packages (from microArray-setup.yml)
- System packages: xvfb, wkhtmltopdf, pandoc, etc.
- Apache or nginx (for web serving)

#### Directory Structure
```bash
/opt/microarray/
├── app/           # Application files
├── config/        # Configuration files
│   └── microarray_setting.json
├── backups/       # Deployment backups
├── data/          # Application data
├── logs/          # Application logs
└── temp/          # Temporary files
```

#### Systemd Services

**Web Service** (`/etc/systemd/system/microarray-web.service`):
```ini
[Unit]
Description=MicroArray Web Service
After=network.target

[Service]
Type=simple
User=ncianalysis
WorkingDirectory=/opt/microarray/app
ExecStart=/usr/bin/node index.js -p 9220 -o microarray.log
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

**Processor Service** (`/etc/systemd/system/microarray-processor.service`):
```ini
[Unit]
Description=MicroArray Processor Service
After=network.target

[Service]
Type=simple
User=ncianalysis
WorkingDirectory=/opt/microarray/app/service
ExecStart=/usr/bin/node microarray_processor.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable services:
```bash
sudo systemctl daemon-reload
sudo systemctl enable microarray-web microarray-processor
```

#### SSH Access
1. Create SSH key pair:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f github-actions-key
   ```

2. Add public key to EC2 instance:
   ```bash
   ssh-copy-id -i github-actions-key.pub ncianalysis@your-host
   ```

3. Store private key in SSM Parameter Store (see above)

#### Permissions
```bash
sudo useradd -m -s /bin/bash ncianalysis
sudo usermod -aG wheel ncianalysis

# Allow service management without password
echo "ncianalysis ALL=(ALL) NOPASSWD: /bin/systemctl start microarray-*" | sudo tee /etc/sudoers.d/microarray
echo "ncianalysis ALL=(ALL) NOPASSWD: /bin/systemctl stop microarray-*" | sudo tee -a /etc/sudoers.d/microarray
echo "ncianalysis ALL=(ALL) NOPASSWD: /bin/systemctl status microarray-*" | sudo tee -a /etc/sudoers.d/microarray
echo "ncianalysis ALL=(ALL) NOPASSWD: /bin/journalctl" | sudo tee -a /etc/sudoers.d/microarray
sudo chmod 0440 /etc/sudoers.d/microarray
```

### 3. GitHub Configuration

#### Repository Secrets
Go to Settings → Secrets and variables → Actions → Repository secrets:

- `AWS_ACCOUNT_ID` - Your AWS account ID (12 digits)

#### Environments
Create environments in Settings → Environments:
- `dev`
- `qa`
- `stage`
- `prod`

For production, add:
- **Required reviewers**: 1-2 people
- **Wait timer**: 5-10 minutes
- **Deployment branches**: Only `main` or `master`

## Usage

### Manual Deployment

1. Go to **Actions** tab in GitHub
2. Select **Deploy** workflow
3. Click **Run workflow**
4. Choose environment (dev/qa/stage/prod)
5. Click **Run workflow** button

### Workflow Steps

The deployment workflow performs these steps:

1. **Checkout code** - Gets latest code from repository
2. **Configure AWS** - Assumes IAM role via OIDC
3. **Set environment variables** - Extracts version/date from branch name
4. **Retrieve SSM parameters** - Gets deployment configuration from AWS
5. **Setup Node.js** - Installs Node.js 14.x
6. **Install dependencies** - Installs backend and frontend npm packages
7. **Build frontend** - Builds React application
8. **Prepare package** - Creates deployment tarball
9. **Test SSH** - Verifies SSH connection to server
10. **Backup** - Creates backup of current deployment
11. **Stop services** - Stops web and processor services
12. **Upload package** - Transfers deployment package via SCP
13. **Deploy** - Extracts files and configures application
14. **Start services** - Starts web and processor services
15. **Health checks** - Verifies services are responding
16. **Verify deployment** - Confirms successful deployment

### Monitoring Deployment

Watch deployment progress in the Actions tab. Each step shows:
- ✅ Green checkmark for success
- ❌ Red X for failure
- 🟡 Yellow dot for in progress

Click on any step to see detailed logs.

### Rollback

If deployment fails, the workflow automatically:
1. Attempts to restore from latest backup
2. Restarts services
3. Reports rollback status

For manual rollback:
```bash
ssh ncianalysis@your-host

# Find backups
ls -lt /opt/microarray/backups/

# Restore from backup
sudo systemctl stop microarray-web microarray-processor
cd /opt/microarray
rm -rf app
cp -r backups/YYYYMMDD_HHMMSS/app ./
sudo systemctl start microarray-web microarray-processor
```

## Customization

### Branch Naming Convention

The workflow extracts version/date from branch name:
```
feature_v1.2.0_2026-01-15
        ^^^^^^ ^^^^^^^^^^
        version   date
```

To customize, modify lines 53-55 in `deploy.yml`:
```yaml
VERSION=$(echo "$BRANCH_NAME" | awk -F'_' '{print $2}')
DATE=$(echo "$BRANCH_NAME" | awk -F'_' '{print $3}')
```

### SSM Parameter Path

Default: `/analysistools/{tier}/microarray/*`

To change, update line 77 in `deploy.yml`:
```yaml
echo "PARAMETER_PATH=/yourpath/${TIER}/${APP}" >> $GITHUB_ENV
```

### Service Names

Default services:
- `microarray-web`
- `microarray-processor`

To customize, update in SSM parameters or modify defaults at lines 110-115.

### Backup Retention

Default: 7 days

To change, update SSM parameter:
```bash
aws ssm put-parameter \
  --name "/analysistools/${TIER}/microarray/backup_retention_days" \
  --value "14" \
  --type String
```

### Health Check Endpoints

Default: `http://localhost:9220/ping`

To customize, modify line 244-252 in `deploy.yml`.

## Troubleshooting

### SSH Connection Failed
```
Permission denied (publickey)
```
**Solution**: Verify SSH key is correct in SSM Parameter Store and public key is on server.

### Service Start Failed
```
❌ Web service health check failed
```
**Solution**: 
1. Check service logs on server:
   ```bash
   sudo journalctl -u microarray-web -n 50
   ```
2. Verify configuration file exists
3. Check Node.js version compatibility

### Health Check Failed
```
❌ Web service health check failed
```
**Solution**:
1. Verify port 9220 is accessible
2. Check application logs for errors
3. Ensure all dependencies are installed

### Deployment Package Upload Failed
```
scp: permission denied
```
**Solution**: 
1. Verify deploy user has write permissions to /tmp
2. Check disk space on server: `df -h`

### SSM Parameter Not Found
```
An error occurred (ParameterNotFound)
```
**Solution**: Create missing parameters in AWS Systems Manager Parameter Store.

## Comparison with Jenkins Deployment

| Aspect | Jenkins/Ansible | GitHub Actions |
|--------|-----------------|----------------|
| Trigger | Manual/Webhook | Manual workflow dispatch |
| Build Location | Jenkins server | GitHub-hosted runner |
| Deployment Method | Ansible playbook | SSH + shell commands |
| Configuration | Ansible vars | AWS SSM Parameters |
| Secrets | Jenkins credentials | AWS SSM + GitHub OIDC |
| Rollback | Manual | Automatic on failure |
| Logs | Jenkins console | GitHub Actions UI |

## Security Considerations

1. **SSH Keys**: Stored encrypted in AWS SSM Parameter Store
2. **AWS Credentials**: Uses OIDC (no long-lived credentials)
3. **Secrets**: Never logged or exposed in workflow output
4. **Backups**: Automatic before each deployment
5. **Service Management**: Limited sudo permissions via `/etc/sudoers.d/`

## Support

For issues or questions:
1. Check workflow logs in Actions tab
2. Review SSM parameters are correctly configured
3. Verify EC2 instance setup matches prerequisites
4. Check service logs on server: `sudo journalctl -u microarray-web -n 100`

## Migration from Jenkins

To migrate from Jenkins to GitHub Actions:

1. ✅ Run Ansible setup playbook once on EC2 instances (microArray-setup.yml)
2. ✅ Create SSM parameters with current deployment configuration
3. ✅ Store SSH key in SSM Parameter Store
4. ✅ Test deployment to dev environment
5. ✅ Verify health checks pass
6. ✅ Configure production environment with approval gates
7. ✅ Gradually phase out Jenkins deployments

The GitHub Actions workflow replicates your current Jenkins/Ansible deployment process while providing better integration with your GitHub repository and AWS infrastructure.
