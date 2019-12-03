FROM jupyterhub/k8s-hub:0.8.2

USER root

# libns33 tools are need because we need pk12util to prepare the certificate to work with Chrome browser
RUN apt-get update && apt-get install -y libnss3-tools

COPY ./k8sspawner /home/jovyan/k8sspawner
RUN pip3 install -e /home/jovyan/k8sspawner

COPY ./templates /usr/local/share/jupyterhub/templates/

USER ${NB_USER}