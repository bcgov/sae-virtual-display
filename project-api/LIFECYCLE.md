# Lifecycle

1) Self-registration
2) Enable project
3) Add user to project
4) User to launch app
5) Remove user from project
6) Disable project
7) Delete project

# Steps

## Self Registration

https://selfreg.stg.bbsae.xyz/selfserve

## Enable Project

```
export TOKEN=""

export PROJECT=abc
curl https://vdi-admin.stg.bbsae.xyz:8443/v1/projects/$PROJECT \
  -H "x-api-key: $TOKEN" \
  -X POST
```

## Add user to Project

```
export PROJECT="abc"
export USER=acope@popdata
curl https://vdi-admin.stg.bbsae.xyz:8443/v1/membership/$PROJECT/$USER \
  -H "x-api-key: $TOKEN" \
  -X PUT
```

## Notify user and user to launch app

https://hub.stg.bbsae.xyz

### RStudio

* s3 access: s3 ls, s3 cp (datasets, working)
* git
* Spark with Arrow / Plots

### Browser

* single-signon
* gitlab
* ocwa

## Remove user from project

```
curl https://vdi-admin.stg.bbsae.xyz:8443/v1/membership/$PROJECT/$USER \
  -H "x-api-key: $TOKEN" \
  -X DELETE
```

## Disable Project

```
curl https://vdi-admin.stg.bbsae.xyz:8443/v1/projects/$PROJECT \
  -H "x-api-key: $TOKEN" \
  -X DELETE
```

## Fully delete project

```
curl https://vdi-admin.stg.bbsae.xyz:8443/v1/projects/$PROJECT?purge=yes \
  -H "x-api-key: $TOKEN" \
  -X DELETE
```

## Review Audit

https://vdi-admin.stg.bbsae.xyz:8443/admin
