# Virtual Display Identity Watcher

The `Identity Watcher` will watch the expiry of the user's Client Certificate, and refresh using the user's JWT.

## Installation

```
docker build . -t vdi-identity-watcher
docker tag vdi-identity-watcher ikethecoder/vdi-identity-watcher:0.8.2.1
docker tag vdi-identity-watcher ikethecoder/vdi-identity-watcher:latest
docker push ikethecoder/vdi-identity-watcher

```

## Testing

```
docker run -ti --rm vdi-identity-watcher 
```