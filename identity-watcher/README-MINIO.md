# Minio

## Verifying the Secure Token Service functionality

### Start the Minio Server

```
export MINIO_ACCESS_KEY=757TMJBEXPMG5IEQ55CG
export MINIO_SECRET_KEY=T8WqClCl6+mB3Bb2zVNvIpJVvCv/Cz3nWmPO3zmAMis
export MINIO_IDENTITY_OPENID_CLIENT_ID="minio"
export MINIO_IDENTITY_OPENID_CLIENT_SECRET="fa91fb6b-6cde-4064-9aa5-092d66da0626"
export MINIO_IDENTITY_OPENID_CONFIG_URL=https://authstg.popdata.bc.ca/auth/realms/sample/.well-known/openid-configuration

docker run -ti --rm \
  -p 9000:9000 \
  -e MINIO_ACCESS_KEY \
  -e MINIO_SECRET_KEY \
  -e MINIO_IDENTITY_OPENID_CLIENT_ID \
  -e MINIO_IDENTITY_OPENID_CLIENT_SECRET \
  -e MINIO_IDENTITY_OPENID_CONFIG_URL \
  -v `pwd`/_tmp/minio:/home/shared \
  minio/minio:RELEASE.2020-01-25T02-50-51Z server /home/shared

  minio/minio:RELEASE.2020-01-25T02-50-51Z server /home/shared
```

### Configure the Minio Server to accept JWT tokens for 'assume-role-with-web-identity'

```
docker run -ti --rm --entrypoint /bin/sh minio/mc:latest

mc config host add myminio http://20.20.20.20:9000 757TMJBEXPMG5IEQ55CG T8WqClCl6+mB3Bb2zVNvIpJVvCv/Cz3nWmPO3zmAMis
mc admin config get myminio identity_openid

mc admin config set myminio identity_openid config_url=https://authstg.popdata.bc.ca/auth/realms/sample/.well-known/openid-configuration client_id=minio claim_name=minio_policy jwks_url=https://authstg.popdata.bc.ca/auth/realms/sample/protocol/openid-connect/certs
mc admin service restart myminio

```

### Create custom policies

```
cat > readaccess_dataset_1.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::dataset-1"
      ],
      "Sid": ""
    },
    {
      "Action": [
        "s3:GetObject",
        "s3:GetBucketLocation"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::dataset-1/*"
      ],
      "Sid": ""
    }
  ]
}
EOF

mc admin policy add myminio dataset_1_ro readaccess_dataset_1.json

mc admin policy list myminio
```

### Configure a user with the appropriate policy

In the OIDC Provider mappers for the "minio" client, ensure a claim is added that includes the policy as "minio_policy".

```
Update 'Claim Value' to 'dataset_1_ro'
```

### Generate a JWT Token from the OIDC Provider

```
export USERNAME=""
export PASSWORD=""
export CLIENT_ID=minio
export CLIENT_SECRET=fa91fb6b-6cde-4064-9aa5-092d66da0626
export OAUTH_TOKEN=https://authstg.popdata.bc.ca/auth/realms/sample/protocol/openid-connect/token

export RESULT=`curl -k --data "grant_type=password&client_secret=${CLIENT_SECRET}&client_id=${CLIENT_ID}&username=${USERNAME}&password=${PASSWORD}" ${OAUTH_TOKEN}`
```

### Generate temporary credentials to Minio using the JWT

```
export JWT_TOKEN=""
export S3_ENDPOINT=http://20.20.20.20:9000
aws2 sts assume-role-with-web-identity --endpoint $S3_ENDPOINT --role-arn "00000-00000-00000-00000" --role-session-name "0000" --web-identity-token $JWT_TOKEN
```

### Use the credentials to access the S3 bucket

```
export AWS_ACCESS_KEY_ID="I08BCX2JJV45ED1DOC9J"
export AWS_SECRET_ACCESS_KEY="0qk+o7XctJMmG6ydO8th7c9+TofLJU1K0PiVBXSg"
export AWS_SESSION_TOKEN="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJJMDhCQ1gySkpWNDVFRDFET0M5SiIsImFjciI6IjEiLCJhdWQiOiJhY2NvdW50IiwiYXV0aF90aW1lIjowLCJhenAiOiJtaW5pbyIsImVtYWlsIjoiYWlkYW4uY29wZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImV4cCI6MTU4MDUwMDIzOCwiZmFtaWx5X25hbWUiOiJDb3BlIiwiZ2l2ZW5fbmFtZSI6IkFpZGFuIENvcGUiLCJpYXQiOjE1ODA0OTk5MzgsImlzcyI6Imh0dHBzOi8vYXV0aHN0Zy5wb3BkYXRhLmJjLmNhL2F1dGgvcmVhbG1zL3NhbXBsZSIsImp0aSI6IjU5ZTM5ODAxLWQxMmUtNDVhYS04NmQzLWVhMmNmZDU0NmE2MiIsIm1pbmlvX3BvbGljeSI6ImRhdGFzZXRfMV9ybyIsIm5hbWUiOiJBaWRhbiBDb3BlIENvcGUiLCJuYmYiOjAsInByZWZlcnJlZF91c2VybmFtZSI6ImFjb3BlLTk5LXQwNSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwic2Vzc2lvbl9zdGF0ZSI6IjcxYjczZWJjLThlMzMtNGMyMi04NmE2LWI0MzhhNDM4ZmI2MiIsInN1YiI6IjVkOTBlOTgzLTA1NDItNDYyYS1hZWIwLWYxZWVmNjcwYzdlNSIsInR5cCI6IkJlYXJlciJ9.J-a9PORJToz7MUrnPQlOywcqtVMNkXy1pGedp_V4PW-Gbf1_BAMjwuw_X7fKRd6hkNfEn43CKKju7muzi_d1Ig"

aws2 s3 --endpoint $S3_ENDPOINT ls
aws2 s3 --endpoint $S3_ENDPOINT ls dataset-1
aws2 s3 --endpoint $S3_ENDPOINT cp s3://dataset-1/sample.txt sample.txt
```
