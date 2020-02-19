# Virtual Display HUB

## Installation

### Prerequisites

- Vault 1.2.3 or newer
- Docker 18.09.1 or newer

### Bare Metal Install

Create a default.json file from default.json.example under the config directory and edit the values to ones for your environment.  
Consider using `virtualenv` to isolate this Python environment from other Python programs.  

## Docker

```
docker build . -t vdi-hub

```

## Local Testing

```
 -v `pwd`/config/default.yaml:/etc/jupyterhub/config/values.yaml \

cp config/default.yaml.example config/default.yaml
docker run -ti --rm -p 5002:5002 -p 8000:8000 \
 -v `pwd`/config/kubeconfig:/root/.kube/config \
 -v `pwd`/config/jupyterhub_config.py:/srv/jupyterhub_config.py \
 -e HUB_SERVICE_HOST=localhost \
 -e HUB_SERVICE_PORT=5000 \
 -e PROXY_API_SERVICE_HOST=localhost \
 -e PROXY_API_SERVICE_PORT=5001 \
 -e PROXY_PUBLIC_SERVICE_HOST=0.0.0.0 \
 -e PROXY_PUBLIC_SERVICE_PORT=5002 \
 -e CONFIGPROXY_AUTH_TOKEN=s3cr3t \
 -e REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt \
 -e JUPYTERHUB_CRYPT_KEY=00000000000000000000000000000000 \
  vdi-hub
```

Browser: http://localhost:8000

Credentials: U: testuser P: testuser

## Test

