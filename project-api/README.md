
# Project API

An API for enabling a new project on the BBSAE.

Integrations:
1) Configuring Vault (Adding a Policy in Vault for allowing Certificates to be issued)
2) Configuring access to Minio (Project Policy, Project Group)

## Build

```
docker build --tag vdi-project-api .

docker run -ti --rm \
  -p 5000:5000 \
  -e LOG_LEVEL=debug \
  -e API_TOKEN=s3cr3t \
  vdi-project-api
```
