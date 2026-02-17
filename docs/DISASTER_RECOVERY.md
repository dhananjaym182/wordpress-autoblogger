# Disaster Recovery Plan

## Recovery Objectives

- **Recovery Time Objective (RTO):** 4 hours
- **Recovery Point Objective (RPO):** 1 hour

## Backup Strategy

### Database Backups
- **Frequency:** Daily at 2:00 AM UTC
- **Retention:** 
  - 30 daily backups
  - 12 weekly backups
  - 12 monthly backups
- **Storage:** AWS S3 (cross-region replication to us-east-1 and us-west-2)
- **Encryption:** AES-256 server-side encryption

### Content Backups
- **Frequency:** Continuous (S3 versioning)
- **Storage:** Cloudflare R2 with replication to AWS S3
- **Retention:** Indefinite with versioning

### Code Backups
- **Repository:** GitHub (distributed across multiple regions)
- **Branches:** Protected main branch with required reviews

## Recovery Procedures

### Scenario 1: Database Failure

```bash
# 1. Stop all application instances
vercel --version # Check deployment status
# Pause deployments through Vercel dashboard

# 2. Provision new database instance
# Railway/Render dashboard - create new PostgreSQL instance

# 3. Restore from latest backup
export DATABASE_URL="postgresql://..." # New database URL
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export BACKUP_BUCKET="autoblogger-backups"

# Download and restore latest backup
aws s3 cp s3://$BACKUP_BUCKET/database/latest.sql.gz /tmp/
gunzip -c /tmp/latest.sql.gz | psql $DATABASE_URL

# 4. Run database migrations if needed
cd apps/web
npx prisma migrate deploy

# 5. Update environment variables with new database URL
# Vercel dashboard or CLI: vercel env add DATABASE_URL

# 6. Redeploy applications
vercel --prod

# 7. Verify data integrity
npm run backup:verify

# 8. Monitor for errors
# Check Sentry, application logs
```

### Scenario 2: Application Failure

```bash
# 1. Identify failed component
# Check Vercel deployment logs, Sentry errors

# 2. Roll back to previous deployment
vercel rollback

# 3. Monitor error rates
# Sentry dashboard, Vercel analytics

# 4. Investigate root cause
# Review recent commits, dependency changes

# 5. Apply fix and redeploy
# Fix issue in feature branch
# Create PR, review, merge to main
# Deploy via CI/CD
```

### Scenario 3: Redis Failure

```bash
# 1. Redis is ephemeral - no data loss expected
# Job queue will temporarily stop processing

# 2. Provision new Redis instance
# Railway/Render dashboard - create new Redis instance

# 3. Update environment variables
# Update REDIS_URL in Vercel and Railway

# 4. Restart worker service
# Railway dashboard or CLI

# 5. Queue will resume processing automatically
# BullMQ handles reconnection
```

### Scenario 4: Storage (S3/R2) Failure

```bash
# 1. Enable failover to backup region
# Update CDN origin to us-west-2 backup bucket

# 2. Update application configuration
export R2_BUCKET="autoblogger-backup-west"
export CDN_URL="https://backup-cdn.autoblogger.com"

# 3. Redeploy with new configuration
vercel --prod

# 4. Monitor for upload/download issues
# Check application logs

# 5. Initiate recovery of primary region
# Contact Cloudflare/AWS support if needed
```

### Scenario 5: Complete Region Failure

```bash
# 1. Activate DR region
# Update DNS to point to DR region

# 2. Restore database from backup
# Use backup from us-west-2 (if primary was us-east-1)

# 3. Deploy applications to DR region
# Vercel: Update production deployment region
# Railway: Deploy worker to us-west-2

# 4. Update environment variables for DR
# Database, Redis, Storage endpoints

# 5. Verify all services operational
# Health checks, smoke tests

# 6. Notify users of potential data loss window
# Status page update, email notification

# 7. Monitor closely for 24 hours
# Increased Sentry alerting
```

## Testing Procedures

### Monthly: Database Restore Test
```bash
# 1. Create test environment
docker-compose -f docker-compose.test.yml up -d

# 2. Run backup verification
npm run backup:verify

# 3. Validate data integrity
# Run data consistency checks

# 4. Document results
# Update recovery time metrics
```

### Quarterly: Full DR Drill
1. Schedule maintenance window
2. Simulate region failure
3. Execute DR procedures
4. Measure recovery time
5. Document lessons learned
6. Update procedures

### Annually: Complete Failover Test
1. Full production failover to DR
2. Run production traffic through DR
3. Fail back to primary
4. Validate no data loss

## Contact Information

| Role | Contact | Availability |
|------|---------|--------------|
| On-Call Engineer | oncall@autoblogger.com | 24/7 |
| Database Admin | dba@autoblogger.com | Business hours |
| Infrastructure Lead | infra@autoblogger.com | Business hours |

## External Dependencies

| Service | Provider | Support Contact | Status Page |
|---------|----------|-----------------|-------------|
| Hosting (Web) | Vercel | support@vercel.com | status.vercel.com |
| Hosting (Worker) | Railway | support@railway.app | status.railway.app |
| Database | Railway | support@railway.app | status.railway.app |
| Redis | Railway | support@railway.app | status.railway.app |
| Storage | Cloudflare R2 | support@cloudflare.com | cloudflarestatus.com |
| Storage (Backup) | AWS S3 | AWS Support | status.aws.amazon.com |
| Auth | Better Auth | GitHub Issues | - |
| Monitoring | Sentry | support@sentry.io | status.sentry.io |
| Analytics | PostHog | support@posthog.com | status.posthog.com |

## Post-Incident Review

After any disaster recovery event:

1. **Timeline Documentation**
   - When issue was detected
   - Actions taken and timestamps
   - Resolution time

2. **Root Cause Analysis**
   - What caused the failure
   - Why it wasn't prevented
   - Similar vulnerabilities

3. **Improvement Actions**
   - Process improvements
   - Infrastructure changes
   - Monitoring enhancements

4. **Update This Plan**
   - Revise procedures based on learnings
   - Update contact information
   - Refresh recovery time estimates

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2024-01-01 | Initial | Created disaster recovery plan |
