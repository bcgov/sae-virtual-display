#!/bin/bash -i

mkdir -p ./config

cat > ./config/default.json <<EOF
{
    "logLevel": "${LOG_LEVEL}",
    "apiPort": 5000,
    "apiSecret": "${API_TOKEN}",
    "sessionSecret": "${SESSION_TOKEN}",
    "vault": {
        "addr": "${VAULT_ADDR}",
        "token": "${VAULT_TOKEN}"
    },
    "minio": {
        "addr": "${MINIO_ADDR}",
        "access_key": "${MINIO_ACCESS_KEY}",
        "secret_key": "${MINIO_SECRET_KEY}"
    },
    "keycloak": {
        "url": "${KEYCLOAK_URL}",
        "realm": "${KEYCLOAK_REALM}",
        "client_id": "${OAUTH_CLIENT_ID}",
        "client_secret": "${OAUTH_CLIENT_SECRET}",
        "admin_group": "${ADMIN_GROUP}"
    },
    "notification": {
        "enabled": ${NOTIFY_ENABLED},
        "url": "${NOTIFY_URL}",
        "token": "${NOTIFY_TOKEN}"
    }

}
EOF

python3 wsgi.py