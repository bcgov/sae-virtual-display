# Virtual Display Identity Watcher

The `Identity Watcher` will watch the expiry of the user's Client Certificate, and refresh using the user's JWT.

## Installation

```
docker build . -t vdi-identity-watcher
docker tag vdi-identity-watcher ikethecoder/vdi-identity-watcher:0.8.2.1
docker tag vdi-identity-watcher ikethecoder/vdi-identity-watcher:latest
docker push ikethecoder/vdi-identity-watcher

```

## Environment Variables


| Name | Description |
| ------------- |:-------------|
|  JWT | JSON object containing: access_token, expires_on, refresh_expires_on, refresh_token, token_type, session_state, scope |
|  USER_PROJECT_ID | A unique identifier for the user for a particular project |
|  CLIENT_ID | OIDC client ID used for refreshing the JWT token |
|  CLIENT_SECRET | OIDC client Secret used for refreshing the JWT token  |
|  CA_CHAIN_URI | The CA chain used for securing Minio in the cluster. |
|  VAULT_ADDR | The URL to access Vault  |
|  MINIO_ADDR | The URL for accessing Minio |
|  MINIO_ACCESS_KEY_ID | Temporarily needed until AssumeRoleWithWebIdentity is supported in Minio |
|  MINIO_SECRET_ACCESS_KEY | Temporarily needed until AssumeRoleWithWebIdentity is supported in Minio |


## Testing

```
docker run -ti --rm vdi-identity-watcher 
```