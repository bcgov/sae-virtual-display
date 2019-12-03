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
docker tag vdi-hub ikethecoder/vdi-hub:0.8.2.1
docker tag vdi-hub ikethecoder/vdi-hub:latest
docker push ikethecoder/vdi-hub

```

## Helm

For both below helm commands make a copy of values.yaml within the helm/policy-api directory
and modify it to contain the values specific for your deployment.

### Helm Install (Kubernetes)

``` sh
helm install jupyterhub/jupyterhub --name=jupyterhub -f config/default.yaml

helm install --name ocwa-policy-api --namespace ocwa ./helm/policy-api -f ./helm/policy-api/config.yaml
```

### Helm Update (Kubernetes)

``` sh
helm upgrade --name ocwa-policy-api ./helm/policy-api  -f ./helm/policy-api/config.yaml
```

## Test

``` sh
pip install '.[test]'
pytest --verbose
```

Run with coverage support. The report will be generated in htmlcov/index.html.

``` sh
coverage run -m pytest
coverage report
coverage html
```
