# Virtual Display for RStudio

## Installation

```
docker build . -t vdi-session-notebook
docker tag vdi-session-notebook ikethecoder/vdi-session-notebook:0.8.2.1
docker tag vdi-session-notebook ikethecoder/vdi-session-notebook:latest
docker push ikethecoder/vdi-session-notebook
```
