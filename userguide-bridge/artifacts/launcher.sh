#!/bin/bash -i

mkdir -p ./config

cat > ./config/production.json <<EOF
{
  "host": "${HELP_API_HOST}",
  "port": 8000,
  "token": "${HELP_API_TOKEN}",
  "logLevel": "prod",
  "morganFormat": "combined",
  "whitelist": ["${HUB_HOST}"]
}
EOF

npm run start:prod
