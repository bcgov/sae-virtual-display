# Fire up a node container to build the JavaScript UI.
FROM node:10-alpine AS builder
COPY ./ui/package*.json /app/

WORKDIR /app
RUN npm install

COPY ./ui /app/
RUN npm run build


FROM jupyterhub/k8s-hub:0.9.0-alpha.1.088.1350ad7
# Previous 0.9.0-alpha.1.088.1350ad7
# 0.9.0-beta.2 includes 1.1.0b1 (support for auth_state_hook) - does not work! (0.9.0-beta.2.000.bed779e)

USER root

# libns33 tools are need because we need pk12util to prepare the certificate to work with Chrome browser
RUN apt-get update && apt-get install -y libnss3-tools

# Needed for running proxy when testing locally - not needed when deployed with HELM
RUN apt-get update && apt-get install -y libssl1.0-dev nodejs-dev node-gyp nodejs npm
RUN npm install -g configurable-http-proxy
COPY ./simauthenticator /home/jovyan/simauthenticator
RUN pip3 install -e /home/jovyan/simauthenticator

RUN pip3 install jupyterhub_kubespawner==0.11.1
COPY ./k8sspawner /home/jovyan/k8sspawner
RUN pip3 install -e /home/jovyan/k8sspawner

RUN cp -r /usr/local/share/jupyterhub/templates /usr/local/share/jupyterhub/templates.oem
COPY ./templates /usr/local/share/jupyterhub/templates/
COPY --from=builder /app/assets/ /usr/local/share/jupyterhub/static/


USER ${NB_USER}
