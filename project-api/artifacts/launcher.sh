#!/bin/bash -i

mkdir -p ./config

cat > ./config/default.json <<EOF
{
    "logLevel": "${LOG_LEVEL}",
    "apiPort": 5000,
    "apiSecret": "${API_TOKEN}",
    "vault": {
        "addr": "${VAULT_ADDR}",
        "token": "${VAULT_TOKEN}"
    },
    "minio": {
        "addr": "${MINIO_ADDR}",
        "access_key": "${MINIO_ACCESS_KEY}",
        "secret_key": "${MINIO_SECRET_KEY}"
    }
}
EOF

python3 wsgi.py
