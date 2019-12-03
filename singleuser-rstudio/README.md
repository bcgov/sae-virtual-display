# Virtual Display for RStudio

## Installation

```
docker build . -t vdi-session-rstudio
docker tag vdi-session-rstudio ikethecoder/vdi-session-rstudio:0.8.2.1
docker tag vdi-session-rstudio ikethecoder/vdi-session-rstudio:latest
docker push ikethecoder/vdi-session-rstudio

```