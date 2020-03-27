
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
  vdi-project-api
```

## Test Minio Client

```
docker run -ti --rm --entrypoint /bin/bash \
  vdi-project-api

mc config host add s3 "https://minio" "access" "secret"

mc ls s3

mc mb s3 tempbucket --json

```
