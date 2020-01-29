# Virtual Display for RStudio

## Installation

```
docker build . -t vdi-session-datacurator
docker tag vdi-session-rstudio ikethecoder/vdi-session-datacurator:0.8.2.1
docker tag vdi-session-rstudio ikethecoder/vdi-session-datacurator:latest
docker push ikethecoder/vdi-session-datacurator

```

## Verify Container Image

```
docker run -ti --rm --name datacurator --entrypoint /bin/bash vdi-session-datacurator
```

## Run locally

```
docker run -ti --rm -p 5000:5000 --name datacurator vdi-session-datacurator
