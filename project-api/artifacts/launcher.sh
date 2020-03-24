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
    "oauth": {
        "url": "${KEYCLOAK_URL}",
        "realm": "${KEYCLOAK_REALM}",
        "client_id": "${OAUTH_CLIENT_ID}",
        "client_secret": "${OAUTH_CLIENT_SECRET}",
        "admin_group": "${ADMIN_GROUP}"
    },
    "keycloak": {
        "url": "${KEYCLOAK_URL}",
        "realm": "${KEYCLOAK_REALM}",
        "username": "${KEYCLOAK_USERNAME}",
        "password": "${KEYCLOAK_PASSWORD}"
    },
    "kc_internal": {
        "url": "${KEYCLOAK_INTERNAL_URL}",
        "realm": "${KEYCLOAK_INTERNAL_REALM}",
        "username": "${KEYCLOAK_INTERNAL_USERNAME}",
        "password": "${KEYCLOAK_INTERNAL_PASSWORD}"
    },
    "notification": {
        "enabled": ${NOTIFY_ENABLED},
        "url": "${NOTIFY_URL}",
        "token": "${NOTIFY_TOKEN}"
    },
    "group_exclusions": [${GROUP_EXCLUSIONS}]

}
EOF

python3 wsgi.py
