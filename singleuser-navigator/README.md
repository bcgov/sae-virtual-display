# Virtual Display for RStudio

## Installation

```
docker build . -t vdi-session-navigator
docker tag vdi-session-rstudio ikethecoder/vdi-session-navigator:0.8.2.1
docker tag vdi-session-rstudio ikethecoder/vdi-session-navigator:latest
docker push ikethecoder/vdi-session-navigator

```

## Verify Container Image

```
docker run -ti --rm --name navigator --entrypoint /bin/bash vdi-session-navigator
```

## Run locally

```
docker run -ti --rm -p 5000:5000 --name navigator vdi-session-navigator
