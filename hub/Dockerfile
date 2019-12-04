# Fire up a node container to build the JavaScript UI.
FROM node:10-alpine AS builder
COPY ./ui /app/

WORKDIR /app

RUN npm install
RUN npm build

FROM jupyterhub/k8s-hub:0.8.2

USER root

# libns33 tools are need because we need pk12util to prepare the certificate to work with Chrome browser
RUN apt-get update && apt-get install -y libnss3-tools

COPY ./k8sspawner /home/jovyan/k8sspawner
RUN pip3 install -e /home/jovyan/k8sspawner

COPY ./templates /usr/local/share/jupyterhub/templates/
COPY --from=builder /app/assets/css /usr/local/share/jupyterhub/static/css/
COPY --from=builder /app/assets/images /usr/local/share/jupyterhub/static/images/
COPY --from=builder /app/assets/favicon.ico /usr/local/share/jupyterhub/static/
COPY --from=builder /app/assets/js/bundle.js /usr/local/share/jupyterhub/static/js/

USER ${NB_USER}
