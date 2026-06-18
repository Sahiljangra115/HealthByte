# Deploy to AWS Lambda (free tier, container image)

Same shape as Y1. Free for demo traffic; the trade-off is cold-start latency.
The time-series DB is SQLite-in-image for the pure MVP, then a free managed
Postgres (Neon or Supabase) when you want persistence across cold starts.

## 0. Prerequisites
- AWS CLI configured, an ECR repo, an IAM role using `iam-policy.json`.
- `export AWS_REGION=us-east-1` and `export ACCOUNT=<id>`.

## 1. Build
```bash
docker build -t y2-health-nutrition .
```

## 2. Push to ECR
```bash
aws ecr get-login-password --region $AWS_REGION \
  | docker login --username AWS --password-stdin $ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com
aws ecr create-repository --repository-name y2-health-nutrition || true
docker tag y2-health-nutrition:latest $ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/y2-health-nutrition:latest
docker push $ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/y2-health-nutrition:latest
```

## 3. Create the function
```bash
aws lambda create-function \
  --function-name y2-health-nutrition \
  --package-type Image \
  --code ImageUri=$ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/y2-health-nutrition:latest \
  --role arn:aws:iam::$ACCOUNT:role/y2-health-role \
  --memory-size 2048 --timeout 30
```

## 4. Public URL
```bash
aws lambda create-function-url-config --function-name y2-health-nutrition --auth-type NONE
```

## 5. Persistence
For the MVP, SQLite lives in the image and resets on redeploy. For real
persistence, create a free Neon/Supabase Postgres and pass its connection string
as a Lambda env var (or Secrets Manager). Put the ONNX food model and the
population model in S3, loaded to `/tmp` on cold start.

## 6. Smoke test
```bash
curl -s "$FUNCTION_URL/health"
curl -s -X POST "$FUNCTION_URL/consent" -H 'content-type: application/json' \
  -d '{"user_id":"demo","consent":true}'
```
