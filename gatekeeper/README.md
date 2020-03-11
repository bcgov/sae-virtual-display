# Virtual Display Gatekeeper

## Installation

```
docker build . -t vdi-gatekeeper
```

## Testing

```

docker run -ti --rm \
  -p 8888:8888 \
  -e JUPYTERHUB_SERVICE_PREFIX="/user/USERID/SERVERID/"\
  vdi-gatekeeper

Optional:
  -e XPRA_ARGS="--use-display"

```