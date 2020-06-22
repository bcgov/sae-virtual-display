
# Project API

An API for enabling a new project on the BBSAE.

Integrations:
1) Configuring Vault (Adding a Policy in Vault for allowing Certificates to be issued)
2) Configuring access to Minio (Project Policy, Project Group)

## Build

```
docker build --tag vdi-project-api .

```

## Locally Running

```
docker run -ti --rm \
  -p 5000:5000 \
  -e LOG_LEVEL=debug \
  -e API_TOKEN=s3cr3t \
  -e VAULT_ADDR=http://vault:8200 \
  -e VAULT_TOKEN="" \
  -e MINIO_ADDR=https://minio \
  -e MINIO_ACCESS_KEY="" \
  -e MINIO_SECRET_KEY="" \
  -e KEYCLOAK_URL="" \
  -e KEYCLOAK_REALM="" \
  -e KEYCLOAK_REALM_INTERNAL="" \
  -e OAUTH_CLIENT_ID="" \
  -e OAUTH_CLIENT_SECRET="" \
  -e NOTIFY_ENABLED=false \
  -e NOTIFY_URL="" \
  -e NOTIFY_TOKEN="" \
  -e KEYCLOAK_USERNAME="" \
  -e KEYCLOAK_PASSWORD="" \
  -e GROUP_EXCLUSIONS="[\"bbsae-admin\"]" \
  -e HUB_REDIRECT_URL="https://hub.stg.bbsae.xyz" \
  -e SMTP_SERVER="" \
  -e SMTP_FROM="" \
  -e REQUESTS_NOTIFY_EMAIL="" \
  -e RECORDER_URL="" \
  vdi-project-api

curl http://localhost:5000/v1/projects -H "x-api-key: s3cr3t"

curl http://localhost:5000/v1/projects/99-t05 -H "x-api-key: s3cr3t" -X POST
curl http://localhost:5000/v1/projects/99-t06 -H "x-api-key: s3cr3t" -X POST

curl http://localhost:5000/v1/events -H "x-api-key: s3cr3t" -H "Content-Type: application/json" -d '{"action":"bbsae_login", "actor":"acope-99-t05", "success":false, "project":"99-t05", "message":"User login failed"}'

curl http://localhost:5000/v1/membership/bill -H "x-api-key: s3cr3t" -H "Content-Type: application/json" -d '{"email":"","first_name":"", "last_name":"", "project":"/99-t05"}' -X PUT

curl http://localhost:5000/v1/internalusers/bill -H "x-api-key: s3cr3t" -H "Content-Type: application/json" -d '{"email":"","first_name":"", "last_name":"", "groups":["99-t05","exporterstg"]}' -X PUT

curl http://localhost:5000/v1/internalusers/bill -H "x-api-key: s3cr3t" -X DELETE

curl http://localhost:5000/v1/membership/99-t05/acope@popdata -H "x-api-key: s3cr3t" -X PUT
curl http://localhost:5000/v1/membership/exporterstg/acope@popdata -H "x-api-key: s3cr3t" -X PUT

curl https://vdi-admin.stg.bbsae.xyz:8443/v1/membership/99-t05/acope@popdata -H "x-api-key: pS0r5QY9OIVlWIAfjqyxmWg9lg3a0bVD5YUUr9XwWxoaoxSQMyAcP80gPqc8owyi" -X PUT

```


## Test Minio Client

```
docker run -ti --rm --entrypoint /bin/bash \
  vdi-project-api

mc config host add s3 "https://minio" "access" "secret"

mc ls s3

mc mb s3 tempbucket --json

```

## Test Package Management Approval

```
echo '
{
  "commit_sha": "323432432"
}
' > released.json
vault kv put secret/bbsae/applications_released @released.json

echo '
{
  "commit_sha": "323432432",
  "requestor": "aidan",
  "comparison": "a git diff output from last released",
  "approval_callback_url": "https://bbsae-approval-listener.stg.bbsae.xyz?code=324324324132132121"
}
' > request.json

vault kv put secret/bbsae/applications_request @request.json

vault kv get -format=json -field=data secret/bbsae/application_request

```
